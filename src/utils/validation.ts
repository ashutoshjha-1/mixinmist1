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

  if (!/^[a-z0-9_-]{3,}$/.test(username)) {
    throw new Error(
      "Username must be at least 3 characters and can only contain letters, numbers, underscores, and hyphens"
    );
  }
};