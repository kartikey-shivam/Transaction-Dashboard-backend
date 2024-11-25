import { Request, Response } from 'express';
import Transaction from '../models/transaction';
import Logger from '../utils/logger';
import * as XLSX from 'xlsx';
// import { parse } from 'json2csv';
// Create a new transaction
export const createTransaction = async (req: Request, res: Response) => {
  try {
    const {
      type,
      transactionState = "CREATED", 
      description,
      originUserId,
      destinationUserId,
      originAmountDetails,
      destinationAmountDetails,
      originDeviceData,
      destinationDeviceData,
      tags,
    } = req.body;

    // Validate required fields
    if (!type) {
      return res.status(400).json({ error: "Transaction type is required" });
    }

    if (!originAmountDetails || !originAmountDetails.transactionAmount || !originAmountDetails.transactionCurrency) {
      return res.status(400).json({
        error: "Origin amount details (amount and currency) are required",
      });
    }

    if (!description) {
      return res.status(400).json({ error: "Description is required" });
    }

    // Construct the transaction object
    const transaction = new Transaction({
      transactionId: `TXN-${Date.now()}`, // Unique transaction ID
      type,
      transactionState,
      description,
      originUserId: originUserId || null, // Optional field
      destinationUserId: destinationUserId || null, // Optional field
      originAmountDetails: {
        transactionAmount: originAmountDetails.transactionAmount,
        transactionCurrency: originAmountDetails.transactionCurrency,
        country: originAmountDetails.country || null, // Optional field
      },
      destinationAmountDetails: destinationAmountDetails
        ? {
            transactionAmount: destinationAmountDetails.transactionAmount || null,
            transactionCurrency: destinationAmountDetails.transactionCurrency || null,
            country: destinationAmountDetails.country || null,
          }
        : null, // Optional
      originDeviceData: originDeviceData || `device_${Math.floor(Math.random() * 1000)}`, // Fallback for device data
      destinationDeviceData: destinationDeviceData || null, // Optional field
      tags: tags || {}, // Default to empty object if not provided
      timestamp: Date.now(), // Auto-set the timestamp
    });

    // Save transaction to the database
    await transaction.save();

    // Send success response
    res.status(201).json({
      status: true,
      message: "Transaction created successfully",
      transaction,
    });
  } catch (error) {
    console.error("Error creating transaction:", error);
    res.status(500).json({ error: "An error occurred while creating the transaction" });
  }
};


// get transactions of particular user
export const getTransactionsByUser = async (req: Request, res: Response) => {
  try {
   
    

    const transactions = await Transaction.find();

    if (!transactions.length) {
      return res.status(404).json({ message: 'No transactions found for this user.' });
    }

    res.status(200).json(transactions);
  } catch (error) {
    console.error('Error fetching transactions:', error);
    res.status(500).json({ message: 'An error occurred while fetching transactions.' });
  }
};


// Retrieve a transaction by ID
export const getTransactionById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const transaction = await Transaction.findOne({ transactionId: id });
    if (!transaction) return res.status(404).json({ error: 'Transaction not found' });
    res.json(transaction);
  } catch (error) {
    res.status(500).json({ error: 'Error retrieving transaction' });
  }
};


