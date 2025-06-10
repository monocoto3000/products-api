import { Product } from '../config/sequelize/models/product.model';
import { Category } from '../config/sequelize/models/category.model';
import { Op } from 'sequelize';
import { ProductModel } from '../models/product';

export class ProductRepository {
  
  async findAll(): Promise<ProductModel[]> {
    const products = await Product.findAll({ 
      where: { deletedAt: null },
      include: [{ model: Category }],
      order: [['createdAt', 'DESC']]
    });
    return products.map(p => p.toJSON() as ProductModel);
  }

  async findById(id: string): Promise<ProductModel | null> {
    const product = await Product.findOne({ 
      where: { id, deletedAt: null },
      include: [{ model: Category }]
    });
    return product ? (product.toJSON() as ProductModel) : null;
  }

  async create(data: Omit<ProductModel, 'id' | 'createdAt' | 'updatedAt'>): Promise<ProductModel> {
    const product = await Product.create(data);
    return product.toJSON() as ProductModel;
  }

  async update(id: string, data: Partial<ProductModel>): Promise<ProductModel | null> {
    const product = await Product.findOne({ where: { id, deletedAt: null } });
    if (!product) return null;
    const updated = await product.update(data);
    return updated.toJSON() as ProductModel;
  }

  async delete(id: string): Promise<boolean> {
    const product = await Product.findOne({ where: { id, deletedAt: null } });
    if (!product) return false;
    await product.destroy();
    return true;
  }

  async findByIds(ids: string[]): Promise<ProductModel[]> {
    const products = await Product.findAll({
      where: { id: ids, deletedAt: null }
    });
    return products.map(p => p.toJSON() as ProductModel);
  }

  async updateStock(id: string, newStock: number): Promise<ProductModel | null> {
    const product = await Product.findOne({ where: { id, deletedAt: null } });
    if (!product) return null;
    const updated = await product.update({ stock: newStock });
    return updated.toJSON() as ProductModel;
  }

  async findAvailable(): Promise<ProductModel[]> {
    const products = await Product.findAll({
      where: { deletedAt: null, availability: 1 },
      order: [['createdAt', 'DESC']]
    });
    return products.map(p => p.toJSON() as ProductModel);
  }

  async findUnavailable(): Promise<ProductModel[]> {
    const products = await Product.findAll({
      where: { deletedAt: null, availability: 0 },
      order: [['createdAt', 'DESC']]
    });
    return products.map(p => p.toJSON() as ProductModel);
  }

  async findLowStock(threshold: number): Promise<ProductModel[]> {
    const products = await Product.findAll({
      where: { 
        deletedAt: null,
        stock: {
          [Op.lte]: threshold,
          [Op.gt]: 0
        }
      },
      order: [['stock', 'ASC']]
    });
    return products.map(p => p.toJSON() as ProductModel);
  }
}
