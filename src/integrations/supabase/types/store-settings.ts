export interface CarouselImage {
  url: string;
  buttonText?: string;
  buttonUrl?: string;
}

export interface StoreSettings {
  id: string;
  user_id: string;
  store_name: string;
  hero_title: string | null;
  hero_subtitle: string | null;
  hero_image_url: string | null;
  footer_text: string | null;
  footer_links: any[] | null;
  theme_color: string | null;
  custom_domain: string | null;
  icon_image_url: string | null;
  menu_items: any[] | null;
  bottom_menu_items: any[] | null;
  carousel_images: CarouselImage[] | null;
  created_at: string;
  updated_at: string;
}