export function validate(form: {
  email: string;
  password: string;
  name?: string;
  lastName?: string;
}): string | null {
  const { email, password, name, lastName } = form;

  const nameRegex = /^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ\s]+$/;

  // Nombre: obligatorio y solo letras
  if (name !== undefined) {
    if (!name.trim()) {
      return "Debes ingresar tu nombre.";
    }

    if (!nameRegex.test(name.trim())) {
      return "El nombre solo puede contener letras.";
    }
  }

  // Apellido: opcional pero si viene, debe ser solo letras
  if (lastName !== undefined && lastName.trim().length > 0) {
    if (!nameRegex.test(lastName.trim())) {
      return "El apellido solo puede contener letras.";
    }
  }

  // Email
  if (!email.trim()) {
    return "Debes ingresar un correo electrónico.";
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.trim())) {
    return "El correo electrónico no es válido.";
  }

  // Password
  if (!password.trim()) {
    return "Debes ingresar una contraseña.";
  }

  if (password.length < 8) {
    return "La contraseña debe tener al menos 8 caracteres.";
  }

  return null;
}
