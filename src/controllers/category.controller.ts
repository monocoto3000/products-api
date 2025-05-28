import { Request, Response, NextFunction } from 'express';
import { CategoryService } from '../services/category.service';

const categoryService = new CategoryService();

export class CategoryController {
  getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await categoryService.getAll();
      res.json(result);
    } catch (err) {
      next(err);
    }
  };

  getById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = String(req.params.id);
      const result = await categoryService.getById(id);
      res.json(result);
    } catch (err) {
      next(err);
    }
  };

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await categoryService.create(req.body);
      res.status(201).json(result);
    } catch (err) {
      next(err);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = String(req.params.id);
      const result = await categoryService.update(id, req.body);
      res.json(result);
    } catch (err) {
      next(err);
    }
  };

  delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = String(req.params.id);
      await categoryService.delete(id);
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  };
}
