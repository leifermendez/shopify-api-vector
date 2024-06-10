import { Router } from 'express';
import { routesEmbedding } from './embedding';
import { routesShopify } from './shopify';

const router = Router();

router.use('/embedding', routesEmbedding);
router.use('/shopify', routesShopify);

export default router;
