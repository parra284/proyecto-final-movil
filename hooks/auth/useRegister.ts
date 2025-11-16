import { useAuthContext } from "@/contexts/AuthContext";
import { User } from "@/types/auth.types";
import { supabase } from "@/utils/supabase";

export const useRegister = () => {
  const { setUser } = useAuthContext();

  const register = async (user: User, password: string) => {
    const { data, error } = await supabase.auth.signUp({
      email: user.email,
      password,
      options: {
        data: {
          name: user.name
        }
      }
    });

    if (error) throw error;

    if (data.user) {
      const { error: insertError } = await supabase
        .from("profiles")
        .insert({
          id: data.user.id,
          email: user.email,
          name: user.name
        });

      if (insertError) throw insertError;

      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", data.user.id)
        .single();

      setUser(profile);
    }
  };

  return { register };
};
