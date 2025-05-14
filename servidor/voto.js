import mongoose from "mongoose";

const votoSchema = new mongoose.Schema({
  candidatoId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Candidato", // Referencia al modelo de candidatos
    required: true,
  },
  dni: {
    type: String,
    required: true,
    unique: true, // Evitar que un mismo DNI vote más de una vez
  },
  fecha: {
    type: Date,
    default: Date.now,
  },
});

const Voto = mongoose.model("Voto", votoSchema);

export default Voto;