import { supabase } from "@/utils/supabase";

export const authService = {
  async login(email: string, password: string) {

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return { success: false, message: error.message };
    }

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", data.user.id)
      .single();

    if (profileError) {
      return { success: false, message: profileError.message };
    }

    return { success: true, user: profile };
  },
};
