import {
    createProfile,
    fetchProfile,
    signIn,
    signUp,
    updateUserProfile,
} from "@/services/authService";
import { User } from "@/types/auth.types";
import { createContext, useState } from "react";

interface AuthContextProps {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (user: User, password: string) => Promise<void>;
  updateProfile: (profileData: Partial<User>, avatarUri?: string) => Promise<void>;
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

  const updateProfile = async (profileData: Partial<User>, avatarUri?: string) => {
    if (!user) return;
    const updated = await updateUserProfile(user, profileData, avatarUri);
    setUser(updated);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};
