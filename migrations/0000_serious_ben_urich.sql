CREATE TABLE `logs` (
	`id` int AUTO_INCREMENT PRIMARY KEY NOT NULL,
	`session_id` varchar(128) NOT NULL,
	`action` enum('PAGE_HIT') NOT NULL,
	`user_agent` varchar(512) NOT NULL,
	`locale` varchar(32) NOT NULL,
	`location` varchar(2) NOT NULL,
	`referrer` varchar(512) NOT NULL,
	`pathname` varchar(512) NOT NULL,
	`href` varchar(512) NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()));
