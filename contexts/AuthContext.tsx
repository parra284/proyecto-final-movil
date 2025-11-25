import {
  createProfile,
  fetchProfile,
  signIn,
  signOut,
  signUp,
  updateUserAvatar,
  updateUserProfileData
} from "@/services/authService";
import { User } from "@/types/auth.types";
import { createContext, useState } from "react";

interface AuthContextProps {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (user: User, password: string) => Promise<void>;
  updateImage: (avatarUri: string) => Promise<void>;
  updateData: (profileData: Partial<User>) => Promise<void>;
}

export const AuthContext = createContext({} as AuthContextProps);

export const AuthProvider = ({ children }: any) => {
  const [user, setUser] = useState<User | null>(null);

  const login = async (email: string, password: string) => {
    const authUser = await signIn(email, password);
    const profile = await fetchProfile(authUser.id);
    setUser(profile);
  };

  const register = async (newUser: User, password: string) => {
    const authUser = await signUp(newUser, password);
    if (!authUser) return;

    await createProfile(newUser, authUser.id);
    const profile = await fetchProfile(authUser.id);
    setUser(profile);
  };

  const updateImage = async(avatarUri: string) => {
      if (!user) return
      await updateUserAvatar(user, avatarUri);
  };

  const updateData = async(profileData: Partial<User>) => {
      if (!user) return
      await updateUserProfileData(user, profileData);

      setUser((prevUser) => ({
        ...prevUser!,
        ...profileData,
      }));
  }

  const logout = async() => {
    await signOut();
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, register, updateImage, updateData, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
