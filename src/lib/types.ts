/** Client'a gönderilecek sadeleştirilmiş ürün tipi (Decimal -> number). */
export interface ProductDTO {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  price: number;
  compareAt?: number | null;
  unit?: string | null;
  brand?: string | null;
  sku?: string | null;
  imageUrl?: string | null;
  images: string[];
  stock: number;
  freeShip: boolean;
  isFeatured: boolean;
  rating: number;
  reviewCount: number;
  categoryName?: string;
  categoryEmoji?: string | null;
  categorySlug?: string;
}
