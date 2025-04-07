import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import projectRoutes from "./routes/projectRoutes";
import userRoute from "./routes/userRoute";
import dotenv from "dotenv";
import { authenticateToken } from "./middleware/middleware";
import cookieParser from "cookie-parser";
import passwordRecoveryRoutes from "./routes/passwordRecoveryRoutes";

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 3001;

app.use(bodyParser.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true, // Permite envio de cookies
  }),
);

// Usando as rotas
// app.use('/api', ) //modo para usar rota q atualmente nao existe

app.use("/api", userRoute); //manter aqui emcima somente login/cadastro

app.use("/api/password-recovery", passwordRecoveryRoutes);

app.use(authenticateToken); // as rotas abaixo desse autenticador estao protegidas

app.use("/api", projectRoutes);

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
