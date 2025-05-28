import { Product } from '../models/product.model';
import { HttpException } from '../utils/exceptions';
import { Category } from '../models/category.model';
import { Op } from 'sequelize';

export class ProductService {
  async getAll() {
    return await Product.findAll({ 
      where: { deletedAt: null },
      include: [{ model: Category }],
      order: [['createdAt', 'DESC']]
    });
  }

  async getById(id: string) {
    const product = await Product.findOne({ 
      where: { id, deletedAt: null },
      include: [{ model: Category }]
    });
    if (!product) throw new HttpException(404, 'Product not found');
    return product;
  }

  async create(data: any) {
    const product = await Product.create(data);
    console.log(`Producto creado: ${data.name} con stock inicial de ${data.stock || 0}`);
    return product;
  }

  async update(id: string, data: any) {
    const product = await Product.findOne({ where: { id, deletedAt: null } });
    if (!product) throw new HttpException(404, 'Product not found');
    
    const updatedProduct = await product.update({ ...data });
    console.log(`Producto actualizado: ID ${id}`);
    return updatedProduct;
  }

  async delete(id: string) {
    const product = await Product.findOne({ where: { id, deletedAt: null } });
    if (!product) throw new HttpException(404, 'Product not found');

    await product.destroy();
    console.log(`Producto eliminado: ID ${id}`);
  }

  async addStockBulk(items: { id: string, quantity: number }[]) {
    const results = [];
    for (const { id, quantity } of items) {
      try {
        if (quantity <= 0) throw new HttpException(400, 'La cantidad debe ser mayor a 0');
        const product = await Product.findOne({ where: { id, deletedAt: null } });
        if (!product) throw new HttpException(404, 'Product not found');
        const currentStock = product.getDataValue('stock');
        const newStock = currentStock + quantity;
        await product.update({ stock: newStock });
        results.push({
          productId: id,
          previousStock: currentStock,
          newStock,
          quantityAdded: quantity,
          availability: newStock > 0 ? 1 : 0,
          success: true
        });
      } catch (error: any) {
        results.push({
          productId: id,
          error: error.message || 'Error desconocido',
          success: false
        });
      }
    }
    return results;
  }

  async subtractStockBulk(items: { id: string, quantity: number }[]) {
    const results = [];
    for (const { id, quantity } of items) {
      try {
        if (quantity <= 0) throw new HttpException(400, 'La cantidad debe ser mayor a 0');
        const product = await Product.findOne({ where: { id, deletedAt: null } });
        if (!product) throw new HttpException(404, 'Product not found');
        const currentStock = product.getDataValue('stock');
        const newStock = currentStock - quantity;
        if (newStock < 0) throw new HttpException(400, `No hay suficiente stock. Stock actual: ${currentStock}, cantidad solicitada: ${quantity}`);
        await product.update({ stock: newStock });
        results.push({
          productId: id,
          previousStock: currentStock,
          newStock,
          quantitySubtracted: quantity,
          availability: newStock > 0 ? 1 : 0,
          success: true
        });
      } catch (error: any) {
        results.push({
          productId: id,
          error: error.message || 'Error desconocido',
          success: false
        });
      }
    }
    return results;
  }

  async adjustStockBulk(items: { id: string, newStock: number }[]) {
    const results = [];
    for (const { id, newStock } of items) {
      try {
        if (newStock < 0) throw new HttpException(400, 'El stock no puede ser negativo');
        const product = await Product.findOne({ where: { id, deletedAt: null } });
        if (!product) throw new HttpException(404, 'Product not found');
        const currentStock = product.getDataValue('stock');
        if (currentStock === newStock) throw new HttpException(400, `El stock ya es ${newStock}`);
        await product.update({ stock: newStock });
        results.push({
          productId: id,
          previousStock: currentStock,
          newStock,
          difference: newStock - currentStock,
          availability: newStock > 0 ? 1 : 0,
          success: true
        });
      } catch (error: any) {
        results.push({
          productId: id,
          error: error.message || 'Error desconocido',
          success: false
        });
      }
    }
    return results;
  }

  async getAvailableProducts() {
    return await Product.findAll({
      where: { 
        deletedAt: null,
        availability: 1
      },
      order: [['createdAt', 'DESC']]
    });
  }

  async getUnavailableProducts() {
    return await Product.findAll({
      where: { 
        deletedAt: null,
        availability: 0
      },
      order: [['createdAt', 'DESC']]
    });
  }

  async getLowStockProducts(threshold: number = 5) {
    return await Product.findAll({
      where: { 
        deletedAt: null,
        stock: {
          [Op.lte]: threshold,
          [Op.gt]: 0
        }
      },
      order: [['stock', 'ASC']]
    });
  }
}