import Cliente from "../models/Cliente.js";
import generarId from "../helpers/generarId.js";
import generarJWT from "../helpers/generarJWT.js";


//registrar ---------------------------------------
const registrar = async (req, res) => {
  //evitar registros duplicados
  const { identificacion } = req.body;
  const existeId = await Cliente.findOne({ identificacion });

  const { correo } = req.body;
  const existeCorreo = await Cliente.findOne({ correo });

  if (existeId || existeCorreo) {
    const error = new Error("Cliente ya registrado");
    return res.status(400).json({ msg: error.message });
  }
  //evitar registros duplicados

  try {
    const cliente = new Cliente(req.body);
    cliente.token = generarId();
    const clientelmacenado = await cliente.save();
    res.json(clientelmacenado);

  } catch (error) {
    console.log(error)
  }

};

//----------------------------------------------------------
//autenticar -----------------------------------------------
const autenticar = async (req, res) => {
  const { correo, contraseña } = req.body;
  //Comprobar si el usuario existe
  const cliente = await Cliente.findOne({ correo });
  if (!cliente) {
    const error = new Error("El usuario no existe");
    return res.status(404).json({ msg: error.message });
  }
  //Comprobar si el usuario esta confirmado
  if (!cliente.confirmado) {
    const error = new Error("Tu cuenta no ha sido confirmada");
    return res.status(403).json({ msg: error.message });
  }
  //Comprobar contraseña
  if (await cliente.comprobarContraseña(contraseña)) {
    res.json({
      _id: cliente._id,
      nombre: cliente.nombre,
      correo: cliente.correo,
      token: generarJWT(cliente._id),
    })
  }
  else {
    const error = new Error("Contraseña incorrecta");
    return res.status(404).json({ msg: error.message });
  }
}
//----------------------------------------------------------
//confirmar cuenta via token -------------------------------
const confirmar = async (req,res) => {
  const {token} = req.params;
  const clienteConfirmar = await Cliente.findOne({ token });
  if (!clienteConfirmar){
    const error = new Error("TOKEN no valido");
    return res.status(404).json({ msg: error.message });
  }
  try {
    clienteConfirmar.confirmado = true;
    clienteConfirmar.token = "";
    await clienteConfirmar.save();
    res.json({msg: "Usuario confirmado"});
  } catch (error) {
    console.log(error);
  }
}
//----------------------------------------------------------
//reset contraseña -----------------------------------------
const olvidePassword = async (req, res) => {
  const {correo} = req.body;
  const cliente = await Cliente.findOne({ correo });
  if (!cliente) {
    const error = new Error("El usuario no existe");
    return res.status(404).json({ msg: error.message });
  }
  try {
    cliente.token = generarId();
    await cliente.save();
    res.json({msg: "Hemos envia un correo con las instrucciones"});
  } catch (error) {
    console.log(error);
  }
};
//comprobar token ------------------------------------------
const comprobarToken = async (req, res) => {
  const { token } = req.params;
  const tokenValido = await Cliente.findOne({ token });
  if (tokenValido){
    res.json({msg: "Token valido y el usuario existe"});
  }
  else{
    const error = new Error("TOKEN no valido");
    return res.status(404).json({ msg: error.message });
  }
}
//Nuevo password -------------------------------------------
const nuevoPassword =async(req,res) => {

}
//----------------------------------------------------------

export {
  registrar, autenticar, confirmar, olvidePassword, comprobarToken, nuevoPassword
}