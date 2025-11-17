export function validate(form: {
  email: string;
  password: string;
  name?: string;
  lastName?: string;
}): string | null {
  const { email, password, name, lastName } = form;

  if (name !== undefined) {
    if (!name.trim()) {
      return "Debes ingresar tu nombre.";
    }
  }

  if (lastName !== undefined) {
    if (!lastName.trim()) {
      return "Debes ingresar tu apellido.";
    }
  }

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
