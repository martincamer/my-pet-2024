import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Verificar conexión
transporter
  .verify()
  .then(() => {
    console.log("Servidor de correo listo para enviar");
  })
  .catch((error) => {
    console.error("Error en la configuración del correo:", error);
  });

export default transporter;
