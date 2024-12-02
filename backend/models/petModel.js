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

const petSchema = mongoose.Schema(
  {
    // ... otros campos ...

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

export default mongoose.model("Pet", petSchema);
