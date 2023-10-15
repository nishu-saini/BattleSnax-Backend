import express, { Request, Response, NextFunction } from "express";
import {
  createVandor,
  getDeliveryUserById,
  getDeliveryUsers,
  getTransactionById,
  getTransactions,
  getVandorByID,
  getVandors,
  verifyDeliveryUser,
} from "../controllers/adminController";

const router = express.Router();

router.get("/", (req: Request, res: Response, next: NextFunction) => {
  res.json({
    message: "Admin Route",
  });
});

/** ---------------- Vandor ----------------------------- **/
router.post("/vandor", createVandor);
router.get("/vandors", getVandors);
router.get("/vandor/:id", getVandorByID);

/** ----------------------- Transaction --------------------- **/
router.get("/transactions", getTransactions);
router.get("/transaction/:id", getTransactionById);

/** --------------------- Delivery -------------------------- **/
router.put("/delivery/verify", verifyDeliveryUser);
router.get("/delivery/users", getDeliveryUsers);
router.get("/delivery/user/:id", getDeliveryUserById);

export default router;
