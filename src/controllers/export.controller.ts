import { Response, NextFunction } from 'express';
import { Transaction } from '../models/Transaction';
import { AuthRequest } from '../middlewares/auth.middleware';
import { createObjectCsvStringifier } from 'csv-writer';
import PDFDocument from 'pdfkit';

export const exportCSV = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const transactions = await Transaction.find({ userId }).sort({ date: -1 }).lean();

    const csvStringifier = createObjectCsvStringifier({
      header: [
        { id: 'date', title: 'Date' },
        { id: 'type', title: 'Type' },
        { id: 'category', title: 'Category' },
        { id: 'amount', title: 'Amount' },
        { id: 'note', title: 'Note' },
        { id: 'tags', title: 'Tags' }
      ]
    });

    const records = transactions.map(t => ({
      date: t.date?.toISOString().split('T')[0],
      type: t.type,
      category: t.category,
      amount: t.amount,
      note: t.note || '',
      tags: t.tags ? t.tags.join(', ') : ''
    }));

    const header = csvStringifier.getHeaderString();
    const csvContent = header ? header + csvStringifier.stringifyRecords(records) : csvStringifier.stringifyRecords(records);

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=transactions.csv');
    res.status(200).send(csvContent);
  } catch (error) {
    next(error);
  }
};

export const exportPDF = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const transactions = await Transaction.find({ userId }).sort({ date: -1 }).lean();

    const doc = new PDFDocument();
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=transactions.pdf');
    doc.pipe(res);

    doc.fontSize(20).text('SmartSpend Transactions Report', { align: 'center' });
    doc.moveDown();

    transactions.forEach(t => {
      const dateStr = t.date?.toISOString().split('T')[0];
      doc.fontSize(12).text(`${dateStr} | ${t.type.toUpperCase()} | ${t.category} | ${t.amount} | ${t.note || ''}`);
      doc.moveDown(0.5);
    });

    doc.end();
  } catch (error) {
    next(error);
  }
};
