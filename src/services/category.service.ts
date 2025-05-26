import { Category } from '../models/category.model';
import { HttpException } from '../utils/exceptions';

export class CategoryService {
  async getAll() {
    return await Category.findAll({ where: { deletedAt: null } });
  }

  async getById(id: number) {
    const category = await Category.findOne({ where: { id, deletedAt: null } });
    if (!category) throw new HttpException(404, 'Category not found');
    return category;
  }

  async create(data: { name: string }) {
    const newCategory = await Category.create(data);
    return newCategory;
  }

  async update(id: number, data: Partial<{ name: string }>) {
    const category = await Category.findOne({ where: { id, deletedAt: null } });
    if (!category) throw new HttpException(404, 'Category not found');

    await category.update({ ...data });
    return category;
  }

  async delete(id: number) {
    const category = await Category.findOne({ where: { id, deletedAt: null } });
    if (!category) throw new HttpException(404, 'Category not found');

    await category.destroy(); 
  }
}
