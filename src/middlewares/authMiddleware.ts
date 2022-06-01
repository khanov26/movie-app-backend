import {Role} from "../types/role";
import {NextFunction, Request, Response} from "express";
import {validateAccessToken} from "../utils/auth";
import {JsonWebTokenError} from "jsonwebtoken";

export const checkAuth = (roles: Role[]) => (req: Request, res: Response, next: NextFunction) => {
    if (req.method === "OPTIONS") {
        next();
    }

    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).send('Пользователь не авторизован');
        }
        const decodedData = validateAccessToken(token);

        if (!roles.includes(decodedData.role)) {
            return res.status(403).send('Нет доступа');
        }

        req.user = decodedData;
        next();
    } catch (e) {
        console.error(e);

        if (e instanceof JsonWebTokenError) {
            return res.status(401).send('Пользователь не авторизован');
        }

        res.status(500).send('Server error');
    }
};