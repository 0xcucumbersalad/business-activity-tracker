import { ReceiptFormValuesNew } from "@/components/features/scan/receipt-form";
import { deleteFileUrl } from "@/lib/files";
import { createReceipt } from "@/data-access/receipts";
import { createItem, updateItem } from "@/data-access/receipt_items";
import { deleteReceipt, updateReceipt } from "@/data-access/receipts";
import { ReceiptFormData } from "@/components/features/scan/receipt";
export async function createReceiptUseCase(data: ReceiptFormValuesNew) {
  //const image_uuid: string = createUUID();

  const newReceipt = {
    ...data,
  };

  const receipt = await createReceipt(newReceipt);
  //await uploadFileToBucket(image, image_uuid);

  data.items.map(async (item) => {
    const items = await createItem({
      ...item,
      receipt: receipt.id,
    });

    return items;
  });

  return receipt;
}

export async function updateReceiptUseCase(data: ReceiptFormData) {
  const { id } = data;

  const new_data = {
    id: data.id,
    date: data.date,
    delivered_by: data.delivered_by,
    delivered_to: data.delivered_to,
    address: data.address,
    receipt_number: data.receipt_number,
    expense_category: data.expense_category,
    sales_category: data.sales_category,
    receipt_type: data.receipt_type,
    total: data.total,
    image_uuid: data.image_uuid,
  };

  const receipt = await updateReceipt(Number(id), new_data);

  if (receipt) {
    data.items.map(async (item) => {
      await updateItem(item, id);
    });
  }
}

export async function deleteReceiptUseCase({
  id,
  image_uuid,
}: {
  id: string | null;
  image_uuid: string | null;
}) {
  const removeData = await deleteReceipt(Number(id));

  if (removeData.rowsAffected) {
    const deleteImage = await deleteFileUrl(image_uuid as string);

    return deleteImage;
  } else {
    return false;
  }
}
