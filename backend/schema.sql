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
  `subject` text,
  `creator` int NOT NULL,
  `status` ENUM ('Fechado', 'Em andamento', 'Concluído')
);

CREATE TABLE `projectSubjects` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `name` text
);

CREATE TABLE `tasks` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `projectId` int NOT NULL,
  `taskUser` int,
  `title` text NOT NULL,
  `description` text,
  `start` datetime,
  `finish` datetime,
  `status` ENUM ('Fechado', 'Em andamento', 'Concluído') NOT NULL
);

CREATE TABLE `projectRecovery` (
  `instanceId` int PRIMARY KEY AUTO_INCREMENT,
  `projectId` int,
  `name` text,
  `description` text,
  `subject` text,
  `creator` int,
  `status` ENUM ('Fechado', 'Em andamento', 'Concluído'),
  `created` datetime NOT NULL
);

CREATE TABLE `taskRecovery` (
  `instanceId` int PRIMARY KEY AUTO_INCREMENT,
  `taskId` int,
  `taskUser` int,
  `title` text,
  `description` text,
  `start` datetime,
  `finish` datetime,
  `status` ENUM ('Fechado', 'Em andamento', 'Concluído'),
  `created` datetime NOT NULL
);

ALTER TABLE `users` ADD FOREIGN KEY (`id`) REFERENCES `userPicture` (`userId`);

ALTER TABLE `projectSubjects` ADD FOREIGN KEY (`name`) REFERENCES `projects` (`subject`);

ALTER TABLE `projects` ADD FOREIGN KEY (`creator`) REFERENCES `users` (`id`);

ALTER TABLE `tasks` ADD FOREIGN KEY (`projectId`) REFERENCES `projects` (`id`);

ALTER TABLE `tasks` ADD FOREIGN KEY (`taskUser`) REFERENCES `users` (`id`);

ALTER TABLE `projects` ADD FOREIGN KEY (`id`) REFERENCES `projectRecovery` (`projectId`);

ALTER TABLE `tasks` ADD FOREIGN KEY (`id`) REFERENCES `taskRecovery` (`taskId`);
