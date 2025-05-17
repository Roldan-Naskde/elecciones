import mongoose from 'mongoose';

const ganadorSchema = new mongoose.Schema({
    candidatoId: { type: mongoose.Schema.Types.ObjectId, ref: 'Candidato', required: true },
    votos: { type: Number, required: true }
});

const Ganador = mongoose.model('Ganador', ganadorSchema);
export default Ganador;