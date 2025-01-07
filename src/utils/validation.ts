export const validateSignupForm = (
  email: string,
  password: string,
  fullName: string,
  storeName: string,
  username: string
) => {
  if (!email || !password || !fullName || !storeName || !username) {
    throw new Error("All required fields must be filled");
  }

  if (!/^[a-z0-9_-]{3,}$/.test(username.toLowerCase())) {
    throw new Error(
      "Username must be at least 3 characters and can only contain letters, numbers, underscores, and hyphens"
    );
  }

  if (password.length < 6) {
    throw new Error("Password must be at least 6 characters long");
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new Error("Please enter a valid email address");
  }

  // Additional validation for store name
  if (storeName.trim().length < 3) {
    throw new Error("Store name must be at least 3 characters long");
  }
};