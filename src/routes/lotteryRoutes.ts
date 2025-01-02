import { Router } from "express";
import { getResultados } from "../controllers/lotteryController";

const router = Router();

router.get("/resultados", getResultados);

export default router;
