import mongoose from 'mongoose';

const votanteSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    dni: { type: String, unique: true, required: true }
});

const Votante = mongoose.model('Votante', votanteSchema);
export default Votante;
