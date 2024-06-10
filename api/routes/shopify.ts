import { Router } from 'express';
import { getSearch } from '../controllers/shopify';

const routesShopify = Router();

routesShopify.get('/', getSearch);

export { routesShopify };
