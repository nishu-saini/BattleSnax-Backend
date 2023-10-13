import { Transaction } from "../models/transaction.model";

// Validate Transaction
export const validateTransaction = async (transactionId: string) => {
  const transaction = await Transaction.findById(transactionId);

  if (transaction) {
    if (transaction.status.toLowerCase() !== "failed") {
      return { status: true, transaction };
    }
  }

  return { status: false, transaction };
};
