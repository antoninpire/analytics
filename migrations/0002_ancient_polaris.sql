CREATE TABLE `websites` (
	`id` varchar(128) PRIMARY KEY NOT NULL,
	`tenantId` varchar(128) NOT NULL,
	`name` varchar(128) NOT NULL,
	`url` varchar(512) NOT NULL,
	`created_at` timestamp NOT NULL);
--> statement-breakpoint
ALTER TABLE `web_page_hits` MODIFY COLUMN `id` varchar(128) NOT NULL;--> statement-breakpoint
ALTER TABLE `web_visitors` MODIFY COLUMN `id` varchar(128) NOT NULL;