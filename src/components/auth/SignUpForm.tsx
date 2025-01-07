import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Mail, Lock, User, Phone, Store, AtSign } from "lucide-react";

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
          <div className="relative">
            <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <Input
              id="fullName"
              name="fullName"
              type="text"
              required
              className="pl-10"
              placeholder="John Doe"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="email">Email address</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <Input
              id="email"
              name="email"
              type="email"
              required
              className="pl-10"
              placeholder="you@example.com"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <Input
              id="password"
              name="password"
              type="password"
              required
              className="pl-10"
              placeholder="••••••••"
              minLength={6}
            />
          </div>
        </div>

        <div>
          <Label htmlFor="phone">Phone (optional)</Label>
          <div className="relative">
            <Phone className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <Input
              id="phone"
              name="phone"
              type="tel"
              className="pl-10"
              placeholder="+1234567890"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="storeName">Store Name</Label>
          <div className="relative">
            <Store className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <Input
              id="storeName"
              name="storeName"
              type="text"
              required
              className="pl-10"
              placeholder="My Awesome Store"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="username">Username</Label>
          <div className="relative">
            <AtSign className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <Input
              id="username"
              name="username"
              type="text"
              required
              className="pl-10"
              placeholder="johndoe"
              pattern="^[a-z0-9_-]{3,}$"
              title="Username must be at least 3 characters and can only contain letters, numbers, underscores, and hyphens"
            />
          </div>
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