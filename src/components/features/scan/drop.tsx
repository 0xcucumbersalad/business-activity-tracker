"use client";
import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import imageCompression from "browser-image-compression";
import { ImageUp, LoaderCircleIcon } from "lucide-react";
import { ScanReceiptRequest } from "@/use-case/scan-receipt-client";
import { useToast } from "@/hooks/use-toast";
import ReceiptForm, { ReceiptFormValues } from "./receipt-form";
import { Button } from "@/components/ui/button";

type Item = {
  amount: number;
  description: string;
  unit_price: number;
};

export type Message = {
  address: string | null;
  date: string | null;
  delivered_by: string | null;
  delivered_to: string | null;
  items: Array<Item>;
  receipt_no: number;
  receipt_type: string | null;
  total: number;
};

export function DropzoneReceipt() {
  const { toast } = useToast();
  const [isLoading, setLoading] = useState(false);
  const [receipt, setReceipt] = useState<ReceiptFormValues>();
  const [isDone, setDone] = useState(false);
  const [image, setImage] = useState("");
  const [imageFile, setImageFile] = useState<File>();

  // Scan Receipt
  const ScanReceipt = useCallback(
    async (image: string | ArrayBuffer | null, imageFile: File) => {
      setImageFile(imageFile);
      setImage(String(image));
      const response = await ScanReceiptRequest(image);
      setLoading(false);
      if (!response.ok) {
        toast({
          title: "Uh oh! Something went wrong.",
          description: "There was a problem with your request.",
          variant: "destructive",
        });
      } else {
        const data = await response.json();
        setReceipt(data?.message);
        setDone(true);
      }
    },
    [toast]
  );

  // React Dropzone
  const onDrop = useCallback(
    (acceptedFiles: Array<File>) => {
      acceptedFiles.map(async (file) => {
        setLoading(true);
        const options = {
          maxSizeMB: 1,
          maxWidthOrHeight: 1080,
          useWebWorker: true,
        };

        const imageFile = await imageCompression(file, options);

        const compressedFile = await imageCompression.getDataUrlFromFile(
          imageFile
        );

        return await ScanReceipt(compressedFile, imageFile);
      });
    },
    [ScanReceipt]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [],
    },
  });

  const handleCancel = () => {
    setDone(false);
  };

  return (
    <div className="dropzone-container">
      {isDone ? (
        <div>
          {isDone ? (
            <div>
              <ReceiptForm
                imageFile={imageFile}
                image={image}
                data={receipt}
                setDone={setDone}
              />
              <Button
                className="m-2"
                variant="destructive"
                onClick={handleCancel}
              >
                Cancel or Re-scan
              </Button>
            </div>
          ) : (
            ""
          )}
        </div>
      ) : (
        <div>
          {isLoading ? (
            <div className="flex items-center gap-1">
              <LoaderCircleIcon className="animate-spin" />
              <span>Loading ...</span>
            </div>
          ) : (
            <div
              {...getRootProps()}
              className="border p-20 rounded-md hover:cursor-pointer shadow-sm hover:bg-primary-foreground"
            >
              <input {...getInputProps()} />
              {isDragActive ? (
                <p>Drop the receipt image here ...</p>
              ) : (
                <div className="items-center text-center flex flex-col">
                  <ImageUp size={35} className="m-2" />
                  <p>Drag receipt here, or click to select files</p>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
