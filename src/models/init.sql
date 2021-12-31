-- 由 init js 代码生成，需要自己手动复制到本文件
CREATE TABLE IF NOT EXISTS `apps` (
	`id` INTEGER(11) NOT NULL AUTO_INCREMENT,
	`name` VARCHAR(45) NOT NULL UNIQUE,
	`secret` VARCHAR(255) NOT NULL,
	`created_at` DATETIME NOT NULL,
	`updated_at` DATETIME NOT NULL,
	`deleted_at` DATETIME,
	PRIMARY KEY (`id`)
) ENGINE = InnoDB;


CREATE TABLE IF NOT EXISTS `apps_type` (
	`id` INTEGER(11) NOT NULL AUTO_INCREMENT,
	`name` VARCHAR(45) NOT NULL UNIQUE,
	`apps_id` INTEGER(11) NOT NULL,
	`created_at` DATETIME NOT NULL,
	`updated_at` DATETIME NOT NULL,
	`deleted_at` DATETIME,
	PRIMARY KEY (`id`)
) ENGINE = InnoDB;
