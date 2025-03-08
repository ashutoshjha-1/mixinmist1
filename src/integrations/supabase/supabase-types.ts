
import { Database as DatabaseGenerated } from './types';

// Extend the Database type to include all tables
export interface Database extends DatabaseGenerated {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          created_at: string;
          updated_at: string;
          full_name: string;
          phone: string | null;
          store_name: string;
          username: string;
        };
        Insert: {
          id: string;
          created_at?: string;
          updated_at?: string;
          full_name: string;
          phone?: string | null;
          store_name: string;
          username: string;
        };
        Update: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          full_name?: string;
          phone?: string | null;
          store_name?: string;
          username?: string;
        };
      };
      products: {
        Row: {
          id: string;
          name: string;
          price: number;
          image_url: string;
          description: string | null;
          created_at: string;
          updated_at: string;
          is_sample: boolean | null;
        };
        Insert: {
          id?: string;
          name: string;
          price: number;
          image_url: string;
          description?: string | null;
          created_at?: string;
          updated_at?: string;
          is_sample?: boolean | null;
        };
        Update: {
          id?: string;
          name?: string;
          price?: number;
          image_url?: string;
          description?: string | null;
          created_at?: string;
          updated_at?: string;
          is_sample?: boolean | null;
        };
      };
      user_products: {
        Row: {
          id: string;
          user_id: string;
          product_id: string;
          custom_price: number;
          custom_description: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          product_id: string;
          custom_price: number;
          custom_description?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          product_id?: string;
          custom_price?: number;
          custom_description?: string | null;
          created_at?: string;
        };
      };
      store_settings: {
        Row: {
          id: string;
          user_id: string;
          store_name: string;
          hero_title: string | null;
          hero_subtitle: string | null;
          hero_image_url: string | null;
          footer_text: string | null;
          custom_domain: string | null;
          theme_color: string | null;
          icon_image_url: string | null;
          footer_links: any | null;
          menu_items: any | null;
          bottom_menu_items: any | null;
          created_at: string;
          updated_at: string;
          carousel_images: any | null;
          carousel_buttons: any | null;
          show_wave_design: boolean | null;
          show_hero: boolean | null;
          show_carousel: boolean | null;
          wave_color: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          store_name: string;
          hero_title?: string | null;
          hero_subtitle?: string | null;
          hero_image_url?: string | null;
          footer_text?: string | null;
          custom_domain?: string | null;
          theme_color?: string | null;
          icon_image_url?: string | null;
          footer_links?: any | null;
          menu_items?: any | null;
          bottom_menu_items?: any | null;
          created_at?: string;
          updated_at?: string;
          carousel_images?: any | null;
          carousel_buttons?: any | null;
          show_wave_design?: boolean | null;
          show_hero?: boolean | null;
          show_carousel?: boolean | null;
          wave_color?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          store_name?: string;
          hero_title?: string | null;
          hero_subtitle?: string | null;
          hero_image_url?: string | null;
          footer_text?: string | null;
          custom_domain?: string | null;
          theme_color?: string | null;
          icon_image_url?: string | null;
          footer_links?: any | null;
          menu_items?: any | null;
          bottom_menu_items?: any | null;
          created_at?: string;
          updated_at?: string;
          carousel_images?: any | null;
          carousel_buttons?: any | null;
          show_wave_design?: boolean | null;
          show_hero?: boolean | null;
          show_carousel?: boolean | null;
          wave_color?: string | null;
        };
      };
      orders: {
        Row: {
          id: string;
          store_id: string;
          customer_name: string;
          customer_email: string;
          customer_address: string;
          total_amount: number;
          status: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          store_id: string;
          customer_name: string;
          customer_email: string;
          customer_address: string;
          total_amount: number;
          status?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          store_id?: string;
          customer_name?: string;
          customer_email?: string;
          customer_address?: string;
          total_amount?: number;
          status?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      order_items: {
        Row: {
          id: string;
          order_id: string;
          product_id: string;
          quantity: number;
          price: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          order_id: string;
          product_id: string;
          quantity: number;
          price: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          order_id?: string;
          product_id?: string;
          quantity?: number;
          price?: number;
          created_at?: string;
        };
      };
      sample_orders: {
        Row: {
          id: string;
          store_id: string;
          customer_name: string;
          customer_email: string;
          customer_address: string;
          total_amount: number;
          status: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          store_id: string;
          customer_name: string;
          customer_email: string;
          customer_address: string;
          total_amount: number;
          status?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          store_id?: string;
          customer_name?: string;
          customer_email?: string;
          customer_address?: string;
          total_amount?: number;
          status?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      sample_order_items: {
        Row: {
          id: string;
          order_id: string;
          product_id: string;
          quantity: number;
          price: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          order_id: string;
          product_id: string;
          quantity: number;
          price: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          order_id?: string;
          product_id?: string;
          quantity?: number;
          price?: number;
          created_at?: string;
        };
      };
      user_roles: {
        Row: {
          id: string;
          user_id: string | null;
          role: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          role?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          role?: string | null;
          created_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      get_user_role: {
        Args: { user_id: string };
        Returns: string;
      };
      promote_to_admin: {
        Args: { email_to_promote: string };
        Returns: void;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};
