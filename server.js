import express from "express";
import cors from "cors";
import path from "path";
import animalesRouter from "./router/animalesRouter.js";
import usuariosRouter from "./router/usuariosRouter.js";

const app = express();
app.use(cors());
app.use(express.json());

const __dirname = path.resolve();
app.use(express.static(path.join(__dirname, "public")));

app.use("/api/animales", animalesRouter);
app.use("/api/usuarios", usuariosRouter);

app.get("/api", (req, res) => res.send("API Adopciones funcionando"));

export default app;
