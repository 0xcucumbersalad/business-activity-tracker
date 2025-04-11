export async function ScanReceiptRequest(
  image: string | ArrayBuffer | null,
): Promise<Response> {
  const data = {
    image: image,
  };

  const scanImageResponse = await fetch("/api/scan", {
    method: "POST",
    body: JSON.stringify(data),
  });

  return scanImageResponse;
}
