import mongoose from "mongoose";

const eleccionesSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    name_papa: { type: String, required: true },
    country: { type: String },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Elecciones", eleccionesSchema);