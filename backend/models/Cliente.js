import mongoose from "mongoose";
import bcrypt from "bcrypt";

const clienteSchema = mongoose.Schema({
  identificacion: {
    type: String,
    required: true, //dato requerido
    trim: true, //quita espacios de inicio y final
    unique: true //no se puede repetir
  },
  nombre: {
    type: String,
    required: true,
    trim: true
  },
  apellido: {
    type: String,
    required: true,
    trim: true
  },
  edad: {
    type: String,
    required: true,
    trim: true
  },
  correo: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  //SEGURIDAD
  contraseña: {
    type: String,
    required: true,
    trim: true
  },
  token: {
    type: String,
  },
  confirmado: {
    type: Boolean,
    default: false
  }
},
{
  timestamps: true, //columna creado y actualizado.
});

//cifrar contraseña
clienteSchema.pre("save", async function(next){
  if (!this.isModified("contraseña")){
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.contraseña = await bcrypt.hash(this.contraseña, salt);
})

//comprueba contraseña
clienteSchema.methods.comprobarContraseña = async function (contraseñaFormulario){
  return await bcrypt.compare(contraseñaFormulario, this.contraseña);
}

const cliente = mongoose.model("Cliente", clienteSchema);
export default cliente;