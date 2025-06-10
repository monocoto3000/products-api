import { v4 as uuidv4 } from 'uuid';
import { CategoryModel } from '../models/category';
import { Category } from '../config/sequelize/models/category.model';

export class CategoryRepository {
  private toModel(categoryInstance: any): CategoryModel {
    return {
      id: categoryInstance.id,
      name: categoryInstance.name,
    };
  }

  async findAll(): Promise<CategoryModel[]> {
    const categories = await Category.findAll({ where: { deletedAt: null } });
    return categories.map(this.toModel);
  }

  async findById(id: string): Promise<CategoryModel | null> {
    const category = await Category.findOne({ where: { id, deletedAt: null } });
    if (!category) return null;
    return this.toModel(category);
  }

  async create(data: { name: string }): Promise<CategoryModel> {
    const newCategory = await Category.create({
      id: uuidv4(),
      name: data.name,
    });
    return this.toModel(newCategory);
  }

  async update(id: string, data: Partial<{ name: string }>): Promise<CategoryModel | null> {
    const category = await Category.findOne({ where: { id, deletedAt: null } });
    if (!category) return null;
    await category.update(data);
    return this.toModel(category);
  }

  async delete(id: string): Promise<boolean> {
    const category = await Category.findOne({ where: { id, deletedAt: null } });
    if (!category) return false;
    await category.destroy();
    return true;
  }
}
