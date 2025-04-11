import { ScanQrCode } from "lucide-react";
import { cookies } from "next/headers";
import QRCode from "react-qr-code";

export default async function Connect() {
  const cookieStore = cookies();

  const session =
    cookieStore.get("session")?.value || cookieStore.get("session")?.value;
  return (
    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <div className="flex items-center gap-1">
        <ScanQrCode />
        <h1 className="text-lg font-semibold md:text-2xl">QR Connect</h1>
      </div>
      <div
        className="flex flex-1 items-center justify-center rounded-lg"
        x-chunk="dashboard-02-chunk-1"
      >
        <div className="flex flex-col items-center gap-1 text-center">
          <span>Scan to Connect</span>
          <div className="">
            <QRCode
              className="border-[2px] border-white"
              size={256}
              style={{ height: "auto", maxWidth: "100%", width: "100%" }}
              value={session || ""}
              viewBox={`0 0 256 256`}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
