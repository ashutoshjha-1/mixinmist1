import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  Package,
  Users,
  Boxes,
  UserCircle,
  RollerCoaster,
  MessageSquare,
  HelpCircle,
  LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

const categories = [
  {
    title: "NEW",
    image: "/lovable-uploads/1e9e3bad-e337-449b-9770-a75c166b3a23.png",
    link: "/dashboard/new",
  },
  {
    title: "PRODUCT BENEFITS",
    image: "/lovable-uploads/1e9e3bad-e337-449b-9770-a75c166b3a23.png",
    link: "/dashboard/benefits",
  },
  {
    title: "TRAVEL FRIENDLY",
    image: "/lovable-uploads/1e9e3bad-e337-449b-9770-a75c166b3a23.png",
    link: "/dashboard/travel",
  },
  {
    title: "BEAUTY & SKINCARE",
    image: "/lovable-uploads/1e9e3bad-e337-449b-9770-a75c166b3a23.png",
    link: "/dashboard/beauty",
  },
  {
    title: "ACCESSORIES",
    image: "/lovable-uploads/1e9e3bad-e337-449b-9770-a75c166b3a23.png",
    link: "/dashboard/accessories",
  },
  {
    title: "MEN'S",
    image: "/lovable-uploads/1e9e3bad-e337-449b-9770-a75c166b3a23.png",
    link: "/dashboard/mens",
  },
  {
    title: "HAIR & BODY",
    image: "/lovable-uploads/1e9e3bad-e337-449b-9770-a75c166b3a23.png",
    link: "/dashboard/hair-body",
  },
  {
    title: "HEALTH & WELLNESS",
    image: "/lovable-uploads/1e9e3bad-e337-449b-9770-a75c166b3a23.png",
    link: "/dashboard/health",
  },
];

const products = [
  {
    name: "ACTIVE EYE CREAM",
    price: 18.03,
    image: "/lovable-uploads/1e9e3bad-e337-449b-9770-a75c166b3a23.png",
  },
  {
    name: "ALL-IN-ONE BODY WASH",
    price: 21.40,
    image: "/lovable-uploads/1e9e3bad-e337-449b-9770-a75c166b3a23.png",
  },
  {
    name: "ANGLED LINER BRUSH",
    price: 4.95,
    image: "/lovable-uploads/1e9e3bad-e337-449b-9770-a75c166b3a23.png",
  },
  {
    name: "ANTI-AGING ROSE GOLD OIL",
    price: 12.84,
    image: "/lovable-uploads/1e9e3bad-e337-449b-9770-a75c166b3a23.png",
  },
  {
    name: "ANTIOXIDANT TONER",
    price: 8.08,
    image: "/lovable-uploads/1e9e3bad-e337-449b-9770-a75c166b3a23.png",
  },
];

const Dashboard = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      navigate("/");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error signing out",
        description: error.message,
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-200 p-4">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-primary">blanka.</h1>
        </div>
        <div className="space-y-6">
          <div>
            <h2 className="text-sm font-semibold text-gray-400 mb-2">
              MY BRAND SETUP
            </h2>
            <Button variant="secondary" className="w-full justify-start">
              GET STARTED
            </Button>
          </div>
          <div>
            <h2 className="text-sm font-semibold text-gray-400 mb-2">
              PRODUCTS
            </h2>
            <div className="space-y-2">
              <Button
                variant="ghost"
                className="w-full justify-start"
                asChild
              >
                <Link to="/dashboard/find-products">
                  <Search className="mr-2 h-4 w-4" />
                  FIND PRODUCTS
                </Link>
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start"
                asChild
              >
                <Link to="/dashboard/my-products">
                  <Package className="mr-2 h-4 w-4" />
                  MY PRODUCTS
                </Link>
              </Button>
            </div>
          </div>
          <div>
            <h2 className="text-sm font-semibold text-gray-400 mb-2">ORDERS</h2>
            <div className="space-y-2">
              <Button
                variant="ghost"
                className="w-full justify-start"
                asChild
              >
                <Link to="/dashboard/sample-orders">
                  <Package className="mr-2 h-4 w-4" />
                  SAMPLE ORDERS
                </Link>
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start"
                asChild
              >
                <Link to="/dashboard/customer-orders">
                  <Users className="mr-2 h-4 w-4" />
                  CUSTOMER ORDERS
                </Link>
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start"
                asChild
              >
                <Link to="/dashboard/inventory-orders">
                  <Boxes className="mr-2 h-4 w-4" />
                  INVENTORY ORDERS
                </Link>
              </Button>
            </div>
          </div>
          <div>
            <h2 className="text-sm font-semibold text-gray-400 mb-2">
              MY ACCOUNT
            </h2>
            <div className="space-y-2">
              <Button
                variant="ghost"
                className="w-full justify-start"
                asChild
              >
                <Link to="/dashboard/profile">
                  <UserCircle className="mr-2 h-4 w-4" />
                  PROFILE
                </Link>
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start"
                asChild
              >
                <Link to="/dashboard/my-brand">
                  <RollerCoaster className="mr-2 h-4 w-4" />
                  MY BRAND
                </Link>
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start"
                asChild
              >
                <Link to="/dashboard/marketing">
                  <MessageSquare className="mr-2 h-4 w-4" />
                  MARKETING
                </Link>
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start"
                asChild
              >
                <Link to="/dashboard/help">
                  <HelpCircle className="mr-2 h-4 w-4" />
                  HELP
                </Link>
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start text-red-500"
                onClick={handleSignOut}
              >
                <LogOut className="mr-2 h-4 w-4" />
                SIGN OUT
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="ml-64 p-8">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-500">Latest from the blog:</p>
            <Link to="/blog" className="text-primary hover:underline">
              Beyond The Brand Blog
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="outline">My Account</Button>
            <Button onClick={handleSignOut}>Logout</Button>
          </div>
        </div>

        <div className="mb-8">
          <h1 className="text-2xl font-semibold mb-4">FIND PRODUCTS - ALL</h1>
          <div className="flex justify-between items-center">
            <Input
              type="search"
              placeholder="Search products..."
              className="max-w-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Button variant="default">ADD MY LOGO TO PRODUCTS</Button>
          </div>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {categories.map((category) => (
            <Link
              key={category.title}
              to={category.link}
              className="relative h-48 rounded-lg overflow-hidden group"
            >
              <img
                src={category.image}
                alt={category.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                <h3 className="text-white font-semibold text-lg text-center">
                  {category.title}
                </h3>
              </div>
            </Link>
          ))}
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {products.map((product) => (
            <Card key={product.name} className="overflow-hidden">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-48 object-cover"
              />
              <CardContent className="p-4">
                <h3 className="font-semibold text-sm mb-2">{product.name}</h3>
                <p className="text-primary">${product.price.toFixed(2)}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;