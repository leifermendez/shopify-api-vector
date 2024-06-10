import { Router } from 'express';
import { getSearch, ragSearch } from '../controllers/shopify';

const routesShopify = Router();

routesShopify.get('/search', getSearch);
routesShopify.post('/rag', ragSearch);

export { routesShopify };
