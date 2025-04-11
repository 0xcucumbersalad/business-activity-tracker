import { PDFDownloadLink } from "@react-pdf/renderer";
import SalesFinancePDF from "./sales-finance-pdf";
import { Button } from "@/components/ui/button";
import { FileDownIcon } from "lucide-react";
import { SalesDataStructure } from "../export/date-picker";

export default function SalesFinanceCard({
  data,
}: {
  data: SalesDataStructure[];
}) {
  const date = new Date().toISOString().split("T")[0];

  return (
    <div>
      {data.length > 0 ? (
        <PDFDownloadLink
          document={<SalesFinancePDF data={data} />}
          fileName={`finance_statement_${date}.pdf`}
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
