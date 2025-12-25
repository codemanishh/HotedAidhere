import { useState, useEffect, useCallback, memo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { MessageCircle, Send, Reply, User } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface Comment {
  id: string;
  job_id: string;
  parent_id: string | null;
  anonymous_name: string;
  content: string;
  created_at: string;
  replies?: Comment[];
}

interface CommentCardProps {
  comment: Comment;
  depth?: number;
  replyingTo: string | null;
  replyContent: string;
  isLoading: boolean;
  onReplyClick: (commentId: string) => void;
  onReplyContentChange: (content: string) => void;
  onSubmitReply: (content: string, parentId: string) => void;
  onCancelReply: () => void;
}

const MAX_DEPTH = 5; // Limit nesting depth for UI

const CommentCard = memo(({ 
  comment, 
  depth = 0,
  replyingTo,
  replyContent,
  isLoading,
  onReplyClick,
  onReplyContentChange,
  onSubmitReply,
  onCancelReply
}: CommentCardProps) => {
  const isNested = depth > 0;
  
  return (
    <div className={`${isNested ? 'ml-6 border-l-2 border-border pl-4' : ''} mb-4`}>
      <div className="bg-card rounded-lg p-4 shadow-sm border border-border">
        <div className="flex items-center gap-2 mb-2">
          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
            <User className="h-4 w-4 text-primary" />
          </div>
          <div>
            <p className="font-medium text-sm text-foreground">{comment.anonymous_name}</p>
            <p className="text-xs text-muted-foreground">
              {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
            </p>
          </div>
        </div>
        <p className="text-foreground/90 text-sm whitespace-pre-wrap">{comment.content}</p>
        
        {/* Always show Reply button, but limit depth */}
        {depth < MAX_DEPTH && (
          <Button
            variant="ghost"
            size="sm"
            className="mt-2 text-muted-foreground hover:text-primary"
            onClick={() => onReplyClick(comment.id)}
          >
            <Reply className="h-4 w-4 mr-1" />
            Reply
          </Button>
        )}

        {replyingTo === comment.id && (
          <div className="mt-3 space-y-2">
            <Textarea
              placeholder="Write your reply..."
              value={replyContent}
              onChange={(e) => onReplyContentChange(e.target.value)}
              className="min-h-[80px]"
              autoFocus
            />
            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={() => onSubmitReply(replyContent, comment.id)}
                disabled={isLoading}
              >
                <Send className="h-4 w-4 mr-1" />
                {isLoading ? 'Posting...' : 'Reply'}
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={onCancelReply}
              >
                Cancel
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Render nested replies */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="mt-2">
          {comment.replies.map((reply) => (
            <CommentCard 
              key={reply.id} 
              comment={reply}
              depth={depth + 1}
              replyingTo={replyingTo}
              replyContent={replyContent}
              isLoading={isLoading}
              onReplyClick={onReplyClick}
              onReplyContentChange={onReplyContentChange}
              onSubmitReply={onSubmitReply}
              onCancelReply={onCancelReply}
            />
          ))}
        </div>
      )}
    </div>
  );
});

CommentCard.displayName = 'CommentCard';

interface CommentSectionProps {
  jobId: string;
}

// Build nested comment tree from flat list
const buildCommentTree = (comments: Comment[]): Comment[] => {
  const commentMap = new Map<string, Comment>();
  const rootComments: Comment[] = [];

  // First pass: create a map of all comments
  comments.forEach(comment => {
    commentMap.set(comment.id, { ...comment, replies: [] });
  });

  // Second pass: build the tree structure
  comments.forEach(comment => {
    const currentComment = commentMap.get(comment.id)!;
    if (comment.parent_id) {
      const parentComment = commentMap.get(comment.parent_id);
      if (parentComment) {
        parentComment.replies = parentComment.replies || [];
        parentComment.replies.push(currentComment);
      } else {
        // Orphan comment (parent deleted), show as root
        rootComments.push(currentComment);
      }
    } else {
      rootComments.push(currentComment);
    }
  });

  return rootComments;
};

export const CommentSection = ({ jobId }: CommentSectionProps) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [anonymousName, setAnonymousName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState("");
  const { toast } = useToast();

  const fetchComments = useCallback(async () => {
    const { data, error } = await supabase
      .from('job_comments')
      .select('*')
      .eq('job_id', jobId)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching comments:', error);
      return;
    }

    // Build nested tree structure
    const nestedComments = buildCommentTree(data || []);
    setComments(nestedComments);
  }, [jobId]);

  useEffect(() => {
    fetchComments();

    const channel = supabase
      .channel('job-comments')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'job_comments',
          filter: `job_id=eq.${jobId}`
        },
        () => {
          fetchComments();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [jobId, fetchComments]);

  const moderateContent = async (content: string): Promise<{ allowed: boolean; reason: string }> => {
    try {
      const { data, error } = await supabase.functions.invoke('moderate-comment', {
        body: { content }
      });

      if (error) {
        console.error('Moderation error:', error);
        return { allowed: true, reason: '' };
      }

      return data;
    } catch (error) {
      console.error('Moderation request failed:', error);
      return { allowed: true, reason: '' };
    }
  };

  const submitComment = useCallback(async (content: string, parentId: string | null = null) => {
    if (!content.trim()) {
      toast({
        title: "Error",
        description: "Please enter a comment",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    try {
      const moderation = await moderateContent(content);

      if (!moderation.allowed) {
        toast({
          title: "Comment not allowed",
          description: moderation.reason || "Your comment contains inappropriate content. Please revise and try again.",
          variant: "destructive"
        });
        setIsLoading(false);
        return;
      }

      const { error } = await supabase
        .from('job_comments')
        .insert({
          job_id: jobId,
          parent_id: parentId,
          anonymous_name: anonymousName.trim() || 'Anonymous',
          content: content.trim()
        });

      if (error) {
        console.error('Error posting comment:', error);
        toast({
          title: "Error",
          description: "Failed to post comment. Please try again.",
          variant: "destructive"
        });
        return;
      }

      toast({
        title: "Success",
        description: "Your comment has been posted!",
      });

      if (parentId) {
        setReplyContent("");
        setReplyingTo(null);
      } else {
        setNewComment("");
      }
      
      fetchComments();
    } catch (error) {
      console.error('Submit error:', error);
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }, [jobId, anonymousName, toast, fetchComments]);

  const handleReplyClick = useCallback((commentId: string) => {
    setReplyingTo(prev => prev === commentId ? null : commentId);
    setReplyContent("");
  }, []);

  const handleReplyContentChange = useCallback((content: string) => {
    setReplyContent(content);
  }, []);

  const handleCancelReply = useCallback(() => {
    setReplyingTo(null);
    setReplyContent("");
  }, []);

  const handleSubmitReply = useCallback((content: string, parentId: string) => {
    submitComment(content, parentId);
  }, [submitComment]);

  // Count total comments including nested
  const countAllComments = (commentList: Comment[]): number => {
    let count = commentList.length;
    commentList.forEach(c => {
      if (c.replies) {
        count += countAllComments(c.replies);
      }
    });
    return count;
  };

  const totalComments = countAllComments(comments);

  return (
    <div className="mt-8 border-t border-border pt-8">
      <h2 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
        <MessageCircle className="h-5 w-5" />
        Discussion ({totalComments})
      </h2>

      {/* New Comment Form */}
      <div className="bg-card rounded-lg p-4 border border-border mb-6">
        <div className="space-y-4">
          <Input
            placeholder="Your name (optional - leave empty for Anonymous)"
            value={anonymousName}
            onChange={(e) => setAnonymousName(e.target.value)}
            className="max-w-xs"
          />
          <Textarea
            placeholder="Ask a question or share your thoughts about this job..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="min-h-[100px]"
          />
          <Button
            onClick={() => submitComment(newComment)}
            disabled={isLoading || !newComment.trim()}
          >
            <Send className="h-4 w-4 mr-2" />
            {isLoading ? 'Posting...' : 'Post Comment'}
          </Button>
        </div>
        <p className="text-xs text-muted-foreground mt-3">
          Comments are moderated. Abusive or inappropriate content will be blocked.
        </p>
      </div>

      {/* Comments List */}
      <div className="space-y-4">
        {comments.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <MessageCircle className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>No comments yet. Be the first to start the discussion!</p>
          </div>
        ) : (
          comments.map((comment) => (
            <CommentCard 
              key={comment.id} 
              comment={comment}
              depth={0}
              replyingTo={replyingTo}
              replyContent={replyContent}
              isLoading={isLoading}
              onReplyClick={handleReplyClick}
              onReplyContentChange={handleReplyContentChange}
              onSubmitReply={handleSubmitReply}
              onCancelReply={handleCancelReply}
            />
          ))
        )}
      </div>
    </div>
  );
};
