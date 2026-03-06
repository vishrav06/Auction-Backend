import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import { userRepository } from "../repositories/user.repository";
import { authRepository } from "../repositories/auth.repository";
import { User } from "../models/user.model";
import { uploadOnCloudinary } from "../utils/cloudinary";
import "multer";


const generateAccessAndRefreshTokens = async (user: User) => {
    try {
        const accessToken = jwt.sign(
            {
                id: user.id,
                email: user.email,
                username: user.username,
                role: user.role,
            },
            process.env.ACCESS_TOKEN_SECRET!,
            {
                expiresIn: process.env.ACCESS_TOKEN_EXPIRY as jwt.SignOptions["expiresIn"],
            }
        );

        const rawRefreshToken = crypto.randomBytes(64).toString("hex");
        const tokenHash = crypto.createHash("sha256").update(rawRefreshToken).digest("hex");
        const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

        await authRepository.createRefreshToken({
            user_id: user.id,
            token_hash: tokenHash,
            expires_at: expiresAt,
        });

        return { accessToken, rawRefreshToken, expiresAt };

    } catch (error) {
        throw new ApiError(500, "Couldn't generate tokens");
    }
};




const registerUser = async(req: Request, res: Response) =>{
    const { username, email, password } = req.body;

    if(!username || !email || !password){
        throw new ApiError(400, "Missing required fields");
    }

    const normalizedEmail = email.toLowerCase().trim();

    const [existingEmail, existingUsername] = await Promise.all([
    userRepository.findByEmail(normalizedEmail),
    userRepository.findByUsername(username),
    ]);

    if(existingEmail) throw new ApiError(409, "Email already in use");
    if(existingUsername) throw new ApiError(409, "Username already taken");


    const avatarLocalPath = req.file?.path;
    let avatar_url: string | null = null;

    if (avatarLocalPath) {
        const uploaded = await uploadOnCloudinary(avatarLocalPath);
        if (!uploaded) throw new ApiError(500, "Avatar upload failed");
        avatar_url = uploaded.url;
    }


    const password_hash = await bcrypt.hash(password, 10);

    const user = await userRepository.createUser({
        username,
        email: normalizedEmail,
        password_hash,
        avatar_url
    });

    const { accessToken, rawRefreshToken, expiresAt } = await generateAccessAndRefreshTokens(user);


    const {password_hash: _, ...safeUser} = user;

    const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict" as const,
        expires: expiresAt,
    };

    return res
    .status(201)
    .cookie("refreshToken", rawRefreshToken, options)
    .json( new ApiResponse(201, {user: safeUser, accessToken}, "User registered successfully"))

};

export {
    registerUser
};