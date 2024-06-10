import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { fetchProducts } from '../services/products';
import { injectDocument } from '../services/embedding';

const embedSchema = z.object({
    collection: z.string().min(3),
    domain: z.string().min(3).transform((val) => {
        const match = val.match(/https:\/\/([^.]+)\.myshopify\.com/);
        return match ? match[1] : val;
    }).or(z.string().min(3)),
    token: z.string().min(10)
});

export const makeEmbed = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { collection, domain, token } = embedSchema.parse(req.body);
        const products = await fetchProducts(domain, token)
        const store = await injectDocument(products, collection)

        res.send({ collection, domain, store });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).send({ error: error.errors });
        }
        next(error);
    }
};
