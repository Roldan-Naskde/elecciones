import mongoose from "mongoose";

const candidatoSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
  },
  partido: {
    type: String,
    required: true,
    unique: true
  },
  votos: {
    type: Number,
    default: 0,
  },
});

const Candidato = mongoose.model("Candidato", candidatoSchema);

export default Candidato;