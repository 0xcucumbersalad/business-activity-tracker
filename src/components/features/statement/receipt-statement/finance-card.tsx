import { PDFDownloadLink } from "@react-pdf/renderer";
import IncomeStatementPDF from "../export-income-statement";
import { Data } from "../export-income-statement";
import { Button } from "@/components/ui/button";
import { FileDownIcon } from "lucide-react";
import { DialogClose } from "@/components/ui/dialog";

export default function FinanceCard({ data }: { data: Data }) {
  return (
    <div>
      <PDFDownloadLink
        document={<IncomeStatementPDF data={data} />}
        fileName="Income_Statement.pdf"
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
