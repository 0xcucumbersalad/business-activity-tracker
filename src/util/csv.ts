export function downloadCSV(data: string) {
  const csv = data;
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "output.csv";
  link.click();
  URL.revokeObjectURL(url);
}
