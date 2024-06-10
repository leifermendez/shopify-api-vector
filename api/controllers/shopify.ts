import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { getInstance } from '../qdrant';


const searchSchema = z.object({
    src: z.string().min(3),
    collection: z.string().min(3),
});


export const getSearch = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { src, collection } = searchSchema.parse(req.query);
        const vectorStore = await getInstance(collection)
        const response = await vectorStore.similaritySearch(src, 15);
        res.send(response);
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).send({ error: error.errors });
        }
        next(error);
    }
};
