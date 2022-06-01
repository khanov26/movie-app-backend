import {Request, Response} from "express";
import * as userService from "../services/userService";
import bcrypt from 'bcryptjs';
import {Role} from "../types/role";
import {User} from "../types/user";
import {generateAccessToken} from "../utils/auth";

export const signup = async (req: Request, res: Response) => {
    try {
        const {email, password, name} = req.body;
        const candidate = await userService.getByEmail(email);
        if (candidate) {
            return res.status(400).send('Пользователь с таким email уже существует');
        }
        const passwordHash = bcrypt.hashSync(password);
        const user: User = {
            email,
            name,
            role: Role.user,
            passwordHash,
        };
        const {passwordHash: hash, ...createdUser} = await userService.create(user);
        return res.json({user: createdUser});

    } catch (e) {
        console.error(e);
        res.status(500).send('Server error');
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        const {email, password} = req.body;
        const user = await userService.getByEmail(email);
        if (!user) {
            return res.status(400).json({
                field: 'email',
                errorText: `Пользователь ${email} не найден`,
            });
        }
        const isPasswordValid = bcrypt.compareSync(password, user.passwordHash);
        if (!isPasswordValid) {
            return res.status(400).json({
                field: 'password',
                errorText: 'Введен неверный пароль',
            });
        }
        const accessToken = generateAccessToken(user.id!, user.role);
        return res.json({
            id: user.id,
            email: user.email,
            accessToken
        });
    } catch (e) {
        console.error(e);
        res.status(500).send('Server error');
    }
};
