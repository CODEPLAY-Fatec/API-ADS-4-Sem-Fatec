/*
  Warnings:

  - You are about to drop the `institutions` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `projectrecovery` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `projects` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `projectsubjects` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `taskrecovery` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `tasks` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `users` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `projectrecovery` DROP FOREIGN KEY `projectrecovery_ibfk_1`;

-- DropForeignKey
ALTER TABLE `projects` DROP FOREIGN KEY `projects_ibfk_1`;

-- DropForeignKey
ALTER TABLE `projects` DROP FOREIGN KEY `projects_ibfk_2`;

-- DropForeignKey
ALTER TABLE `projects` DROP FOREIGN KEY `projects_ibfk_3`;

-- DropForeignKey
ALTER TABLE `taskrecovery` DROP FOREIGN KEY `taskrecovery_ibfk_1`;

-- DropForeignKey
ALTER TABLE `tasks` DROP FOREIGN KEY `tasks_ibfk_1`;

-- DropForeignKey
ALTER TABLE `tasks` DROP FOREIGN KEY `tasks_ibfk_2`;

-- DropForeignKey
ALTER TABLE `userpicture` DROP FOREIGN KEY `userpicture_ibfk_1`;

-- DropTable
DROP TABLE `institutions`;

-- DropTable
DROP TABLE `projectrecovery`;

-- DropTable
DROP TABLE `projects`;

-- DropTable
DROP TABLE `projectsubjects`;

-- DropTable
DROP TABLE `taskrecovery`;

-- DropTable
DROP TABLE `tasks`;

-- DropTable
DROP TABLE `users`;

-- CreateTable
CREATE TABLE `User` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `phoneNumber` VARCHAR(191) NULL,
    `password` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Project` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `subject` VARCHAR(191) NULL,
    `institution` VARCHAR(191) NULL,
    `creatorId` INTEGER NOT NULL,
    `status` ENUM('Fechado', 'Em_andamento', 'Concluído') NOT NULL DEFAULT 'Fechado',

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Task` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `projectId` INTEGER NOT NULL,
    `taskUserId` INTEGER NULL,
    `title` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `priority` ENUM('Baixa', 'Média', 'Alta') NOT NULL,
    `timeEstimate` INTEGER NULL,
    `start` DATETIME(3) NULL,
    `finish` DATETIME(3) NULL,
    `status` ENUM('Fechado', 'Em_andamento', 'Concluído') NOT NULL DEFAULT 'Fechado',

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ProjectMember` (
    `projectId` INTEGER NOT NULL,
    `userId` INTEGER NOT NULL,

    PRIMARY KEY (`projectId`, `userId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ProjectSubject` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `ProjectSubject_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ProjectInstitution` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `ProjectInstitution_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `UserPicture` ADD CONSTRAINT `UserPicture_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Project` ADD CONSTRAINT `Project_creatorId_fkey` FOREIGN KEY (`creatorId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Project` ADD CONSTRAINT `Project_subject_fkey` FOREIGN KEY (`subject`) REFERENCES `ProjectSubject`(`name`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Project` ADD CONSTRAINT `Project_institution_fkey` FOREIGN KEY (`institution`) REFERENCES `ProjectInstitution`(`name`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Task` ADD CONSTRAINT `Task_projectId_fkey` FOREIGN KEY (`projectId`) REFERENCES `Project`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Task` ADD CONSTRAINT `Task_taskUserId_fkey` FOREIGN KEY (`taskUserId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ProjectMember` ADD CONSTRAINT `ProjectMember_projectId_fkey` FOREIGN KEY (`projectId`) REFERENCES `Project`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ProjectMember` ADD CONSTRAINT `ProjectMember_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
