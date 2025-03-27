drop database trello2;
create database trello2;
use trello2;
CREATE TABLE `users` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `name` text NOT NULL,
  `email` text NOT NULL,
  `phoneNumber` text,
  `password` text NOT NULL
);

CREATE TABLE `userPicture` (
  `userId` int PRIMARY KEY,
  `file` blob NOT NULL
);

CREATE TABLE `projects` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `name` text NOT NULL,
  `description` text,
  `subject` varchar(255),
  `institution` varchar(255),
  `creator` int NOT NULL,
  `status` ENUM ('Fechado', 'Em andamento', 'Concluído') DEFAULT 'Fechado'
);

 create table projectMember (
	projectId int NOT NULL,
	userId int NOT NULL
);

CREATE TABLE `projectSubjects` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `name` varchar(255) UNIQUE NOT NULL
);

CREATE TABLE `institutions` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `name` varchar(255) UNIQUE NOT NULL
);

CREATE TABLE `tasks` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `projectId` int NOT NULL,
  `taskUser` int,
  `title` text NOT NULL,
  `description` text,
  `priority` ENUM ('Baixa', 'Média', 'Alta'),
  `timeEstimate` int COMMENT 'em horas',
  `start` datetime,
  `finish` datetime,
  `status` ENUM ('Fechado', 'Em andamento', 'Concluído') NOT NULL DEFAULT 'Fechado'
);

CREATE TABLE `projectRecovery` (
  `instanceId` int PRIMARY KEY AUTO_INCREMENT,
  `projectId` int NOT NULL,
  `name` text,
  `description` text,
  `subject` varchar(255),
  `institution` varchar(255),
  `creator` int,
  `status` ENUM ('Fechado', 'Em andamento', 'Concluído'),
  `created` datetime NOT NULL
);

CREATE TABLE `taskRecovery` (
  `instanceId` int PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `taskId` int NOT NULL,
  `taskUser` int,
  `title` text,
  `description` text,
  `priority` ENUM ('Baixa', 'Média', 'Alta'),
  `timeEstimate` int COMMENT 'em horas',
  `start` datetime,
  `finish` datetime,
  `status` ENUM ('Fechado', 'Em andamento', 'Concluído'),
  `created` datetime NOT NULL
);

ALTER TABLE `userPicture` ADD FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE;

ALTER TABLE `projects` ADD FOREIGN KEY (`subject`) REFERENCES `projectSubjects` (`name`) ON DELETE SET NULL;

ALTER TABLE `projects` ADD FOREIGN KEY (`institution`) REFERENCES `institutions` (`name`) ON DELETE SET NULL;

ALTER TABLE `projects` ADD FOREIGN KEY (`creator`) REFERENCES `users` (`id`) ON DELETE CASCADE;

ALTER TABLE `tasks` ADD FOREIGN KEY (`projectId`) REFERENCES `projects` (`id`) ON DELETE CASCADE;

ALTER TABLE `tasks` ADD FOREIGN KEY (`taskUser`) REFERENCES `users` (`id`) ON DELETE SET NULL;

ALTER TABLE `projectRecovery` ADD FOREIGN KEY (`projectId`) REFERENCES `projects` (`id`) ON DELETE CASCADE;

ALTER TABLE `taskRecovery` ADD FOREIGN KEY (`taskId`) REFERENCES `tasks` (`id`) ON DELETE CASCADE;

ALTER TABLE `projectMember` ADD FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE;

ALTER TABLE `projectMember` ADD FOREIGN KEY (`projectId`) REFERENCES `projects` (`id`) ON DELETE CASCADE;

INSERT INTO projectSubjects (name) VALUES ('Exatas');
INSERT INTO projectSubjects (name) VALUES ('Humanas');

INSERT INTO institutions (name) VALUES ('Fatec');
INSERT INTO institutions (name) VALUES ('USP');

