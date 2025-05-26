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

  async getById(id: number) {
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

  async update(id: number, data: any) {
    const product = await Product.findOne({ where: { id, deletedAt: null } });
    if (!product) throw new HttpException(404, 'Product not found');
    
    const updatedProduct = await product.update({ ...data });
    console.log(`Producto actualizado: ID ${id}`);
    return updatedProduct;
  }

  async delete(id: number) {
    const product = await Product.findOne({ where: { id, deletedAt: null } });
    if (!product) throw new HttpException(404, 'Product not found');

    await product.destroy();
    console.log(`Producto eliminado: ID ${id}`);
  }

  async addStock(id: number, quantity: number) {
    if (quantity <= 0) {
      throw new HttpException(400, 'La cantidad debe ser mayor a 0');
    }

    const product = await Product.findOne({ where: { id, deletedAt: null } });
    if (!product) throw new HttpException(404, 'Product not found');

    const currentStock = product.getDataValue('stock');
    const newStock = currentStock + quantity;

    await product.update({ stock: newStock });
    
    console.log(`Stock agregado: +${quantity} al producto ID ${id}. Stock anterior: ${currentStock}, Stock nuevo: ${newStock}`);

    return {
      productId: id,
      previousStock: currentStock,
      newStock,
      quantityAdded: quantity,
      availability: newStock > 0 ? 1 : 0
    };
  }

  async subtractStock(id: number, quantity: number) {
    if (quantity <= 0) {
      throw new HttpException(400, 'La cantidad debe ser mayor a 0');
    }

    const product = await Product.findOne({ where: { id, deletedAt: null } });
    if (!product) throw new HttpException(404, 'Product not found');

    const currentStock = product.getDataValue('stock');
    const newStock = currentStock - quantity;

    if (newStock < 0) {
      throw new HttpException(400, `No hay suficiente stock. Stock actual: ${currentStock}, cantidad solicitada: ${quantity}`);
    }

    await product.update({ stock: newStock });
    
    console.log(`Stock reducido: -${quantity} del producto ID ${id}. Stock anterior: ${currentStock}, Stock nuevo: ${newStock}`);

    return {
      productId: id,
      previousStock: currentStock,
      newStock,
      quantitySubtracted: quantity,
      availability: newStock > 0 ? 1 : 0
    };
  }

  async adjustStock(id: number, newStock: number) {
    if (newStock < 0) {
      throw new HttpException(400, 'El stock no puede ser negativo');
    }

    const product = await Product.findOne({ where: { id, deletedAt: null } });
    if (!product) throw new HttpException(404, 'Product not found');

    const currentStock = product.getDataValue('stock');
    
    if (currentStock === newStock) {
      throw new HttpException(400, `El stock ya es ${newStock}`);
    }

    await product.update({ stock: newStock });
    
    console.log(`Stock ajustado: Producto ID ${id}. Stock anterior: ${currentStock}, Stock nuevo: ${newStock}`);

    return {
      productId: id,
      previousStock: currentStock,
      newStock,
      difference: newStock - currentStock,
      availability: newStock > 0 ? 1 : 0
    };
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