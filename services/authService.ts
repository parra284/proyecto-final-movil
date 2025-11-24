import { User } from "@/types/auth.types";
import { supabase } from "@/utils/supabase";
import { decode } from "base64-arraybuffer-es6";
import { File } from "expo-file-system";

export const fetchProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();

  if (error) throw error;
  return data;
};

export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;

  return data.user;
};

export const signUp = async (user: User, password: string) => {
  const { data, error } = await supabase.auth.signUp({
    email: user.email,
    password,
    options: { data: { name: user.name } },
  });

  if (error) throw error;

  return data.user;
};

export const createProfile = async (user: User, userId: string) => {
  const { error } = await supabase.from("profiles").insert({
    id: userId,
    email: user.email,
    name: user.name,
  });

  if (error) throw error;
};

// Actualiza los datos generales del usuario (nombre, email, etc.)
export const updateUserProfileData = async (user: User, profileData: Partial<User>) => {
  const { error } = await supabase
    .from("profiles")
    .update({
      ...profileData,
      updated_at: new Date().toISOString(),
    })
    .eq("id", user.id);

  if (error) throw error;

  return { ...user, ...profileData };
};

// Actualiza únicamente la imagen de perfil
export const updateUserAvatar = async (user: User, avatarUri: string) => {
  let avatar_url = user.avatar_url;

  if (avatarUri && !avatarUri.startsWith("http")) {
    const base64 = await new File(avatarUri).base64();
    const fileName = `public/avatars/${user.id}-${Date.now()}.jpg`;

    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(fileName, decode(base64), {
        contentType: "image/jpeg",
        cacheControl: "3600",
        upsert: true,
      });

    if (uploadError) throw uploadError;

    const { data } = supabase.storage.from("avatars").getPublicUrl(fileName);
    if (!data) throw new Error("getPublicUrl error");

    avatar_url = data.publicUrl;

    // Borra la antigua imagen si existe
    if (user.avatar_url) {
      const oldPath = user.avatar_url.split("/object/public/avatars/")[1];
      await supabase.storage.from("avatars").remove([oldPath]);
    }
  }

  // Actualiza el perfil con la nueva URL
  const { error } = await supabase
    .from("profiles")
    .update({
      avatar_url,
      updated_at: new Date().toISOString(),
    })
    .eq("id", user.id);

  if (error) throw error;

  return { ...user, avatar_url };
};
