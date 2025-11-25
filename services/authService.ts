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

// Login o registro con Google
export const signInWithGoogle = async (accessToken: string) => {
  try {
    // 1. Obtener info del usuario desde Google
    const res = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    const googleUser = await res.json();

    console.log(googleUser);

    if (!googleUser.email) throw new Error("No se pudo obtener el email del usuario");

    const userData: User = {
      id: "",
      email: googleUser.email,
      name: googleUser.given_name || "",
      last_name: googleUser.family_name || "",
      avatar_url: googleUser.picture || "",
    };

    // 2. Revisar si el usuario ya existe en Supabase Auth
    let { data: existingUser } = await supabase
      .from('profiles')
      .select('*')
      .eq('email', userData.email)
      .single();

    let userId: string;

    if (!existingUser) {
      // 3a. Si no existe, creamos usuario en Auth (sin password)
      const { data, error } = await supabase.auth.signUp({
        email: userData.email,
        password: Math.random().toString(36).slice(-8), // password temporal
        options: { data: { name: userData.name, last_name: userData.last_name } },
      });

      if (error) throw error;
      userId = data.user?.id!;
      // 3b. Crear perfil en tabla profiles
      await createProfile(userData, userId);
    } else {
      // 4. Si existe, actualizamos datos del perfil
      userId = existingUser.id;
      await updateUserProfileData(existingUser, userData);
    }

    // 5. Devolver info del usuario
    return { ...userData, id: userId };
  } catch (error) {
    console.error('Error signInWithGoogle:', error);
    throw error;
  }
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
  return true;
};