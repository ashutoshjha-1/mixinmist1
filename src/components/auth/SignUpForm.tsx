import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface SignUpFormProps {
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  loading: boolean;
  onSignInClick: () => void;
}

export const SignUpForm = ({ onSubmit, loading, onSignInClick }: SignUpFormProps) => {
  return (
    <form className="mt-8 space-y-6" onSubmit={onSubmit}>
      <div className="space-y-4">
        <div>
          <Label htmlFor="fullName">Full Name</Label>
          <Input
            id="fullName"
            name="fullName"
            type="text"
            required
            placeholder="John Doe"
          />
        </div>
        <div>
          <Label htmlFor="email">Email address</Label>
          <Input
            id="email"
            name="email"
            type="email"
            required
            placeholder="john@example.com"
          />
        </div>
        <div>
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            name="password"
            type="password"
            required
            placeholder="••••••••"
            minLength={6}
          />
        </div>
        <div>
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            name="phone"
            type="tel"
            placeholder="+1234567890"
          />
        </div>
        <div>
          <Label htmlFor="storeName">Store Name</Label>
          <Input
            id="storeName"
            name="storeName"
            type="text"
            required
            placeholder="My Awesome Store"
          />
        </div>
        <div>
          <Label htmlFor="username">Username</Label>
          <Input
            id="username"
            name="username"
            type="text"
            required
            placeholder="johndoe"
            pattern="^[a-z0-9_-]{3,}$"
            title="Username must be at least 3 characters and can only contain letters, numbers, underscores, and hyphens"
          />
        </div>
      </div>

      <div className="space-y-4">
        <Button
          type="submit"
          className="w-full"
          disabled={loading}
        >
          {loading ? "Creating account..." : "Sign up"}
        </Button>
        <div className="text-center">
          <span className="text-gray-600">Already have an account? </span>
          <Button
            type="button"
            variant="link"
            className="text-primary"
            onClick={onSignInClick}
          >
            Sign in
          </Button>
        </div>
      </div>
    </form>
  );
};