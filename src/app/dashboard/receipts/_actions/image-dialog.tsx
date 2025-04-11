"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ImageIcon } from "lucide-react";
import { useEffect, useState } from "react";
import Image from "next/image";

export default function ViewImage({
  image_uuid,
}: {
  image_uuid: string | null;
}) {
  const [image, setImage] = useState("");

  useEffect(() => {
    const getImage = async () => {
      if (!image_uuid) return; // Prevent fetching if image_uuid is null

      try {
        const response = await fetch(
          `/api/receipt/image?image_uuid=${image_uuid}`,
        );
        if (!response.ok) {
          throw new Error("Failed to fetch image");
        }
        const img = await response.json();
        setImage(img.message);
      } catch (error) {
        console.error(error);
        setImage(""); // Clear image on error, or set a default image
      }
    };

    getImage();
  }, [image_uuid]); // Dependency on image_uuid

  return (
    <Dialog>
      <DialogTrigger className="relative flex select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 gap-1 cursor-pointer">
        <ImageIcon className="w-4" />
        <p>View Image</p>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Receipt Image</DialogTitle>
          <DialogDescription>
            This image was stored in the cloud ⛅️
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-center">
          {image ? (
            <Image src={image} height={200} width={500} alt="receipt image" />
          ) : (
            <p>Loading...</p> // Display loading or error state
          )}
        </div>
        <DialogFooter></DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
