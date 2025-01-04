import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface DashboardHeaderProps {
  onSignOut: () => void;
}

export const DashboardHeader = ({ onSignOut }: DashboardHeaderProps) => {
  return (
    <div className="mb-8 flex justify-between items-center">
      <div>
        <p className="text-sm text-gray-500">Latest from the blog:</p>
        <Link to="/blog" className="text-primary hover:underline">
          Beyond The Brand Blog
        </Link>
      </div>
      <div className="flex items-center gap-4">
        <Button variant="outline">My Account</Button>
        <Button onClick={onSignOut}>Logout</Button>
      </div>
    </div>
  );
};