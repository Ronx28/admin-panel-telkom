-- CreateTable
CREATE TABLE `data_user` (
    `timestamp` VARCHAR(191) NOT NULL,
    `idTele` VARCHAR(191) NOT NULL,
    `nama` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `telepon` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `devisi` VARCHAR(191) NULL,
    `subDevisi` VARCHAR(191) NULL,
    `videoLink` VARCHAR(191) NULL,

    PRIMARY KEY (`idTele`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `data_devisi` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `namaDevisi` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `data_devisi_namaDevisi_key`(`namaDevisi`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `data_sub_devisi` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `namaSubDevisi` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `data_sub_devisi_namaSubDevisi_key`(`namaSubDevisi`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `data_pertanyaan` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `devisiId` INTEGER NOT NULL,
    `subDevisiId` INTEGER NOT NULL,
    `pertanyaan` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `data_user` ADD CONSTRAINT `data_user_devisi_fkey` FOREIGN KEY (`devisi`) REFERENCES `data_devisi`(`namaDevisi`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `data_user` ADD CONSTRAINT `data_user_subDevisi_fkey` FOREIGN KEY (`subDevisi`) REFERENCES `data_sub_devisi`(`namaSubDevisi`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `data_pertanyaan` ADD CONSTRAINT `data_pertanyaan_devisiId_fkey` FOREIGN KEY (`devisiId`) REFERENCES `data_devisi`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `data_pertanyaan` ADD CONSTRAINT `data_pertanyaan_subDevisiId_fkey` FOREIGN KEY (`subDevisiId`) REFERENCES `data_sub_devisi`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
