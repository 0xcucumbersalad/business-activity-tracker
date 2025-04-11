import React from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
//import { Sales } from "@/db/schema";
import { SalesDataStructure } from "../export/date-picker";

//type Data = Sales;

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
    fontWeight: "bold",
    fontSize: 12,
    color: "gray",
  },
  table: {
    width: "100%",
    marginTop: 16,
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

// PDF Document Component
export default function SalesFinancePDF({
  data,
}: {
  data: SalesDataStructure[];
}) {
  const totalAmount = data.reduce((sum, item) => sum + item.sales.amount, 0);
  const lastData = data[data.length - 1];

  const lastDate = new Date(lastData.sales.date);

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
            Without Receipt Sales Statement
          </Text>
          <Text style={styles.subtitle}>
            For the period ending {formattedDate}
          </Text>
        </View>

        {/* Table */}
        <View style={styles.table}>
          {/* Table Header */}
          <View style={styles.tableHeader}>
            <Text style={styles.tableCell}>Date</Text>
            <Text style={styles.tableCell}>Description</Text>
            <Text style={styles.tableCell}>Category</Text>
            <Text style={styles.tableCellRight}>Amount</Text>
          </View>

          {/* Table Body */}
          {data.map((item) => (
            <View style={styles.tableRow} key={item.sales.id}>
              <Text style={styles.tableCell}>
                {new Intl.DateTimeFormat("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                }).format(new Date(item.sales.date))}
              </Text>
              <Text style={styles.tableCell}>{item.sales.description}</Text>
              <Text style={styles.tableCell}>{item.sales_category.name}</Text>
              <Text style={styles.tableCellRight}>
                {item.sales.amount.toFixed(2)}
              </Text>
            </View>
          ))}

          {/* Table Footer */}
          <View style={styles.tableRow}>
            <Text style={[styles.tableCell, { fontWeight: "bold" }]}>
              Total Sales
            </Text>
            <Text style={styles.tableCell}></Text>
            <Text style={[styles.tableCellRight, { fontWeight: "bold" }]}>
              {totalAmount.toFixed(2)}
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
