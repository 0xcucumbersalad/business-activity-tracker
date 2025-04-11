import {
  Home,
  CreditCardIcon,
  Receipt,
  BadgeDollarSign,
  Scan,
  ScanQrCode,
  DiamondPercent,
} from "lucide-react";

import { SchemaType } from "@google/generative-ai";

export const Navigation = [
  {
    name: "Dashboard",
    link: "/dashboard",
    icon: <Home className="h-4 w-4" />,
  },
  {
    name: "Sales",
    link: "/dashboard/sales",
    icon: <BadgeDollarSign className="h-4 w-4" />,
  },
  {
    name: "Expenses",
    link: "/dashboard/expenses",
    icon: <CreditCardIcon className="h-4 w-4" />,
  },
  {
    name: "Receipts",
    link: `/dashboard/receipts`,
    icon: <Receipt className="h-4 w-4" />,
  },
  {
    name: "Without Receipt",
    link: "/dashboard/receiptless",
    icon: <DiamondPercent className="h-5 w-5" />,
  },
  {
    name: "Scan Receipt",
    link: "/dashboard/scan",
    icon: <Scan className="h-4 w-4" />,
  },
  {
    name: "Connect",
    link: "/dashboard/connect",
    icon: <ScanQrCode className="h-4 w-4" />,
  },
];

export const MobileNavigation = [
  {
    name: "Dashboard",
    link: "/dashboard",
    icon: <Home className="h-5 w-5" />,
  },
  {
    name: "Sales",
    link: "/dashboard/sales",
    icon: <BadgeDollarSign className="h-5 w-5" />,
  },
  {
    name: "Expenses",
    link: "/dashboard/expenses",
    icon: <CreditCardIcon className="h-5 w-5" />,
  },
  {
    name: "Without Receipt",
    link: "/dashboard/receiptless",
    icon: <DiamondPercent className="h-5 w-5" />,
  },
  {
    name: "Receipts",
    link: "/dashboard/receipts",
    icon: <Receipt className="h-5 w-5" />,
  },
  {
    name: "Scan Receipt",
    link: "/dashboard/scan",
    icon: <Scan className="h-5 w-5" />,
  },
  {
    name: "Connect",
    link: "/dashboard/connect",
    icon: <ScanQrCode className="h-5 w-5" />,
  },
];

export const generationConfig = {
  temperature: 2,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
  responseMimeType: "application/json",
  responseSchema: {
    type: SchemaType.OBJECT,
    properties: {
      date: {
        type: SchemaType.STRING,
      },
      delivered_to: {
        type: SchemaType.STRING,
      },
      address: {
        type: SchemaType.STRING,
      },
      delivered_by: {
        type: SchemaType.STRING,
      },
      receipt_number: {
        type: SchemaType.STRING,
      },
      items: {
        type: SchemaType.ARRAY,
        items: {
          type: SchemaType.OBJECT,
          properties: {
            quantity: {
              type: SchemaType.NUMBER,
            },
            description: {
              type: SchemaType.STRING,
            },
            unit_price: {
              type: SchemaType.NUMBER,
            },
            unit: {
              type: SchemaType.STRING,
            },
            amount: {
              type: SchemaType.NUMBER,
            },
          },
          required: ["description", "unit_price", "unit", "amount", "quantity"],
        },
      },
      total: {
        type: SchemaType.NUMBER,
      },
    },
    required: [
      "date",
      "receipt_number",
      "delivered_to",
      "delivered_by",
      "address",
      "items",
      "total",
    ],
  },
};

export const systemInstruction =
  "Base on the image provided give me the response, date format: YYYY-MM-DD, if none of the json, make the value null. Make sure that the total is identical if you sum up the items. delivered_to should be a name not address, and also delivered_by and Seller is the same. delivered_to and buyer is the same. Delivered_by cannot be U-Price, U-price is unit per price";

export const URL = "https://dashboard-staging.jwisnetwork.com";
