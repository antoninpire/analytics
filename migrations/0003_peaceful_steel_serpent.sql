CREATE TABLE `auth_key` (
	`id` varchar(255) PRIMARY KEY NOT NULL,
	`user_id` varchar(15) NOT NULL,
	`primary_key` boolean NOT NULL,
	`hashed_password` varchar(255),
	`expires` bigint);
--> statement-breakpoint
CREATE TABLE `auth_session` (
	`id` varchar(128) PRIMARY KEY NOT NULL,
	`user_id` varchar(15) NOT NULL,
	`active_expires` bigint NOT NULL,
	`idle_expires` bigint NOT NULL);
--> statement-breakpoint
CREATE TABLE `auth_user` (
	`id` varchar(15) PRIMARY KEY NOT NULL,
	`email` varchar(255) NOT NULL);
--> statement-breakpoint
CREATE UNIQUE INDEX `email_idx` ON `auth_user` (`email`);--> statement-breakpoint
ALTER TABLE `auth_key` ADD CONSTRAINT `auth_key_user_id_auth_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `auth_user`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `auth_session` ADD CONSTRAINT `auth_session_user_id_auth_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `auth_user`(`id`) ON DELETE cascade ON UPDATE no action;