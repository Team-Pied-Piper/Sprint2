//const express = require("express"); //Sin usar modulos en nodeJS
import express from 'express';
import dotenv from "dotenv"; //dependencia para ocultar coneccion a DB
import conectarDB from './config/db.js';
import clienteRoutes from './routes/clienteRoutes.js';

const app = express();
app.use(express.json()); //para procesar informacion .json

dotenv.config();

conectarDB();

//ROUTING
app.use("/api/cliente", clienteRoutes);

const PORT = process.env.PORT || 4000

app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`)
});