export const filterTransactions = async (req: Request, res: Response) => {
  try {
    console.log("Filtering Transactions...");

    // Destructuring query parameters
    const {
      transactionId,
      type,
      transactionState,
      description,
      originUserId,
      destinationUserId,
      originMinAmount,
      originMaxAmount,
      destMinAmount,
      destMaxAmount,
      originCurrency,
      destinationCurrency,
      originCountry,
      destinationCountry,
      startDate,
      endDate,
      tags,
      originDeviceData,
      destinationDeviceData,
      page=1,
      limit=10,
    } = req.query;

    // Build the filter object
    const filter: any = {};

    // Filter by transactionId (partial match, case-insensitive)
    if (transactionId) {
      filter.transactionId = { $regex: transactionId, $options: "i" };
    }

    // Filter by type (enum)
    if (type) {
      filter.type = { $in: Array.isArray(type) ? type : [type] };
    }

    // Filter by transactionState (enum)
    if (transactionState) {
      filter.transactionState = { $in: Array.isArray(transactionState) ? transactionState : [transactionState] };
    }

    // Filter by description (partial match, case-insensitive)
    if (description) {
      filter.description = { $regex: description, $options: "i" };
    }

    // Filter by user IDs
    if (originUserId) {
      filter.originUserId = originUserId;
    }
    if (destinationUserId) {
      filter.destinationUserId = destinationUserId;
    }

    // Filter by amount (origin and destination)
    if (originMinAmount || originMaxAmount) {
      filter["originAmountDetails.transactionAmount"] = {};
      if (originMinAmount) {
        filter["originAmountDetails.transactionAmount"].$gte = Number(originMinAmount);
      }
      if (originMaxAmount) {
        filter["originAmountDetails.transactionAmount"].$lte = Number(originMaxAmount);
      }
    }
    if (destMinAmount || destMaxAmount) {
      filter["destinationAmountDetails.transactionAmount"] = {};
      if (destMinAmount) {
        filter["destinationAmountDetails.transactionAmount"].$gte = Number(destMinAmount);
      }
      if (destMaxAmount) {
        filter["destinationAmountDetails.transactionAmount"].$lte = Number(destMaxAmount);
      }
    }

    // Filter by currency (partial match, case-insensitive)
    if (originCurrency) {
      filter["originAmountDetails.transactionCurrency"] = { $regex: originCurrency, $options: "i" };
    }
    if (destinationCurrency) {
      filter["destinationAmountDetails.transactionCurrency"] = { $regex: destinationCurrency, $options: "i" };
    }

    // Filter by country (partial match, case-insensitive)
    if (originCountry) {
      filter["originAmountDetails.country"] = { $regex: originCountry, $options: "i" };
    }
    if (destinationCountry) {
      filter["destinationAmountDetails.country"] = { $regex: destinationCountry, $options: "i" };
    }

    // Filter by date range
    if (startDate || endDate) {
      filter.timestamp = {};
      if (startDate) {
        filter.timestamp.$gte = new Date(startDate as string);
      }
      if (endDate) {
        filter.timestamp.$lte = new Date(endDate as string);
      }
    }

    // Filter by tags (partial match, case-insensitive)
    if (tags) {
      const tagsArray = Array.isArray(tags) ? tags : (tags as string).split(",");
      filter.tags = { $regex: tagsArray.join("|"), $options: "i" }; // Match any of the tags
    }

    // Filter by device data (partial match, case-insensitive)
    if (originDeviceData) {
      filter.originDeviceData = { $regex: originDeviceData, $options: "i" };
    }
    if (destinationDeviceData) {
      filter.destinationDeviceData = { $regex: destinationDeviceData, $options: "i" };
    }

    console.log("Filter Object:", filter);

    // Pagination settings
    const pageNumber = Math.max(Number(page), 1); // Ensure page is at least 1
    const pageSize = Math.max(Number(limit), 1); // Ensure limit is at least 1
    const skip = (pageNumber - 1) * pageSize;

    // Query the database
    const totalTransactions = await Transaction.countDocuments(filter);
    const transactions = await Transaction.find(filter)
      .skip(skip)
      .limit(pageSize);

    console.log("Filtered Transactions:", transactions);

    // Response with paginated data
    res.json({
      status: true,
      total: totalTransactions,
      page: pageNumber,
      limit: pageSize,
      transactions,
    });
  } catch (error) {
    console.error("Error filtering transactions:", error);
    res.status(500).json({ message: "An error occurred while filtering transactions." });
  }
};

export const downloadCSV = (req: Request, res: Response): void => {
  // Sample data - Replace with your dynamic data source
  try {
  console.log("264",req.body)
  const {data }= req.body;
  console.log(data,"265")
    // Log data for debugging
    // console.log('Data for CSV:', data);

    // Check if data is an array of objects
    if (!Array.isArray(data) || !data.every((item) => typeof item === 'object')) {
      throw new Error('Invalid data format: Expected an array of objects');
    }

    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(data);

    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet 1');

    const csvBuffer = XLSX.write(workbook, { bookType: 'csv', type: 'buffer' });

    res.setHeader('Content-Disposition', 'attachment; filename=data.csv');
    res.setHeader('Content-Type', 'text/csv');

    res.send(csvBuffer);
  } catch (error) {
    console.error('Error generating CSV:', error);
    res.status(500).send('Failed to generate CSV');
  }
};


