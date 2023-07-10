CREATE TABLE `web_page_hits` (
	`id` varchar(128) PRIMARY KEY NOT NULL DEFAULT 'gfp51iw0okscuctlk9aalbkn',
	`visitor_id` varchar(128) NOT NULL,
	`session_id` varchar(128) NOT NULL,
	`href` varchar(512) NOT NULL,
	`referrer` varchar(512),
	`pathname` varchar(512) NOT NULL,
	`query_params` varchar(512),
	`created_at` timestamp NOT NULL);
--> statement-breakpoint
CREATE TABLE `web_sessions` (
	`id` varchar(128) PRIMARY KEY NOT NULL,
	`visitor_id` varchar(128) NOT NULL,
	`referrer` varchar(512),
	`query_params` varchar(512),
	`duration` int NOT NULL DEFAULT 0,
	`country` varchar(128),
	`city` varchar(128),
	`device` varchar(128),
	`os` varchar(128),
	`browser` varchar(128),
	`language` varchar(128),
	`created_at` timestamp NOT NULL);
--> statement-breakpoint
CREATE TABLE `web_visitors` (
	`id` varchar(128) PRIMARY KEY NOT NULL DEFAULT 'wzl20i05mpbq94kpchpd4mq2',
	`created_at` timestamp NOT NULL);
--> statement-breakpoint
ALTER TABLE `web_page_hits` ADD CONSTRAINT `web_page_hits_visitor_id_web_visitors_id_fk` FOREIGN KEY (`visitor_id`) REFERENCES `web_visitors`(`id`) ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `web_page_hits` ADD CONSTRAINT `web_page_hits_session_id_web_sessions_id_fk` FOREIGN KEY (`session_id`) REFERENCES `web_sessions`(`id`) ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `web_sessions` ADD CONSTRAINT `web_sessions_visitor_id_web_visitors_id_fk` FOREIGN KEY (`visitor_id`) REFERENCES `web_visitors`(`id`) ON DELETE cascade ON UPDATE cascade;