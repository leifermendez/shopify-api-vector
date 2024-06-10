import { Request, Response, NextFunction } from 'express';

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack);
    res.status(500).send({
        message: 'Error con peticion',
        trace: err?.message ?? err?.stack ?? JSON.stringify(err)
    });
};
