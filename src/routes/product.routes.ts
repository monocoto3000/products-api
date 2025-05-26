import { Router } from 'express';
import { ProductController } from '../controllers/product.controller';

const router = Router();
const controller = new ProductController();

/**
 * @swagger
 * /products:
 *   get:
 *     summary: Obtener todos los productos
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: Lista de productos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   name:
 *                     type: string
 *                   description:
 *                     type: string
 *                   price:
 *                     type: number
 *                   image:
 *                     type: string
 *                   stock:
 *                     type: integer
 *                   availability:
 *                     type: integer
 *                     enum: [0, 1]
 */
router.get('/', controller.getAll);

/**
 * @swagger
 * /products/filter/available:
 *   get:
 *     summary: Obtener productos disponibles (con stock)
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: Lista de productos disponibles
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 */
router.get('/filter/available', controller.getAvailableProducts);

/**
 * @swagger
 * /products/filter/unavailable:
 *   get:
 *     summary: Obtener productos no disponibles (sin stock)
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: Lista de productos sin stock
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 */
router.get('/filter/unavailable', controller.getUnavailableProducts);

/**
 * @swagger
 * /products/filter/low-stock:
 *   get:
 *     summary: Obtener productos con stock bajo
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: threshold
 *         schema:
 *           type: integer
 *           default: 5
 *         description: Umbral de stock bajo
 *     responses:
 *       200:
 *         description: Lista de productos con stock bajo
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 */
router.get('/filter/low-stock', controller.getLowStockProducts);

/**
 * @swagger
 * /products/{id}:
 *   get:
 *     summary: Obtener producto por ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del producto
 *     responses:
 *       200:
 *         description: Producto encontrado
 *       404:
 *         description: Producto no encontrado
 */
router.get('/:id', controller.getById);

/**
 * @swagger
 * /products:
 *   post:
 *     summary: Crear nuevo producto
 *     tags: [Products]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - price
 *             properties:
 *               name:
 *                 type: string
 *                 description: Nombre del producto
 *               description:
 *                 type: string
 *                 description: Descripción del producto
 *               price:
 *                 type: number
 *                 description: Precio del producto
 *               image:
 *                 type: string
 *                 description: URL de la imagen
 *               categoryId:
 *                 type: integer
 *                 description: ID de la categoría asociada
 *               stock:
 *                 type: integer
 *                 description: Stock inicial (por defecto 0)
 *                 default: 0
 *     responses:
 *       201:
 *         description: Producto creado exitosamente
 *       400:
 *         description: Datos inválidos
 */
router.post('/', controller.create);

/**
 * @swagger
 * /products/{id}:
 *   put:
 *     summary: Actualizar producto
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del producto
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               image:
 *                 type: string
 *               categoryId:
 *                 type: integer
 *               stock:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Producto actualizado exitosamente
 *       404:
 *         description: Producto no encontrado
 */
router.put('/:id', controller.update);

/**
 * @swagger
 * /products/{id}:
 *   delete:
 *     summary: Eliminar producto
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del producto
 *     responses:
 *       204:
 *         description: Producto eliminado exitosamente
 *       404:
 *         description: Producto no encontrado
 */
router.delete('/:id', controller.delete);

/**
 * @swagger
 * /products/stock/{id}/add/{quantity}:
 *   post:
 *     summary: Agregar stock a un producto
 *     tags: [Stock]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del producto
 *       - in: path
 *         name: quantity
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Cantidad a agregar
 *     responses:
 *       200:
 *         description: Stock agregado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 productId:
 *                   type: integer
 *                 previousStock:
 *                   type: integer
 *                 newStock:
 *                   type: integer
 *                 quantityAdded:
 *                   type: integer
 *                 availability:
 *                   type: integer
 *       400:
 *         description: Cantidad inválida
 *       404:
 *         description: Producto no encontrado
 */
router.post('/stock/:id/add/:quantity', controller.addStock as any);

/**
 * @swagger
 * /products/stock/{id}/subtract/{quantity}:
 *   post:
 *     summary: Reducir stock de un producto
 *     tags: [Stock]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del producto
 *       - in: path
 *         name: quantity
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Cantidad a reducir
 *     responses:
 *       200:
 *         description: Stock reducido exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 productId:
 *                   type: integer
 *                 previousStock:
 *                   type: integer
 *                 newStock:
 *                   type: integer
 *                 quantitySubtracted:
 *                   type: integer
 *                 availability:
 *                   type: integer
 *       400:
 *         description: Cantidad inválida o stock insuficiente
 *       404:
 *         description: Producto no encontrado
 */
router.post('/stock/:id/subtract/:quantity', controller.subtractStock as any);

/**
 * @swagger
 * /products/stock/{id}/adjust/{stock}:
 *   post:
 *     summary: Ajustar stock a una cantidad específica
 *     tags: [Stock]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del producto
 *       - in: path
 *         name: stock
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 0
 *         description: Nueva cantidad de stock
 *     responses:
 *       200:
 *         description: Stock ajustado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 productId:
 *                   type: integer
 *                 previousStock:
 *                   type: integer
 *                 newStock:
 *                   type: integer
 *                 difference:
 *                   type: integer
 *                 availability:
 *                   type: integer
 *       400:
 *         description: Stock inválido o ya tiene ese valor
 *       404:
 *         description: Producto no encontrado
 */
router.post('/stock/:id/adjust/:stock', controller.adjustStock as any);

export default router;