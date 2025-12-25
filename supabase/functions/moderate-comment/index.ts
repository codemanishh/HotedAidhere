import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// List of blocked words/patterns (abusive, 18+, spam keywords)
const blockedWords = [
  // Profanity
  'fuck', 'shit', 'ass', 'bitch', 'bastard', 'damn', 'crap', 'piss', 'dick', 'cock',
  'pussy', 'asshole', 'motherfucker', 'bullshit', 'cunt', 'whore', 'slut', 'fag',
  'nigger', 'nigga', 'retard', 'idiot', 'stupid', 'dumb',
  // Hindi abusive words
  'chutiya', 'madarchod', 'behenchod', 'bhenchod', 'gandu', 'lund', 'chut', 'randi',
  'harami', 'bhosdike', 'lavda', 'gaand', 'saala', 'kamina', 'hijda',
  // 18+ content
  'porn', 'xxx', 'sex', 'nude', 'naked', 'boobs', 'tits', 'penis', 'vagina',
  'horny', 'orgasm', 'masturbat', 'erotic', 'nsfw', 'onlyfans',
  // Spam patterns
  'buy now', 'click here', 'free money', 'earn money', 'crypto', 'bitcoin',
  'lottery', 'winner', 'prize', 'telegram.me', 'whatsapp.me',
  // Hate speech
  'kill yourself', 'go die', 'hate you', 'terrorist', 'bomb'
];

// Patterns to detect variations (l33t speak, spacing tricks)
const detectVariations = (text: string): string => {
  return text
    .toLowerCase()
    .replace(/0/g, 'o')
    .replace(/1/g, 'i')
    .replace(/3/g, 'e')
    .replace(/4/g, 'a')
    .replace(/5/g, 's')
    .replace(/7/g, 't')
    .replace(/8/g, 'b')
    .replace(/@/g, 'a')
    .replace(/\$/g, 's')
    .replace(/\s+/g, '') // Remove spaces between letters
    .replace(/[._-]/g, ''); // Remove common separators
};

const containsBlockedContent = (content: string): { blocked: boolean; reason: string } => {
  const normalizedContent = detectVariations(content);
  const originalLower = content.toLowerCase();
  
  for (const word of blockedWords) {
    const normalizedWord = detectVariations(word);
    
    // Check in normalized content (catches l33t speak)
    if (normalizedContent.includes(normalizedWord)) {
      return { 
        blocked: true, 
        reason: 'Your comment contains inappropriate language. Please keep the discussion professional.' 
      };
    }
    
    // Check in original (for multi-word phrases)
    if (originalLower.includes(word.toLowerCase())) {
      return { 
        blocked: true, 
        reason: 'Your comment contains inappropriate content. Please revise and try again.' 
      };
    }
  }
  
  // Check for excessive caps (shouting)
  const capsRatio = (content.match(/[A-Z]/g) || []).length / content.length;
  if (content.length > 10 && capsRatio > 0.7) {
    return { 
      blocked: true, 
      reason: 'Please avoid using excessive capital letters.' 
    };
  }
  
  // Check for URL spam
  const urlCount = (content.match(/https?:\/\//g) || []).length;
  if (urlCount > 2) {
    return { 
      blocked: true, 
      reason: 'Too many links in your comment. Please limit to 2 or fewer.' 
    };
  }
  
  // Check for repeated characters (spam)
  if (/(.)\1{5,}/.test(content)) {
    return { 
      blocked: true, 
      reason: 'Please avoid repeated characters.' 
    };
  }
  
  return { blocked: false, reason: '' };
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { content } = await req.json();
    
    if (!content || typeof content !== 'string') {
      return new Response(
        JSON.stringify({ error: 'Content is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Moderating content:', content.substring(0, 50) + '...');

    const result = containsBlockedContent(content);
    
    console.log('Moderation result:', result.blocked ? 'BLOCKED' : 'ALLOWED');

    return new Response(
      JSON.stringify({ 
        allowed: !result.blocked, 
        reason: result.reason 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Moderation error:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
