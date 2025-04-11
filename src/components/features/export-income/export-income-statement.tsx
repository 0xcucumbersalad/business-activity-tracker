"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { ArrowBigDownIcon, FileDownIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import MonthPicker from "@/components/ui/month-picker";
import { Popover } from "@/components/ui/popover-dialog";
import { PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { CalendarIcon } from "@radix-ui/react-icons";
import { useState } from "react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { LoaderCircleIcon } from "lucide-react";
import { PDFDownloadLink } from "@react-pdf/renderer";

type SaleExpenseItem = {
  sales: {
    id: number;
    amount: number;
    category: number;
    description: string;
    date: string;
    createAt: string;
  };
  sales_category: {
    id: number;
    name: string;
    description: string;
  };
};

type ExpenseItem = {
  expenses: {
    id: number;
    amount: number;
    category: number;
    description: string;
    date: string;
    createAt: string;
  };
  expense_category: {
    id: number;
    name: string;
    description: string;
  };
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
  expense: ExpenseItem[];
  receipts: ReceiptItem[];
};

function isValidDate(date: string) {
  const d = new Date(date);
  return d instanceof Date && !isNaN(d.getTime());
}

export function ExportIncomeStatementDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="gap-1 w-full sm:w-auto" variant={"default"}>
          <ArrowBigDownIcon className="h-4 w-4" />
          Export
        </Button>
      </DialogTrigger>
      <DialogContent className="">
        <DialogHeader>
          <DialogTitle>Export as PDF</DialogTitle>
          <DialogDescription>
            Export your monthly financial information into a PDF format. Choose
            range from what month
          </DialogDescription>
        </DialogHeader>
        <GenerateIncomeStatementPickerForm />
      </DialogContent>
    </Dialog>
  );
}

