import { useState } from "react";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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

const FindProducts = () => {
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

  const handleAddToStore = async (product: any) => {
    try {
      const { data: profile } = await supabase
        .from("profiles")
        .select("id")
        .single();

      if (!profile) {
        throw new Error("Profile not found");
      }

      toast({
        title: "Product Added",
        description: `${product.name} has been added to your store`,
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error adding product",
        description: error.message,
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardSidebar />
      <div className="ml-64 p-8">
        <DashboardHeader onSignOut={handleSignOut} />

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
            <div
              key={category.title}
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
            </div>
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
                <p className="text-primary mb-2">${product.price.toFixed(2)}</p>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => handleAddToStore(product)}
                >
                  Add to My Store
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FindProducts;
