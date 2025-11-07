import express from 'express';
import cors from 'cors';
import animalesRouter from './router/animalesRouter.js';
import usuariosRouter from './router/usuariosRouter.js';

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/animales', animalesRouter);
app.use('/api/usuarios', usuariosRouter);

app.get('/', (req, res) => res.send('API Adopciones funcionando'));

export default app;
