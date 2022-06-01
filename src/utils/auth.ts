import {Role} from "../types/role";
import {sign, verify} from "jsonwebtoken";

export interface TokenPayload {
    userId: string;
    role: Role;
}

const jwtSecret = process.env.JWT_SECRET || '';

export const generateAccessToken = (userId: string, role: Role) => {
    const payload: TokenPayload = {
        userId,
        role,
    };
    return sign(payload, jwtSecret, {expiresIn: process.env.JWT_EXPIRES_IN});
};

export const validateAccessToken = (token: string): TokenPayload => {
    return verify(token, jwtSecret) as TokenPayload;
};
