import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/components/ui/use-toast';

export const useCustomDomain = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [storeName, setStoreName] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const resolveCustomDomain = async () => {
      try {
        // Only proceed if we're not on localhost
        if (window.location.hostname === 'localhost') {
          setIsLoading(false);
          return;
        }

        const { data, error } = await supabase.functions.invoke('resolve-custom-domain', {
          body: JSON.stringify({}),
        });

        if (error) throw error;

        if (data.storeName) {
          setStoreName(data.storeName);
          // Navigate to the store page if we're not already there
          if (!window.location.pathname.startsWith('/store/')) {
            navigate(`/store/${data.storeName}`);
          }
        }
      } catch (error) {
        console.error('Error resolving custom domain:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to resolve custom domain. Please try again later.",
        });
      } finally {
        setIsLoading(false);
      }
    };

    resolveCustomDomain();
  }, [navigate]);

  return { isLoading, storeName };
};