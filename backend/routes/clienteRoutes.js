import express from "express";
const router = express.Router();

import { registrar, autenticar, confirmar, olvidePassword, comprobarToken, nuevoPassword } from "../controllers/clienteController.js"

//Autenticacion. registro y confirmacion de clientes
router.post("/", registrar); //Crear un nuevo cliente
router.post("/login", autenticar);
router.get("/confirmar/:token", confirmar);
router.post("/olvide-password", olvidePassword);
router.get("/olvide-password/:token", comprobarToken);
router.post("/olvide-password/:token", nuevoPassword);
//router.route("/olvide-password/:token").get(comprobarToken).post(nuevoPassword); //simplificar misma ruta

export default router;