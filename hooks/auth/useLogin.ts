import { useAuthContext } from "@/contexts/AuthContext";
import { authService } from "@/services/authService";
import { useState } from "react";

export function useLogin() {
  const { setUser } = useAuthContext();

  const [loading, setLoading] = useState(false);

  const validate = (email: string, password: string) => {
    if (!email.trim()) throw new Error("Por favor ingresa tu correo.");

    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(email)) throw new Error("El correo no es válido.");

    if (!password.trim()) throw new Error("Por favor ingresa tu contraseña.");

    if (password.length < 6)
      throw new Error("La contraseña debe tener al menos 6 caracteres.");
  };

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);

      validate(email, password);

      const { success, user, message } = await authService.login(email, password);

      if (!success) {
        return { success: false, error: message };
      }

      setUser(user);
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  return { login, loading };
}