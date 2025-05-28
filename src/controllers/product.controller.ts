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

  addStock = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = String(req.params.id);
      const quantity = Number(req.params.quantity);
      
      if (isNaN(quantity)) {
        return res.status(400).json({ error: 'Cantidad debe ser un número válido' });
      }

      const result = await productService.addStock(id, quantity);
      res.json(result);
    } catch (err) {
      next(err);
    }
  };

  subtractStock = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = String(req.params.id);
      const quantity = Number(req.params.quantity);
      
      if (isNaN(quantity)) {
        return res.status(400).json({ error: 'Cantidad debe ser un número válido' });
      }

      const result = await productService.subtractStock(id, quantity);
      res.json(result);
    } catch (err) {
      next(err);
    }
  };

  adjustStock = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = String(req.params.id);
      const newStock = Number(req.params.stock);
      
      if (isNaN(newStock)) {
        return res.status(400).json({ error: 'Stock debe ser un número válido' });
      }

      const result = await productService.adjustStock(id, newStock);
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