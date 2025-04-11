"use client";

import * as React from "react";
import CategoryForm from "../forms/category-form";
import { PlusIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

export default function CategoryDrawer({ type }: { type: string }) {
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="secondary">
          <PlusIcon />
          Add category
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader>
            <DrawerTitle>Add Category</DrawerTitle>
            <DrawerDescription>You can add new category</DrawerDescription>
          </DrawerHeader>
          <div className="p-4 pb-0">
            <div className="flex items-center justify-center space-x-2"></div>
            <div className="">
              <CategoryForm type={type} />
            </div>
          </div>
          <DrawerFooter>
            <DrawerClose asChild>
              <Button variant="secondary">Cancel</Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
