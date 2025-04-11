import React from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import { Receipt } from "@/db/schema";

type Data = Receipt;

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
    borderBottom: "1pt solid #000",
  },
  table: {
    width: "100%",
    marginTop: 8,
    borderBottom: "1pt solid #ccc",
  },
  tableHeader: {
    flexDirection: "row",
    borderBottom: "1pt solid #ccc",
    paddingVertical: 8,
    fontWeight: "bold",
  },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 4,
  },
  tableCell: {
    flex: 1,
    fontSize: 12,
  },
  tableCellRight: {
    flex: 1,
    fontSize: 12,
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
const calculateTotal = (data: Data[]) =>
  data.reduce((sum, item) => sum + item.total, 0);

// PDF Document Component
export default function IncomeStatementPDF({ data }: { data: Data[] }) {
  // Separate data into sales and expenses
  const salesReceipts = data.filter((item) => item.receipt_type === "Sales");
  const expenseReceipts = data.filter(
    (item) => item.receipt_type === "Expense",
  );

  const totalSales = calculateTotal(salesReceipts);
  const totalExpenses = calculateTotal(expenseReceipts);
  const netIncome = totalSales - totalExpenses;

  // Format the last date
  const lastData = data[data.length - 1];
  const lastDate = new Date(lastData.date);
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

        {/* Sales Receipts */}
        <Text style={styles.sectionTitle}>Sales Receipts</Text>
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={styles.tableCell}>Date</Text>
            <Text style={styles.tableCell}>Delivered By</Text>
            <Text style={styles.tableCell}>Delivered To</Text>
            <Text style={styles.tableCell}>Address</Text>
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
              <Text style={styles.tableCell}>{item.address}</Text>
              <Text style={styles.tableCellRight}>{item.total.toFixed(2)}</Text>
            </View>
          ))}
        </View>

        {/* Expense Receipts */}
        <Text style={styles.sectionTitle}>Expense Receipts</Text>
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={styles.tableCell}>Date</Text>
            <Text style={styles.tableCell}>Description</Text>
            <Text style={styles.tableCell}>Category</Text>
            <Text style={styles.tableCell}>Address</Text>
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
              <Text style={styles.tableCell}>{item.receipt_type}</Text>
              <Text style={styles.tableCell}>{item.address}</Text>
              <Text style={styles.tableCellRight}>{item.total.toFixed(2)}</Text>
            </View>
          ))}
        </View>

        {/* Summary */}
        <Text style={styles.sectionTitle}>Summary</Text>
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <Text style={styles.tableCell}>Total Sales</Text>
            <Text style={styles.tableCellRight}>{totalSales.toFixed(2)}</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.tableCell}>Total Expenses</Text>
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
