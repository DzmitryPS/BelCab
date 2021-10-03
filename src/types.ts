import { SubCategory } from "./models";

export interface DefaultDocumentData {
  id: number;
}

export interface UserData {
  id: number;
  name?: string;
}

export interface ProductData {
  id: number;
  name: string;
  subCategories: SubCategoryData[];
  image?: string;
  naznachenye: string;
  construcya: string;
  th: string;
  expluatation: string;
  size?: SizeData[];
}

export interface SizeData {
  id: number;
  product: ProductData;
  number: number;
  sechenye_zyl: number;
  number_of_zyl: number;
  max_diametr?: number;
  massa?: number;
  konstrukcya_zyli?: string;
}

export interface SourceData {
  id: number;
}

export interface CategoryData {
  id: number;
  name: string;
  subCategories: SubCategory[]
}

export interface SubCategoryData {
  id: number;
  category: CategoryData;
  products?: ProductData[];
}