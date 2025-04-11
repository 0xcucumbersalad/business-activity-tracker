ALTER TABLE `expenses` ALTER COLUMN "created_at" TO "created_at" text DEFAULT (CURRENT_TIMESTAMP);--> statement-breakpoint
ALTER TABLE `receipts` ALTER COLUMN "created_at" TO "created_at" text DEFAULT (CURRENT_TIMESTAMP);--> statement-breakpoint
ALTER TABLE `receipts` ALTER COLUMN "updated_at" TO "updated_at" text DEFAULT CURRENT_TIMESTAMP;--> statement-breakpoint
ALTER TABLE `sales` ALTER COLUMN "created_at" TO "created_at" text DEFAULT (CURRENT_TIMESTAMP);--> statement-breakpoint
ALTER TABLE `users` ALTER COLUMN "created_at" TO "created_at" text NOT NULL DEFAULT (CURRENT_TIMESTAMP);--> statement-breakpoint
ALTER TABLE `users` ALTER COLUMN "updated_at" TO "updated_at" integer;