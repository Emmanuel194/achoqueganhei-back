import { Router, Request, Response, NextFunction } from "express";
import {
  register,
  login,
  resetPassword,
  updatePassword,
} from "../controllers/authController";

const router = Router();

const asyncHandler = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<Response>
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch(next);
  };
};

router.post("/register", asyncHandler(register));
router.post("/login", asyncHandler(login));
router.post("/reset-password", asyncHandler(resetPassword));
router.post("/update-password", asyncHandler(updatePassword));

export default router;
