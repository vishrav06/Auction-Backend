import { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/ApiError";

const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    
    // If it's our ApiError, use its properties
    if (err instanceof ApiError) {
        return res.status(err.statusCode).json({
            success: false,
            statusCode: err.statusCode,
            message: err.message,
            errors: err.errors
        });
    }

    // Unknown/unhandled errors
    return res.status(500).json({
        success: false,
        statusCode: 500,
        message: err.message || "Something went wrong",
        errors: []
    });
};

export { errorHandler };
