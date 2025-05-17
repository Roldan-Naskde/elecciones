import express from "express";
import mongoose from "mongoose";
import Voto from "./models/voto.js";
import Candidato from "./models/candidato.js";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const { MONGO_URI, PORT } = process.env;

app.use(express.json());

// Conexion con la base de datos
mongoose
  .connect(MONGO_URI)
  .then(() => console.log("Conectado a la base de datos"))
  .catch((err) => console.log("Error al conectar a la base de datos", err));

// Registrar voto
app.post("/votar", async (req, res) => {
  const { candidatoId, dni } = req.body;

  if (!candidatoId || !dni) {
    return res.status(400).json({ error: "Candidato ID y DNI son requeridos" });
  }

  try {
    // Verificar si el DNI ya ha votado
    const votoExistente = await Voto.findOne({ dni });
    if (votoExistente) {
      return res.status(400).json({ error: "El DNI ya ha registrado un voto" });
    }

    // Crear y guardar el voto
    const voto = new Voto({ candidatoId, dni });
    const savedVoto = await voto.save();

    res.status(201).json({ message: "Voto registrado exitosamente", voto: savedVoto });
  } catch (error) {
    res.status(500).json({ error: "Error al registrar el voto", details: error });
  }
});

app.get("/candidatos", async (req, res) => {
  try {
    const candidatos = await Candidato.find();
    res.status(200).json(candidatos);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener la lista de candidatos", details: error });
  }
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});