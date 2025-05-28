import { Request, Response, NextFunction } from 'express';
import { ProductService } from '../services/product.service';

const productService = new ProductService();

export class ProductController {
  
  getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await productService.getAll();
      res.json(result);
    } catch (err) {
      next(err);
    }
  };

  getById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = String(req.params.id);
      const result = await productService.getById(id);
      res.json(result);
    } catch (err) {
      next(err);
    }
  };

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await productService.create(req.body);
      res.status(201).json(result);
    } catch (err) {
      next(err);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = String(req.params.id);
      const result = await productService.update(id, req.body);
      res.json(result);
    } catch (err) {
      next(err);
    }
  };

  delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = String(req.params.id);
      await productService.delete(id);
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  };

  addStockBulk = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const items = req.body; 
      if (!Array.isArray(items)) {
        return res.status(400).json({ error: 'El body debe ser un array de objetos { id, quantity }' });
      }
      const result = await productService.addStockBulk(items);
      res.json(result);
    } catch (err) {
      next(err);
    }
  };

  subtractStockBulk = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const items = req.body;
      if (!Array.isArray(items)) {
        return res.status(400).json({ error: 'El body debe ser un array de objetos { id, quantity }' });
      }
      const result = await productService.subtractStockBulk(items);
      res.json(result);
    } catch (err) {
      next(err);
    }
  };

  adjustStockBulk = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const items = req.body;
      if (!Array.isArray(items)) {
        return res.status(400).json({ error: 'El body debe ser un array de objetos { id, newStock }' });
      }
      const result = await productService.adjustStockBulk(items);
      res.json(result);
    } catch (err) {
      next(err);
    }
  };

  getAvailableProducts = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await productService.getAvailableProducts();
      res.json(result);
    } catch (err) {
      next(err);
    }
  };

  getUnavailableProducts = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await productService.getUnavailableProducts();
      res.json(result);
    } catch (err) {
      next(err);
    }
  };

  getLowStockProducts = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const threshold = Number(req.query.threshold) || 5;
      const result = await productService.getLowStockProducts(threshold);
      res.json(result);
    } catch (err) {
      next(err);
    }
  };
}