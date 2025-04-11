CREATE TABLE `expense_category` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`description` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `expenses` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`amount` real NOT NULL,
	`expense_category` integer NOT NULL,
	`description` text NOT NULL,
	`date` text NOT NULL,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP),
	FOREIGN KEY (`expense_category`) REFERENCES `expense_category`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `items` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`description` text NOT NULL,
	`unit_price` real NOT NULL,
	`amount` real NOT NULL,
	`receipt_id` integer NOT NULL,
	FOREIGN KEY (`receipt_id`) REFERENCES `receipts`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `sales` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`amount` real NOT NULL,
	`sales_category` integer NOT NULL,
	`description` text NOT NULL,
	`date` text NOT NULL,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP),
	FOREIGN KEY (`sales_category`) REFERENCES `sales_category`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `sales_category` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`description` text NOT NULL
);
--> statement-breakpoint
ALTER TABLE `receipts` ALTER COLUMN "receipt_number" TO "receipt_number" text NOT NULL;--> statement-breakpoint
ALTER TABLE `receipts` ALTER COLUMN "created_at" TO "created_at" text DEFAULT (CURRENT_TIMESTAMP);--> statement-breakpoint
ALTER TABLE `receipts` ALTER COLUMN "updated_at" TO "updated_at" text DEFAULT CURRENT_TIMESTAMP;--> statement-breakpoint
ALTER TABLE `receipts` ADD `date` text NOT NULL;--> statement-breakpoint
ALTER TABLE `receipts` ADD `delivered_to` text NOT NULL;--> statement-breakpoint
ALTER TABLE `receipts` ADD `delivered_by` text NOT NULL;--> statement-breakpoint
ALTER TABLE `receipts` ADD `receipt_type` text NOT NULL;--> statement-breakpoint
ALTER TABLE `receipts` ADD `sales_category` integer REFERENCES sales_category(id);--> statement-breakpoint
ALTER TABLE `receipts` ADD `expense_category` integer REFERENCES expense_category(id);--> statement-breakpoint
ALTER TABLE `receipts` ADD `image_uuid` text NOT NULL;--> statement-breakpoint
ALTER TABLE `receipts` DROP COLUMN `name`;--> statement-breakpoint
ALTER TABLE `receipts` DROP COLUMN `items`;--> statement-breakpoint
ALTER TABLE `receipts` DROP COLUMN `tax`;--> statement-breakpoint
ALTER TABLE `receipts` DROP COLUMN `accuracy`;--> statement-breakpoint
ALTER TABLE `users` ADD `role` text NOT NULL;