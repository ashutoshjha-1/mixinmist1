import { FooterLink } from './footer';

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      products: {
        Row: {
          created_at: string
          id: string
          image_url: string
          name: string
          price: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          image_url: string
          name: string
          price: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          image_url?: string
          name?: string
          price?: number
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          full_name: string
          id: string
          phone: string | null
          store_name: string
          updated_at: string
          username: string
        }
        Insert: {
          created_at?: string
          full_name: string
          id: string
          phone?: string | null
          store_name: string
          updated_at?: string
          username: string
        }
        Update: {
          created_at?: string
          full_name?: string
          id?: string
          phone?: string | null
          store_name?: string
          updated_at?: string
          username?: string
        }
        Relationships: []
      }
      store_settings: {
        Row: {
          created_at: string
          footer_links: FooterLink[] | null
          footer_text: string | null
          hero_image_url: string | null
          hero_subtitle: string | null
          hero_title: string | null
          id: string
          store_name: string
          theme_color: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          footer_links?: FooterLink[] | null
          footer_text?: string | null
          hero_image_url?: string | null
          hero_subtitle?: string | null
          hero_title?: string | null
          id?: string
          store_name: string
          theme_color?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          footer_links?: FooterLink[] | null
          footer_text?: string | null
          hero_image_url?: string | null
          hero_subtitle?: string | null
          hero_title?: string | null
          id?: string
          store_name?: string
          theme_color?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_products: {
        Row: {
          created_at: string
          id: string
          product_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          product_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          product_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_products_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}