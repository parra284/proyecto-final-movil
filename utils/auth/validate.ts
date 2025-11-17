export function validate(email: string, password:string): string | null {
    if (!email.trim()) {
      return "Debes ingresar un correo electrónico.";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return "El correo electrónico no es válido.";
    }

    if (!password.trim()) {
      return "Debes ingresar una contraseña.";
    }

    if (password.length < 8) {
      return "La contraseña debe tener al menos 8 caracteres.";
    }

    return null;
}