// models/voto.js
import mongoose from 'mongoose';

const votoSchema = new mongoose.Schema({
    votanteId: { type: mongoose.Schema.Types.ObjectId, ref: 'Votante', required: true },
    candidatoId: { type: mongoose.Schema.Types.ObjectId, ref: 'Candidato', required: true },
});

const Voto = mongoose.model('Voto', votoSchema);
export default Voto;
