import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';

const app = express();
const PORT = Number(process.env.PORT) || 3001;

app.use(bodyParser.json());
app.use(cors({
  origin: 'http://localhost:3000',
}));

// Usando as rotas
// app.use('/api', ) //modo para usar rota q atualmente nao existe


app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});



