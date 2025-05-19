import path from 'path';
import { fileURLToPath } from 'url';
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import Voto from "./models/voto.js";
import Candidato from "./models/candidato.js";
import Votante from "./models/votante.js";
import ganador from "./models/ganador.js";


dotenv.config(); // Cargar variables de entorno desde .env

const app = express();
const { MONGO_URI, PORT } = process.env;

app.use(express.json()); // Para poder trabajar con JSON en las peticiones

// NUEVO: Para manejar rutas absolutas correctamente
const __filename = fileURLToPath(import.meta.url); // NUEVO
const __dirname = path.dirname(__filename);        // NUEVO

// NUEVO: Servir archivos estáticos desde la carpeta 'frontend'
app.use(express.static(path.join(__dirname, 'frontend'))); // NUEVO

// Conectar a MongoDB
mongoose.connect(MONGO_URI)
    .then(() => console.log('Conectado a MongoDB'))
    .catch((err) => console.log('Error al conectar a MongoDB', err));

// Rutas

//crear un nuevo candidato
app.post('/candidatos', async (req, res) => {
    const { nombre, partido } = req.body;

    const candidato = new Candidato({ nombre, partido });

    try {
        const savedCandidato = await candidato.save();
        res.status(201).json(savedCandidato);
    } catch (error) {
        res.status(400).json({ message: 'Error al crear el candidato', error });
    }
});

// Obtener todos los candidatos
app.get("/candidatos", async (req, res) => {
  try {
    const candidatos = await Candidato.find();
    res.status(200).json(candidatos);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener los candidatos", details: error });
  }
});

//eliminar un candidato
app.delete("/candidatos/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const candidato = await Candidato.findByIdAndDelete(id);
    if (!candidato) {
      return res.status(404).json({ error: "Candidato no encontrado" });
    }
    res.status(200).json({ message: "Candidato eliminado exitosamente" });
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar el candidato", details: error });
  }
});

// Crear un nuevo votante
app.post("/votantes", async (req, res) => {
  const { nombre, dni } = req.body;

  if (!nombre || !dni) {
    return res.status(400).json({ error: "Nombre y DNI son requeridos" });
  }

  try {
    const votante = new Votante({ nombre, dni });
    const savedVotante = await votante.save();

    res.status(201).json({ message: "Votante creado exitosamente", votante: savedVotante });
  } catch (error) {
    res.status(500).json({ error: "Error al crear el votante", details: error });
  }
});

// Obtener todos los votantes
app.get("/votante", async (req, res) => {
  try {
    const votante = await Votante.find();
    res.status(200).json(votante);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener los votantes", details: error });
  }
});

//eliminar un votante
app.delete("/votante/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const votante = await Votante.findByIdAndDelete(id);
    if (!votante) {
      return res.status(404).json({ error: "Votante no encontrado" });
    }
    res.status(200).json({ message: "Votante eliminado exitosamente" });
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar el votante", details: error });
  }
});

//registrar un voto
app.post("/votos", async (req, res) => {
  const { votanteId, candidatoId } = req.body;

  if (!votanteId || !candidatoId) {
    return res.status(400).json({ error: "ID de votante y candidato son requeridos" });
  }

  try {
    const voto = new Voto({ votanteId, candidatoId });
    const savedVoto = await voto.save();

    // Incrementar el conteo de votos del candidato
    await Candidato.findByIdAndUpdate(candidatoId, { $inc: { votos: 1 } });

    res.status(201).json({ message: "Voto registrado exitosamente", voto: savedVoto });
  } catch (error) {
    res.status(500).json({ error: "Error al registrar el voto", details: error });
  }
});


//obtener un ganador por el candidato con más votos
// Esta ruta obtiene el candidato con más votos y lo devuelve como el ganador
app.get("/ganador", async (req, res) => {
  try {
    const candidatos = await Candidato.find();
    const ganador = candidatos.reduce((prev, curr) => {
      return (curr.votos > prev.votos) ? curr : prev;
    }, { votos: 0 });

    if (ganador.votos > 0) {
      res.status(200).json({ message: "Ganador encontrado", ganador });
    } else {
      res.status(404).json({ message: "No se encontró un ganador" });
    }
  } catch (error) {
    res.status(500).json({ error: "Error al obtener el ganador", details: error });
  }
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});