export function GenerateIncomeStatementPickerForm() {
  const { toast } = useToast();
  const [selectedMonths, setSelectedMonths] = useState<{
    firstMonth?: Date;
    secondMonth?: Date;
  }>({});
  const [dates, setDates] = useState<{ firstDate: string; secondDate: string }>(
    {
      firstDate: "",
      secondDate: "",
    }
  );
  const [openPopover, setOpenPopover] = useState<"first" | "second" | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<Data>({
    sales: [],
    expense: [],
    receipts: [],
  });

  const handleMonthSelect = (month: Date, type: "first" | "second") => {
    const options: Intl.DateTimeFormatOptions = {
      timeZone: "Asia/Manila",
      year: "numeric",
      month: "2-digit",
    };
    const formattedDate = new Intl.DateTimeFormat("en-PH", options).format(
      month
    );
    const [monthNum, year] = formattedDate.split("/");
    const formattedDateISO =
      type === "first" ? `${year}-${monthNum}-01` : `${year}-${monthNum}-31`;

    setSelectedMonths((prev) => ({
      ...prev,
      [type === "first" ? "firstMonth" : "secondMonth"]: month,
    }));
    setDates((prev) => ({
      ...prev,
      [type === "first" ? "firstDate" : "secondDate"]: formattedDateISO,
    }));
    setOpenPopover(null);
  };

  const exportDataByDateRequest = async (
    firstDate: string,
    secondDate: string
  ) => {
    try {
      setIsLoading(true);
      const req = await fetch(
        `/api/export?type=All&from=${firstDate}&to=${secondDate}`
      );
      if (req.ok) {
        const res = await req.json();
        setData(res);
        if (res?.sales?.length === 0) {
          toast({
            title: "FAILED: No sales found",
            description: "No sales found on the selected month.",
            variant: "destructive",
          });
        }
      } else {
        toast({
          title: "FAILED: No sales found",
          description: "No sales found on the selected month.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex gap-2 flex-col">
      {/* Month Pickers */}
      {(["first", "second"] as const).map((type) => (
        <Popover
          key={type}
          open={openPopover === type}
          onOpenChange={(isOpen) => setOpenPopover(isOpen ? type : null)}
        >
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "",
                !selectedMonths[
                  type === "first" ? "firstMonth" : "secondMonth"
                ] && "text-muted-foreground"
              )}
            >
              {selectedMonths[type === "first" ? "firstMonth" : "secondMonth"]
                ? format(
                    selectedMonths[
                      type === "first" ? "firstMonth" : "secondMonth"
                    ]!,
                    "MMMM-yyyy"
                  )
                : "Pick a month"}
              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <MonthPicker
              currentMonth={new Date()}
              onMonthChange={(month) => handleMonthSelect(month, type)}
            />
          </PopoverContent>
        </Popover>
      ))}

      {/* Conditional Button Rendering */}
      <section>
        {data.sales.length > 0 ||
        data.expense.length > 0 ||
        data.receipts.length > 0 ? (
          // Show Export Button if there is data
          <ExportButton data={data} />
        ) : (
          // Show Generate Button if there is no data
          <Button
            onClick={() =>
              exportDataByDateRequest(dates.firstDate, dates.secondDate)
            }
            disabled={isLoading}
          >
            {isLoading ? (
              <LoaderCircleIcon className="animate-spin" />
            ) : (
              "Generate"
            )}
          </Button>
        )}
      </section>
    </div>
  );
}

// export button
export function ExportButton({ data }: { data: Data }) {
  const date = new Date().toISOString().split("T")[0];
  return (
    <div>
      <PDFDownloadLink
        document={<IncomeStatementReactTemplate data={data} />}
        fileName={`income-statement-${date}.pdf`}
      >
        <DialogClose asChild>
          <Button variant={"ghost"} className="gap-1">
            <FileDownIcon />
            Download as PDF
          </Button>
        </DialogClose>
      </PDFDownloadLink>
    </div>
  );
}

// Template
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

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

const calculateTotal = (
  items: (SaleExpenseItem | ExpenseItem | ReceiptItem)[]
) =>
  items.reduce((sum, item) => {
    if ("sales" in item) {
      return (
        sum + (typeof item.sales.amount === "number" ? item.sales.amount : 0)
      );
    } else if ("expenses" in item) {
      return (
        sum +
        (typeof item.expenses.amount === "number" ? item.expenses.amount : 0)
      );
    } else if ("total" in item) {
      return sum + (typeof item.total === "number" ? item.total : 0);
    }
    return sum;
  }, 0);

export function IncomeStatementReactTemplate({ data }: { data: Data }) {
  const salesReceipts = data.receipts.filter(
    (item) => item.receipt_type === "Sales"
  );
  const expenseReceipts = data.receipts.filter(
    (item) => item.receipt_type === "Expense"
  );

  const totalSales = calculateTotal(salesReceipts);
  const totalExpenses = calculateTotal(expenseReceipts);

  const totalSalesAll = calculateTotal(data.sales) + totalSales;
  const totalExpensesAll = calculateTotal(data.expense) + totalExpenses;
  const netIncome = totalSalesAll - totalExpensesAll;

  // Format the last date
  const validDates = data.receipts
    .map((r) => new Date(r.date))
    .filter((d) => !isNaN(d.getTime()));

  const lastDate =
    validDates.length > 0
      ? new Date(Math.max(...validDates.map((d) => d.getTime())))
      : new Date();
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
            <View style={styles.tableRow} key={item.sales.id}>
              <Text style={styles.tableCell}>
                {isValidDate(item.sales.date)
                  ? new Intl.DateTimeFormat("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    }).format(new Date(item.sales.date))
                  : "Invalid Date"}
              </Text>
              <Text style={styles.tableCell}>{item.sales.description}</Text>
              <Text style={styles.tableCellRight}>
                {typeof item.sales.amount === "number"
                  ? item.sales.amount.toFixed(2)
                  : "N/A"}
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
                {isValidDate(item.date)
                  ? new Intl.DateTimeFormat("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    }).format(new Date(item.date))
                  : "Invalid Date"}
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
            <View style={styles.tableRow} key={item.expenses.id}>
              <Text style={styles.tableCell}>
                {isValidDate(item.expenses.date)
                  ? new Intl.DateTimeFormat("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    }).format(new Date(item.expenses.date))
                  : "Invalid Date"}
              </Text>
              <Text style={styles.tableCell}>{item.expenses.description}</Text>
              <Text style={styles.tableCellRight}>
                {typeof item.expenses.amount === "number"
                  ? item.expenses.amount.toFixed(2)
                  : "N/A"}
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
                {isValidDate(item.date)
                  ? new Intl.DateTimeFormat("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    }).format(new Date(item.date))
                  : "Invalid Date"}
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
