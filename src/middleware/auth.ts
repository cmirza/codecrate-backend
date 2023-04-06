import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const jwtSecret = process.env.JWT_SECRET || '';

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).send('Access denied.');
    }

    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || '');
        (req as any).user = { ...(decoded as any), role: (decoded as any).role };
        next();
    } catch (error) {
        return res.status(401).send('Access denied.');
    }
};

export const requireAdmin = (req: Request, res: Response, next: NextFunction) => {
    if ((req as any).user.role !== 'admin') {
        return res.status(403).send('Access denied. Admin privileges required.');
    }
    next();
};
