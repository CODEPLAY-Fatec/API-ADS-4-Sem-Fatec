// middlewares/uploadMiddleware.ts
import multer from "multer";
import { Request, Response, NextFunction } from "express";

const upload = multer({//filtros da imagem
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024, // ate 5 mb
    },
    fileFilter: (req, file, cb) => {
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error("Tipo de arquivo inválido."));
        }
    }
});

// Função middleware que trata erro manualmente
export const uploadSingleImage = (req: Request, res: Response, next: NextFunction) => {
    upload.single("imagem")(req, res, function (err: any) {
        if (err instanceof multer.MulterError) {
            console.log(err.message)

            return res.status(400).json({ error: `Erro do multer: ${err.message}` });
        } else if (err) {
            return res.status(400).json({ error: `Erro: ${err.message}` });
        }
        next();
    });
};
