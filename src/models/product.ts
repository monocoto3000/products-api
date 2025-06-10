export interface ProductModel {
  id: string;
  name: string;
  description?: string;
  price: number;
  image?: string;
  stock: number;
  availability: 0 | 1;
  categoryId?: string;
  deletedAt?: Date | null;
  createdAt?: Date;
  updatedAt?: Date;
}
