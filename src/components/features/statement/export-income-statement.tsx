import React from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

// Define the data types based on the provided JSON structure
type SaleExpenseItem = {
  id: number;
  amount: number;
  category: number;
  description: string;
  date: string;
  createAt: string;
};

type ReceiptItem = {
  id: number;
  date: string;
  delivered_to: string;
  delivered_by: string;
  address: string;
  receipt_number: string;
  receipt_type: "Sales" | "Expense";
  total: number;
  image_uuid: string;
  createAt: string;
  updateAt: string;
};

export type Data = {
  sales: SaleExpenseItem[];
  expense: SaleExpenseItem[];
  receipts: ReceiptItem[];
};

// Define styles for the PDF document
const styles = StyleSheet.create({
  page: {
    padding: 24,
    fontFamily: "Helvetica",
  },
  header: {
    textAlign: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 12,
    color: "gray",
  },
  sectionTitle: {
    marginTop: 16,
    fontSize: 16,
    fontWeight: "bold",
    borderBottomWidth: 1,
    borderBottomColor: "#000",
    borderBottomStyle: "solid",
  },
  table: {
    width: "100%",
    marginTop: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    borderBottomStyle: "solid",
  },
  tableHeader: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    borderBottomStyle: "solid",
    paddingVertical: 8,
    fontWeight: "bold",
  },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 4,
  },
  tableCell: {
    flex: 1,
    fontSize: 10,
  },
  tableCellRight: {
    flex: 1,
    fontSize: 10,
    textAlign: "right",
  },
  footer: {
    marginTop: 16,
    textAlign: "center",
    fontSize: 10,
    color: "gray",
  },
});

// Helper function to calculate totals
const calculateTotal = (items: (SaleExpenseItem | ReceiptItem)[]) =>
  items.reduce(
    (sum, item) => sum + ("amount" in item ? item.amount : item.total),
    0,
  );

// PDF Document Component
export default function IncomeStatementPDF({ data }: { data: Data }) {
  const salesReceipts = data.receipts.filter(
    (item) => item.receipt_type === "Sales",
  );
  const expenseReceipts = data.receipts.filter(
    (item) => item.receipt_type === "Expense",
  );

  const totalSales = calculateTotal(salesReceipts);
  const totalExpenses = calculateTotal(expenseReceipts);

  const totalSalesAll = calculateTotal(data.sales) + totalSales;
  const totalExpensesAll = calculateTotal(data.expense) + totalExpenses;
  const netIncome = totalSalesAll - totalExpensesAll;

  // Format the last date
  const lastDate = new Date(
    Math.max(...data.receipts.map((r) => new Date(r.date).getTime())),
  );
  const formattedDate = new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(lastDate);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Acme Company</Text>
          <Text style={styles.subtitle}>
            123 Business Street, Cityville, State 12345
          </Text>
          <Text style={[styles.subtitle, { marginTop: 8 }]}>
            Income Statement
          </Text>
          <Text style={styles.subtitle}>
            For the period ending {formattedDate}
          </Text>
        </View>

        {/* Sales */}
        <Text style={styles.sectionTitle}>Sales</Text>
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={styles.tableCell}>Date</Text>
            <Text style={styles.tableCell}>Description</Text>
            <Text style={styles.tableCellRight}>Amount</Text>
          </View>
          {data.sales.map((item) => (
            <View style={styles.tableRow} key={item.id}>
              <Text style={styles.tableCell}>
                {new Intl.DateTimeFormat("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                }).format(new Date(item.date))}
              </Text>
              <Text style={styles.tableCell}>{item.description}</Text>
              <Text style={styles.tableCellRight}>
                {item.amount.toFixed(2)}
              </Text>
            </View>
          ))}
        </View>

        {/* Sales Receipts */}
        <Text style={styles.sectionTitle}>Sales Receipts</Text>
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={styles.tableCell}>Date</Text>
            <Text style={styles.tableCell}>Delivered By</Text>
            <Text style={styles.tableCell}>Delivered To</Text>
            <Text style={styles.tableCellRight}>Amount</Text>
          </View>
          {salesReceipts.map((item) => (
            <View style={styles.tableRow} key={item.id}>
              <Text style={styles.tableCell}>
                {new Intl.DateTimeFormat("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                }).format(new Date(item.date))}
              </Text>
              <Text style={styles.tableCell}>{item.delivered_by}</Text>
              <Text style={styles.tableCell}>{item.delivered_to}</Text>
              <Text style={styles.tableCellRight}>{item.total.toFixed(2)}</Text>
            </View>
          ))}
        </View>

        {/* Expenses */}
        <Text style={styles.sectionTitle}>Expenses</Text>
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={styles.tableCell}>Date</Text>
            <Text style={styles.tableCell}>Description</Text>
            <Text style={styles.tableCellRight}>Amount</Text>
          </View>
          {data.expense.map((item) => (
            <View style={styles.tableRow} key={item.id}>
              <Text style={styles.tableCell}>
                {new Intl.DateTimeFormat("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                }).format(new Date(item.date))}
              </Text>
              <Text style={styles.tableCell}>{item.description}</Text>
              <Text style={styles.tableCellRight}>
                {item.amount.toFixed(2)}
              </Text>
            </View>
          ))}
        </View>

        {/* Expense Receipts */}
        <Text style={styles.sectionTitle}>Expense Receipts</Text>
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={styles.tableCell}>Date</Text>
            <Text style={styles.tableCell}>Delivered By</Text>
            <Text style={styles.tableCell}>Delivered To</Text>
            <Text style={styles.tableCellRight}>Amount</Text>
          </View>
          {expenseReceipts.map((item) => (
            <View style={styles.tableRow} key={item.id}>
              <Text style={styles.tableCell}>
                {new Intl.DateTimeFormat("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                }).format(new Date(item.date))}
              </Text>
              <Text style={styles.tableCell}>{item.delivered_by}</Text>
              <Text style={styles.tableCell}>{item.delivered_to}</Text>
              <Text style={styles.tableCellRight}>{item.total.toFixed(2)}</Text>
            </View>
          ))}
        </View>

        {/* Summary */}
        <Text style={styles.sectionTitle}>Summary</Text>
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <Text style={styles.tableCell}>Sales (No Receipt)</Text>
            <Text style={styles.tableCellRight}>
              {calculateTotal(data.sales).toFixed(2)}
            </Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.tableCell}>Sales (Receipt)</Text>
            <Text style={styles.tableCellRight}>{totalSales.toFixed(2)}</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.tableCell}>Expenses (No Receipt)</Text>
            <Text style={styles.tableCellRight}>
              {calculateTotal(data.expense).toFixed(2)}
            </Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.tableCell}>Expenses (Receipt)</Text>
            <Text style={styles.tableCellRight}>
              {totalExpenses.toFixed(2)}
            </Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={[styles.tableCell, { fontWeight: "bold" }]}>
              Net Income
            </Text>
            <Text style={[styles.tableCellRight, { fontWeight: "bold" }]}>
              {netIncome.toFixed(2)}
            </Text>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text>
            This is a computer-generated document. No signature is required.
          </Text>
        </View>
      </Page>
    </Document>
  );
}
