import express, { Request, Response, NextFunction } from "express";
import {
  createVandor,
  getTransactionById,
  getTransactions,
  getVandorByID,
  getVandors,
} from "../controllers/adminController";

const router = express.Router();

router.post("/vandor", createVandor);

router.get("/vandors", getVandors);

router.get("/vandor/:id", getVandorByID);

router.get("/transactions", getTransactions);

router.get("/transaction/:id", getTransactionById);

router.get("/", (req: Request, res: Response, next: NextFunction) => {
  res.json({
    message: "Admin Route",
  });
});

export default router;
