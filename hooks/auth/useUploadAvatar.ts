import { supabase } from "@/utils/supabase";
import { decode } from "base64-arraybuffer-es6";
import { File } from "expo-file-system";

export const useUploadAvatar = () => {

  const uploadAvatar = async (avatarUri: string | undefined, userId: string, oldUrl?: string) => {
    if (!avatarUri || avatarUri.startsWith("http")) return oldUrl;

    const base64 = await new File(avatarUri).base64();
    const fileName = `public/avatars/${userId}-${Date.now()}.jpg`;

    const { error } = await supabase.storage
      .from("avatars")
      .upload(fileName, decode(base64), {
        contentType: "image/jpeg",
        upsert: true,
      });

    if (error) throw error;

    const { data } = supabase.storage
      .from("avatars")
      .getPublicUrl(fileName);

    if (!data) throw new Error("no public URL returned");

    if (oldUrl) {
      const oldPath = oldUrl.split("/object/public/avatars/")[1];
      await supabase.storage.from("avatars").remove([oldPath]);
    }

    return data.publicUrl;
  };

  return { uploadAvatar };
};
