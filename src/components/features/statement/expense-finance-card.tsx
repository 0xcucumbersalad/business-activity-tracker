import { PDFDownloadLink } from "@react-pdf/renderer";
import ExpenseFinancePDF from "./expense-finance-pdf";
import { Button } from "@/components/ui/button";
import { FileDownIcon } from "lucide-react";
import { ExpenseDataStructure } from "../export/date-picker";

export default function ExpenseFinanceCard({
  data,
}: {
  data: ExpenseDataStructure[];
}) {
  const date = new Date().toISOString().split("T")[0];

  return (
    <div>
      {data.length > 0 ? (
        <PDFDownloadLink
          document={<ExpenseFinancePDF data={data} />}
          fileName={`expense_finance_statement_${date}.pdf`}
        >
          <Button variant={"ghost"} className="gap-1">
            <FileDownIcon />
            Download as PDF
          </Button>
        </PDFDownloadLink>
      ) : (
        <p className="text-muted-foreground">No data available to display.</p>
      )}
    </div>
  );
}
