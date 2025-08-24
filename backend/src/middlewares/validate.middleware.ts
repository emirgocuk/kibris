import type { Request, Response, NextFunction } from "express";
import type { AnySchema } from "yup";

export default (schema: AnySchema) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            await schema.validate(req.body);
            next();
        } catch (err: any) {
            res.status(400).json({ error: err.errors[0] });
        }
    };
};
