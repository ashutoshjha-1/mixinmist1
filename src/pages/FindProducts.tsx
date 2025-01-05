import { useState } from "react";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { ProductCard } from "@/components/store/ProductCard";
import { AdminProductDialog } from "@/components/store/AdminProductDialog";

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

const FindProducts = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [addedProducts, setAddedProducts] = useState<Set<string>>(new Set());
  const [isAdminDialogOpen, setIsAdminDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  const { data: isAdmin } = useQuery({
    queryKey: ["isAdmin"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return false;
      
      const { data } = await supabase.rpc('is_admin', {
        user_id: user.id
      });
      return !!data;
    }
  });

  const { data: products, isLoading, refetch } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

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

  const handleAddToStore = async (
    productId: string,
    customPrice: number,
    customName: string,
    customDescription: string
  ) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error("User not authenticated");
      }

      const { data: existingProduct } = await supabase
        .from("user_products")
        .select("*")
        .eq("user_id", user.id)
        .eq("product_id", productId)
        .maybeSingle();

      if (existingProduct) {
        toast({
          title: "Product Already Added",
          description: "This product is already in your store",
        });
        setAddedProducts(prev => new Set([...prev, productId]));
        return;
      }

      const { error } = await supabase
        .from("user_products")
        .insert({
          user_id: user.id,
          product_id: productId,
          custom_price: customPrice,
          custom_description: customDescription,
        });

      if (error) throw error;

      setAddedProducts(prev => new Set([...prev, productId]));

      toast({
        title: "Product Added",
        description: "Product has been added to your store",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error adding product",
        description: error.message,
      });
    }
  };

  const handleEditProduct = (product: any) => {
    setEditingProduct(product);
    setIsAdminDialogOpen(true);
  };

  const handleSaveProduct = async (productData: any) => {
    try {
      if (editingProduct) {
        const { error } = await supabase
          .from("products")
          .update({
            name: productData.name,
            price: productData.price,
            description: productData.description,
            image_url: productData.image_url,
          })
          .eq("id", editingProduct.id);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Product updated successfully",
        });
      } else {
        const { error } = await supabase
          .from("products")
          .insert([{
            name: productData.name,
            price: productData.price,
            description: productData.description,
            image_url: productData.image_url,
          }]);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Product added successfully",
        });
      }

      setIsAdminDialogOpen(false);
      setEditingProduct(null);
      refetch();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    }
  };

  const filteredProducts = products?.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
            <div className="space-x-4">
              {isAdmin && (
                <Button 
                  variant="default"
                  onClick={() => {
                    setEditingProduct(null);
                    setIsAdminDialogOpen(true);
                  }}
                >
                  Add New Product
                </Button>
              )}
              <Button variant="default">ADD MY LOGO TO PRODUCTS</Button>
            </div>
          </div>
        </div>

        {/* Categories grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {categories.map((category) => (
            <div
              key={category.title}
              className="relative h-48 rounded-lg overflow-hidden group cursor-pointer"
              onClick={() => navigate(category.link)}
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

        {isLoading ? (
          <div className="text-center py-12">Loading products...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {filteredProducts?.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToStore={handleAddToStore}
                isAdded={addedProducts.has(product.id)}
                isAdmin={isAdmin}
                onEdit={handleEditProduct}
              />
            ))}
          </div>
        )}

        <AdminProductDialog
          isOpen={isAdminDialogOpen}
          onClose={() => {
            setIsAdminDialogOpen(false);
            setEditingProduct(null);
          }}
          onSave={handleSaveProduct}
          product={editingProduct}
        />
      </div>
    </div>
  );
};

export default FindProducts;
