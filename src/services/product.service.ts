import { ProductModel } from '../models/product';
import { ProductRepository } from '../repository/product.repository';
import { HttpException } from '../utils/exceptions';

export class ProductService {
  private repo = new ProductRepository();

  async getAll() {
    return await this.repo.findAll();
  }

  async getById(id: string) {
    const product = await this.repo.findById(id);
    if (!product) throw new HttpException(404, 'Product not found');
    return product;
  }

  async create(data: ProductModel) {
    return await this.repo.create(data);
  }

  async update(id: string, data: Partial<ProductModel>) {
    const updatedProduct = await this.repo.update(id, data);
    if (!updatedProduct) throw new HttpException(404, 'Product not found');
    return updatedProduct;
  }

  async delete(id: string) {
    const deleted = await this.repo.delete(id);
    if (!deleted) throw new HttpException(404, 'Product not found');
  }

  async addStockBulk(items: { id: string; quantity: number }[]) {
    const results = [];
    for (const { id, quantity } of items) {
      try {
        if (quantity <= 0) throw new HttpException(400, 'La cantidad debe ser mayor a 0');
        const product = await this.repo.findById(id);
        if (!product) throw new HttpException(404, 'Product not found');
        const newStock = product.stock + quantity;
        await this.repo.updateStock(id, newStock);
        results.push({
          productId: id,
          previousStock: product.stock,
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

  async subtractStockBulk(items: { id: string; quantity: number }[]) {
    const results = [];
    for (const { id, quantity } of items) {
      try {
        if (quantity <= 0) throw new HttpException(400, 'La cantidad debe ser mayor a 0');
        const product = await this.repo.findById(id);
        if (!product) throw new HttpException(404, 'Product not found');
        const newStock = product.stock - quantity;
        if (newStock < 0) throw new HttpException(400, `No hay suficiente stock. Stock actual: ${product.stock}, cantidad solicitada: ${quantity}`);
        await this.repo.updateStock(id, newStock);
        results.push({
          productId: id,
          previousStock: product.stock,
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

  async adjustStockBulk(items: { id: string; newStock: number }[]) {
    const results = [];
    for (const { id, newStock } of items) {
      try {
        if (newStock < 0) throw new HttpException(400, 'El stock no puede ser negativo');
        const product = await this.repo.findById(id);
        if (!product) throw new HttpException(404, 'Product not found');
        if (product.stock === newStock) throw new HttpException(400, `El stock ya es ${newStock}`);
        await this.repo.updateStock(id, newStock);
        results.push({
          productId: id,
          previousStock: product.stock,
          newStock,
          difference: newStock - product.stock,
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
    return await this.repo.findAvailable();
  }

  async getUnavailableProducts() {
    return await this.repo.findUnavailable();
  }

  async getLowStockProducts(threshold: number = 5) {
    return await this.repo.findLowStock(threshold);
  }
}
