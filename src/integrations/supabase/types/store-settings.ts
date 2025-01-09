import { FooterLink } from "./footer";
import { MenuItem } from "./menu";

export interface StoreSettings {
  id: string;
  user_id: string;
  store_name: string;
  hero_title: string | null;
  hero_subtitle: string | null;
  hero_image_url: string | null;
  footer_text: string | null;
  footer_links: FooterLink[];
  theme_color: string | null;
  created_at: string;
  updated_at: string;
  custom_domain: string | null;
  icon_image_url: string | null;
  menu_items: MenuItem[];
  bottom_menu_items: MenuItem[];
}