import mongoose from "mongoose";
export interface ScType {
  senderAccount: string;
  receiverAccount: string;
  amount: string;
  transferDescription: string;
  createdAt: string;
}
const transactionSchema = new mongoose.Schema<ScType>({
  senderAccount: {
    type: String,
    required: [true, "Sender account number is needed"],
  },
  receiverAccount: {
    type: String,
    required: [true, "Reciever account number needed"],
  },
  amount: {
    type: String,
    required: [true, "Amount is needed"],
  },
  transferDescription: {
    type: String,
    required: [true, "Transfer description is needed"],
  },
  createdAt: {
    type: String,
    createdAt: { type: Date, default: Date.now },
  },
});
const Transaction = mongoose.model("Transaction", transactionSchema);
export default Transaction;