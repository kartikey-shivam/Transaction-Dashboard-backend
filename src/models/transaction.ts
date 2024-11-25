import mongoose, { Schema, Document } from "mongoose";

// Enums for transaction fields
enum TransactionState {
  CREATED = "CREATED",
  PROCESSING = "PROCESSING",
  SENT = "SENT",
  EXPIRED = "EXPIRED",
  DECLINED = "DECLINED",
  SUSPENDED = "SUSPENDED",
  REFUNDED = "REFUNDED",
  SUCCESSFUL = "SUCCESSFUL",
  REVERSED = "REVERSED",
}

enum TransactionType {
  DEPOSIT = "DEPOSIT",
  TRANSFER = "TRANSFER",
  EXTERNAL_PAYMENT = "EXTERNAL_PAYMENT",
  WITHDRAWAL = "WITHDRAWAL",
  REFUND = "REFUND",
  OTHER = "OTHER",
}

export enum Currency {
  USD = "USD",
  EUR = "EUR",
  GBP = "GBP",
  INR = "INR",
  CAD = "CAD",
  AUD = "AUD",
  JPY = "JPY",
  CHF = "CHF",
  SEK = "SEK",
  NOK = "NOK",
  ZAR = "ZAR",
  SGD = "SGD",
  CNY = "CNY",
  MXN = "MXN",
  BRL = "BRL",
  RUB = "RUB",
  AED = "AED",
  HKD = "HKD",
  NZD = "NZD",
  KRW = "KRW",
}

export enum Country {
  USA = "USA",
  CANADA = "CANADA",
  UK = "UK",
  INDIA = "INDIA",
  AUSTRALIA = "AUSTRALIA",
  JAPAN = "JAPAN",
  SWITZERLAND = "SWITZERLAND",
  SWEDEN = "SWEDEN",
  NORWAY = "NORWAY",
  SOUTH_AFRICA = "SOUTH_AFRICA",
  SINGAPORE = "SINGAPORE",
  CHINA = "CHINA",
  MEXICO = "MEXICO",
  BRAZIL = "BRAZIL",
  RUSSIA = "RUSSIA",
  UAE = "UAE",
  HONG_KONG = "HONG_KONG",
  NEW_ZEALAND = "NEW_ZEALAND",
  SOUTH_KOREA = "SOUTH_KOREA",
  GERMANY = "GERMANY",
  FRANCE = "FRANCE",
}

interface Tag {
  [key: string]: string;
}

interface AmountDetails {
  transactionAmount: number;
  transactionCurrency: Currency;
  country?: Country;
}

interface Transaction extends Document {
  transactionId: string;
  timestamp: number;
  type: TransactionType;
  description: string;
  originUserId?: string;
  destinationUserId?: string;
  transactionState?: TransactionState;
  originAmountDetails?: AmountDetails;
  destinationAmountDetails?: AmountDetails;
  originDeviceData?: string;
  destinationDeviceData?: string;
  tags?: Tag;
}

const TransactionSchema: Schema = new Schema(
  {
    transactionId: { type: String, required: true },
    timestamp: { type: Number, required: true },
    type: { type: String, enum: Object.values(TransactionType), required: true },
    description: { type: String, required: true },
    originUserId: { type: String },
    destinationUserId: { type: String },
    transactionState: { type: String, enum: Object.values(TransactionState) },
    originAmountDetails: {
      transactionAmount: { type: Number, required: true },
      transactionCurrency: { type: String, enum: Object.values(Currency), required: true },
      country: { type: String, enum: Object.values(Country) },
    },
    destinationAmountDetails: {
      transactionAmount: { type: Number, required: true },
      transactionCurrency: { type: String, enum: Object.values(Currency), required: true },
      country: { type: String, enum: Object.values(Country) },
    },
    originDeviceData: { type: String },
    destinationDeviceData: { type: String },
    tags: { type: Map, of: String }, // Tags as an object (key-value pairs)
  },
  { timestamps: true }
);

const TransactionModel = mongoose.model<Transaction>("Transaction", TransactionSchema);

export default TransactionModel;
