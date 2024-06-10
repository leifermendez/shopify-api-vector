import { Router } from 'express';
import { makeEmbed } from '../controllers/embedding';

const routesEmbedding = Router();

routesEmbedding.post('/', makeEmbed);

export { routesEmbedding };
