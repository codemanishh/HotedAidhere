import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    
    const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    const adminEmail = "codemanishh@gmail.com";
    const adminPassword = "codemanishh";

    // Check if user already exists
    const { data: existingUsers } = await supabaseAdmin.auth.admin.listUsers();
    const existingAdmin = existingUsers?.users?.find(u => u.email === adminEmail);

    let userId: string;

    if (existingAdmin) {
      userId = existingAdmin.id;
      console.log("Admin user already exists:", userId);
      
      // Reset password for existing admin
      const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
        userId,
        { password: adminPassword }
      );
      
      if (updateError) {
        console.error("Failed to reset password:", updateError.message);
      } else {
        console.log("Password reset successfully for admin user");
      }
    } else {
      // Create the admin user
      const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
        email: adminEmail,
        password: adminPassword,
        email_confirm: true,
      });

      if (createError) {
        throw new Error(`Failed to create admin user: ${createError.message}`);
      }

      userId = newUser.user.id;
      console.log("Created admin user:", userId);
    }

    // Check if admin role exists
    const { data: existingRole } = await supabaseAdmin
      .from("user_roles")
      .select("*")
      .eq("user_id", userId)
      .eq("role", "admin")
      .maybeSingle();

    if (!existingRole) {
      // Add admin role
      const { error: roleError } = await supabaseAdmin
        .from("user_roles")
        .insert({ user_id: userId, role: "admin" });

      if (roleError) {
        throw new Error(`Failed to add admin role: ${roleError.message}`);
      }
      console.log("Added admin role for user:", userId);
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Admin account ready",
        email: adminEmail 
      }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  } catch (error: any) {
    console.error("Error setting up admin:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
});
