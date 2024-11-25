import cron from "node-cron";
import TransactionModel, { Country, Currency } from "../models/transaction";
import mongoose from "mongoose";

// Utility function to generate a random timestamp from the past 2 years
function getRandomTimestampFromPastTwoYears(): number {
  const now = Date.now();
  const twoYearsAgo = now - 2 * 365 * 24 * 60 * 60 * 1000; // Milliseconds for 2 years
  return Math.floor(Math.random() * (now - twoYearsAgo) + twoYearsAgo);
}

// Utility function to generate random text for the description
function getRandomDescription(): string {
  const descriptions = [
    "Payment for online shopping",
    "Transfer to savings account",
    "Refund for returned item",
    "Subscription renewal fee",
    "Salary payment",
    "Utility bill payment",
    "International transfer",
    "Mobile recharge",
    "Cashback reward",
    "Loan repayment",
    "Donation to charity",
    "Purchase at retail store",
    "Travel expense",
    "Insurance premium",
    "Investment fund transfer",
    "Tax payment",
    "Rental payment",
    "Medical bill",
    "Educational fee",
    "Gift card purchase",
  ];
  return descriptions[Math.floor(Math.random() * descriptions.length)];
}
function getRandomTag(): Record<string, string> {
  const tags = [
    { key: "priority", value: "high" },
    { key: "system", value: "automated" },
    { key: "category", value: "test" },
    { key: "status", value: "completed" },
    { key: "type", value: "financial" },
    { key: "risk", value: "low" },
    { key: "channel", value: "online" },
    { key: "action", value: "refund" },
    { key: "method", value: "card" },
    { key: "region", value: "Asia-Pacific" },
  ];
  const randomTag = tags[Math.floor(Math.random() * tags.length)];
  return { [randomTag.key]: randomTag.value };
}

// Cron job to create dummy transactions
export async function generateRandomTransaction() {
  try {
    const dummyTransaction = new TransactionModel({
      transactionId: `TXN-${Date.now()}`,
      timestamp: getRandomTimestampFromPastTwoYears(),
      type: ["DEPOSIT", "TRANSFER", "EXTERNAL_PAYMENT", "WITHDRAWAL", "REFUND", "OTHER"][
        Math.floor(Math.random() * 6)
      ],
      description: getRandomDescription(),
      originUserId: `user_${Math.floor(Math.random() * 1000)}`,
      destinationUserId:
         `user_${Math.floor(Math.random() * 1000)}` ,
      transactionState: [
        "CREATED",
        "PROCESSING",
        "SENT",
        "EXPIRED",
        "DECLINED",
        "SUSPENDED",
        "REFUNDED",
        "SUCCESSFUL",
        "REVERSED",
      ][Math.floor(Math.random() * 9)],
      originAmountDetails: {
        transactionAmount: +(Math.random() * 1000).toFixed(2),
        transactionCurrency: Object.values(Currency)[Math.floor(Math.random() * 20)],
        country: Object.values(Country)[Math.floor(Math.random() * 20)],
      },
      destinationAmountDetails: {
        transactionAmount: +(Math.random() * 1000).toFixed(2),
        transactionCurrency: Object.values(Currency)[Math.floor(Math.random() * 20)],
        country: Object.values(Country)[Math.floor(Math.random() * 20)],
      },
      originDeviceData: `device_${Math.floor(Math.random() * 1000)}`,
      destinationDeviceData: `device_${Math.floor(Math.random() * 1000)}`,
      tags: getRandomTag(),
    });

    await dummyTransaction.save();
    console.log("Dummy transaction created:", dummyTransaction);
  } catch (error) {
    console.error("Error creating dummy transaction:", error);
  }
}
