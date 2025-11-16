import { useAuthContext } from "@/contexts/AuthContext";
import { supabase } from "@/utils/supabase";
import { useUploadAvatar } from "./useUploadAvatar";

export const useProfile = () => {
  const { user, setUser } = useAuthContext();
  const { uploadAvatar } = useUploadAvatar();

  const updateProfile = async (fields: any, avatarUri?: string) => {
    if (!user) throw new Error("No hay usuario logueado");

    const avatar_url = await uploadAvatar(avatarUri, user.id, user.avatar_url);

    const { error } = await supabase
      .from("profiles")
      .update({
        ...fields,
        avatar_url,
        updated_at: new Date().toISOString()
      })
      .eq("id", user.id);

    if (error) throw error;

    setUser({
      ...user,
      ...fields,
      avatar_url
    });
  };

  return { updateProfile };
};
