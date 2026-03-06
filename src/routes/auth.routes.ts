import { Router } from "express";
import { registerUser } from "../controllers/auth.controller";
import { upload } from "../middlewares/multer.middleware";

const router = Router();

router.post("/register", upload.single("avatar"), registerUser);

export default router;