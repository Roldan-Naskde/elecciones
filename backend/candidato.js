import mongoose from "mongoose";

const candidatoSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  photo: {
    type: String,
    required: true,
  },
  partyLogo: {
    type: String,
    required: true,
  },
  partyName: {
    type: String,
    required: true,
  },
});

const Candidato = mongoose.model("Candidato", candidatoSchema);

export default Candidato;