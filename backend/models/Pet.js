import mongoose from "mongoose";

const comentarioSchema = new mongoose.Schema({
  texto: {
    type: String,
    required: true,
    trim: true,
  },
  usuario: {
    _id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    nombre: String,
    email: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const petSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: [true, "El nombre es obligatorio"],
      trim: true,
    },
    especie: {
      type: String,
      required: [true, "La especie es obligatoria"],
      enum: ["Perro", "Gato", "Otro"],
    },
    raza: {
      type: String,
      required: [true, "La raza es obligatoria"],
      trim: true,
    },
    edad: {
      type: Number,
      required: [true, "La edad es obligatoria"],
    },
    tamanio: {
      type: String,
      required: [true, "El tamaño es obligatorio"],
      enum: ["Pequeño", "Mediano", "Grande"],
    },
    sexo: {
      type: String,
      required: [true, "El sexo es obligatorio"],
      enum: ["Macho", "Hembra"],
    },
    descripcion: {
      type: String,
      required: [true, "La descripción es obligatoria"],
      trim: true,
    },
    imagenes: {
      type: Array,
      default: [],
    },
    ubicacion: {
      ciudad: {
        type: String,
        required: [true, "La ciudad es obligatoria"],
      },
      pais: {
        type: String,
        required: [true, "El país es obligatorio"],
      },
    },
    estado: {
      type: String,
      enum: ["Disponible", "Adoptado", "En proceso"],
      default: "Disponible",
    },
    urgente: {
      type: Boolean,
      default: false,
    },
    vacunado: {
      type: Boolean,
      default: false,
    },
    esterilizado: {
      type: Boolean,
      default: false,
    },
    propietario: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    comentarios: [comentarioSchema],
    adoptante: {
      _id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      nombre: String,
      email: String,
    },
  },
  {
    timestamps: true,
  }
);

const Pet = mongoose.model("Pet", petSchema);

export default Pet;
