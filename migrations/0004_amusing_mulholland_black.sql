ALTER TABLE `websites` RENAME COLUMN `tenantId` TO `user_id`;--> statement-breakpoint
ALTER TABLE `web_page_hits` ADD `website_id` varchar(128) NOT NULL;--> statement-breakpoint
ALTER TABLE `web_sessions` ADD `website_id` varchar(128) NOT NULL;--> statement-breakpoint
ALTER TABLE `web_visitors` ADD `website_id` varchar(128) NOT NULL;--> statement-breakpoint
ALTER TABLE `web_page_hits` ADD CONSTRAINT `web_page_hits_website_id_websites_id_fk` FOREIGN KEY (`website_id`) REFERENCES `websites`(`id`) ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `web_sessions` ADD CONSTRAINT `web_sessions_website_id_websites_id_fk` FOREIGN KEY (`website_id`) REFERENCES `websites`(`id`) ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `web_visitors` ADD CONSTRAINT `web_visitors_website_id_websites_id_fk` FOREIGN KEY (`website_id`) REFERENCES `websites`(`id`) ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `websites` ADD CONSTRAINT `websites_user_id_auth_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `auth_user`(`id`) ON DELETE cascade ON UPDATE cascade;