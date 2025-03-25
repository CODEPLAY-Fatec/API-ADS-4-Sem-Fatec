-- CreateTable
CREATE TABLE `institutions` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,

    UNIQUE INDEX `name`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `projectrecovery` (
    `instanceId` INTEGER NOT NULL AUTO_INCREMENT,
    `projectId` INTEGER NOT NULL,
    `name` TEXT NULL,
    `description` TEXT NULL,
    `subject` VARCHAR(255) NULL,
    `institution` VARCHAR(255) NULL,
    `creator` INTEGER NULL,
    `status` ENUM('Fechado', 'Em andamento', 'Concluído') NULL,
    `created` DATETIME(0) NOT NULL,

    INDEX `projectId`(`projectId`),
    PRIMARY KEY (`instanceId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `projects` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` TEXT NOT NULL,
    `description` TEXT NULL,
    `subject` VARCHAR(255) NULL,
    `institution` VARCHAR(255) NULL,
    `creator` INTEGER NOT NULL,
    `status` ENUM('Fechado', 'Em andamento', 'Concluído') NULL DEFAULT 'Fechado',

    INDEX `creator`(`creator`),
    INDEX `institution`(`institution`),
    INDEX `subject`(`subject`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `projectsubjects` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,

    UNIQUE INDEX `name`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `taskrecovery` (
    `instanceId` INTEGER NOT NULL AUTO_INCREMENT,
    `taskId` INTEGER NOT NULL,
    `taskUser` INTEGER NULL,
    `title` TEXT NULL,
    `description` TEXT NULL,
    `priority` ENUM('Baixa', 'Média', 'Alta') NULL,
    `timeEstimate` INTEGER NULL,
    `start` DATETIME(0) NULL,
    `finish` DATETIME(0) NULL,
    `status` ENUM('Fechado', 'Em andamento', 'Concluído') NULL,
    `created` DATETIME(0) NOT NULL,

    INDEX `taskId`(`taskId`),
    PRIMARY KEY (`instanceId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tasks` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `projectId` INTEGER NOT NULL,
    `taskUser` INTEGER NULL,
    `title` TEXT NOT NULL,
    `description` TEXT NULL,
    `priority` ENUM('Baixa', 'Média', 'Alta') NULL,
    `timeEstimate` INTEGER NULL,
    `start` DATETIME(0) NULL,
    `finish` DATETIME(0) NULL,
    `status` ENUM('Fechado', 'Em andamento', 'Concluído') NOT NULL DEFAULT 'Fechado',

    INDEX `projectId`(`projectId`),
    INDEX `taskUser`(`taskUser`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `userpicture` (
    `userId` INTEGER NOT NULL,
    `file` BLOB NOT NULL,

    PRIMARY KEY (`userId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `users` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` TEXT NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `phoneNumber` TEXT NULL,
    `password` TEXT NOT NULL,
    `isActive` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `users_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `projectrecovery` ADD CONSTRAINT `projectrecovery_ibfk_1` FOREIGN KEY (`projectId`) REFERENCES `projects`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `projects` ADD CONSTRAINT `projects_ibfk_1` FOREIGN KEY (`subject`) REFERENCES `projectsubjects`(`name`) ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `projects` ADD CONSTRAINT `projects_ibfk_2` FOREIGN KEY (`institution`) REFERENCES `institutions`(`name`) ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `projects` ADD CONSTRAINT `projects_ibfk_3` FOREIGN KEY (`creator`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `taskrecovery` ADD CONSTRAINT `taskrecovery_ibfk_1` FOREIGN KEY (`taskId`) REFERENCES `tasks`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `tasks` ADD CONSTRAINT `tasks_ibfk_1` FOREIGN KEY (`projectId`) REFERENCES `projects`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `tasks` ADD CONSTRAINT `tasks_ibfk_2` FOREIGN KEY (`taskUser`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `userpicture` ADD CONSTRAINT `userpicture_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;
