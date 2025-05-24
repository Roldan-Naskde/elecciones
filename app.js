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

    if (!nombre || !partido) {
        return res.status(400).json({ message: 'Nombre y partido son requeridos' });
    }

    try {
        // Verificar si ya existe un candidato con ese partido
        const partidoExistente = await Candidato.findOne({ partido: partido });

        if (partidoExistente) {
            return res.status(400).json({ message: 'Ya existe un candidato con ese nombre de partido' });
        }

        const candidato = new Candidato({ nombre, partido });
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

//editar un candidato
app.put("/candidatos/:id", async (req, res) => {
  const { id } = req.params;
  const { nombre, partido } = req.body;

  try {
    const candidato = await Candidato.findByIdAndUpdate(id, { nombre, partido }, { new: true });
    if (!candidato) {
      return res.status(404).json({ error: "Candidato no encontrado" });
    }
    res.status(200).json(candidato);
  } catch (error) {
    res.status(500).json({ error: "Error al editar el candidato", details: error });
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

//editar un votante
app.put("/votantes/:id", async (req, res) => {
  const { id } = req.params;
  const { nombre, dni } = req.body;

  try {
    const votante = await Votante.findByIdAndUpdate(id, { nombre, dni }, { new: true });
    if (!votante) {
      return res.status(404).json({ error: "Votante no encontrado" });
    }
    res.status(200).json(votante);
  } catch (error) {
    res.status(500).json({ error: "Error al editar el votante", details: error });
  }
});

//eliminar un votante
app.delete("/votantes/:id", async (req, res) => {
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

app.post("/votos", async (req, res) => {
  const { votanteId, candidatoId } = req.body;

  // Validar parámetros requeridos
  if (!votanteId || !candidatoId) {
    return res.status(400).json({ error: "ID de votante y candidato son requeridos" });
  }

  try {
    // Validar existencia del votante
    const votante = await Votante.findById(votanteId);
    if (!votante) {
      return res.status(404).json({ error: "Votante no encontrado" });
    }

    // Validar existencia del candidato
    const candidato = await Candidato.findById(candidatoId);
    if (!candidato) {
      return res.status(404).json({ error: "Candidato no encontrado" });
    }

    // Verificar si el votante ya ha votado
    const yaVoto = await Voto.findOne({ votanteId });
    if (yaVoto) {
      return res.status(400).json({ error: "Este votante ya ha votado" });
    }

    // Registrar el voto
    const voto = new Voto({ votanteId, candidatoId });
    const savedVoto = await voto.save();

    // Actualizar el número de votos del candidato
    await Candidato.findByIdAndUpdate(candidatoId, { $inc: { votos: 1 } });

    // Respuesta exitosa
    res.status(201).json({
      message: "✅ Voto registrado exitosamente",
      voto: savedVoto,
      candidato: {
        nombre: candidato.nombre,
        partido: candidato.partido
      }
    });

  } catch (error) {
    console.error("Error al registrar el voto:", error);
    res.status(500).json({
      error: "❌ Error al registrar el voto",
      details: error.message
    });
  }
});

//listar todos los votos
app.get("/votos", async (req, res) => {
  try {
    const votos = await Voto.find().populate("votanteId").populate("candidatoId");
    res.status(200).json(votos);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener los votos", details: error });
  }
});

//reiniciar los votos
app.post("/reiniciar-votacion", async (req, res) => {
  try {
    await Voto.deleteMany({});
    await ganador.deleteMany({});
    await Votante.updateMany({}, { haVotado: false }); // Reinicia la marca de votantes

    // ¡Esta línea resetea los votos de todos los candidatos!
    await Candidato.updateMany({}, { $set: { votos: 0 } });

    res.json({ success: true });
  } catch (err) {
    console.error('Error reiniciando votación:', err);
    res.status(500).json({ success: false });
  }
});


//obtener un ganador por el candidato con más votos
// Esta ruta obtiene el candidato con más votos y lo devuelve como el ganador
app.get("/ganador", async (req, res) => {
  try {
    const candidatos = await Candidato.find();

    if (candidatos.length === 0) {
      return res.status(404).json({ message: "No hay candidatos registrados" });
    }

    // Encontrar la mayor cantidad de votos
    const maxVotos = Math.max(...candidatos.map(c => c.votos));

    // Filtrar candidatos con esa cantidad de votos
    const ganadores = candidatos.filter(c => c.votos === maxVotos);

    if (maxVotos === 0) {
      return res.status(404).json({ message: "No se encontró un ganador, todos tienen 0 votos" });
    }

    if (ganadores.length === 1) {
      // Hay un solo ganador
      return res.status(200).json({
        message: "Ganador encontrado",
        ganador: ganadores[0]
      });
    } else {
      // Empate entre varios candidatos
      return res.status(200).json({
        message: "Empate entre candidatos",
        ganadores
      });
    }
  } catch (error) {
    res.status(500).json({
      error: "Error al obtener el ganador",
      details: error
    });
  }
});


// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
