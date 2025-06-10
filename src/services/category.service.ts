import { CategoryModel } from '../models/category';
import { CategoryRepository } from '../repository/category.reopsitory';
import { HttpException } from '../utils/exceptions';

export class CategoryService {
  private repository = new CategoryRepository();

  async getAll(): Promise<CategoryModel[]> {
    return await this.repository.findAll();
  }

  async getById(id: string): Promise<CategoryModel> {
    const category = await this.repository.findById(id);
    if (!category) throw new HttpException(404, 'Category not found');
    return category;
  }

  async create(data: { name: string }): Promise<CategoryModel> {
    return await this.repository.create(data);
  }

  async update(id: string, data: Partial<{ name: string }>): Promise<CategoryModel> {
    const updated = await this.repository.update(id, data);
    if (!updated) throw new HttpException(404, 'Category not found');
    return updated;
  }

  async delete(id: string): Promise<void> {
    const deleted = await this.repository.delete(id);
    if (!deleted) throw new HttpException(404, 'Category not found');
  }
}
