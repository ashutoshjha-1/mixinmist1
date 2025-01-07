export const validateSignupForm = (formData: FormData) => {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const fullName = formData.get("fullName") as string;
  const storeName = formData.get("storeName") as string;
  const username = formData.get("username") as string;
  const phone = formData.get("phone") as string;

  if (!email?.trim() || !password?.trim() || !fullName?.trim() || !storeName?.trim() || !username?.trim()) {
    throw new Error("All required fields must be filled");
  }

  // Validate username format
  const usernameRegex = /^[a-z0-9_-]{3,}$/;
  if (!usernameRegex.test(username.toLowerCase())) {
    throw new Error("Username must be at least 3 characters and can only contain lowercase letters, numbers, underscores, and hyphens");
  }

  if (password.length < 6) {
    throw new Error("Password must be at least 6 characters");
  }

  return {
    email: email.trim(),
    password,
    metadata: {
      full_name: fullName.trim(),
      phone: phone?.trim() || null,
      store_name: storeName.trim(),
      username: username.toLowerCase().trim(),
    }
  };
};