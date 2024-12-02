import mongoose from "mongoose";

const reportSchema = new mongoose.Schema(
  {
    denunciante: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    tipo: {
      type: String,
      required: true,
      enum: ["Maltrato Físico", "Abandono", "Negligencia", "Crueldad", "Otro"],
    },
    descripcion: {
      type: String,
      required: [true, "La descripción es obligatoria"],
      trim: true,
      minlength: [20, "La descripción debe tener al menos 20 caracteres"],
    },
    ubicacion: {
      direccion: {
        type: String,
        required: [true, "La dirección es obligatoria"],
        trim: true,
      },
      ciudad: {
        type: String,
        required: [true, "La ciudad es obligatoria"],
        trim: true,
      },
      pais: {
        type: String,
        required: [true, "El país es obligatorio"],
        trim: true,
      },
    },
    imagenes: {
      type: Array,
      default: [],
    },
    estado: {
      type: String,
      enum: ["Pendiente", "En Revisión", "Procesada", "Cerrada"],
      default: "Pendiente",
    },
    seguimiento: [
      {
        fecha: {
          type: Date,
          default: Date.now,
        },
        estado: String,
        comentario: String,
        actualizadoPor: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      },
    ],
    urgente: {
      type: Boolean,
      default: false,
    },
    contactoAdicional: {
      telefono: String,
      email: String,
    },
  },
  {
    timestamps: true,
  }
);

const Report = mongoose.model("Report", reportSchema);

export default Report;
