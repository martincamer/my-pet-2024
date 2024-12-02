import User from "../models/User.js";
import jwt from "jsonwebtoken";
import { transporter } from "../index.js";
import bcryptjs from "bcryptjs";

// Generar JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "24h",
  });
};

// Registrar usuario
const register = async (req, res) => {
  try {
    const { username, email } = req.body;

    // Verificar si el usuario ya existe
    const userExists = await User.findOne({
      $or: [{ email }, { username }],
    });

    if (userExists) {
      return res.status(400).json({
        message:
          userExists.email === email
            ? "Ya existe una cuenta con este email"
            : "El nombre de usuario ya está en uso",
      });
    }

    // Crear usuario
    const user = await User.create(req.body);
    const token = generateToken(user._id);

    res.status(201).json({
      ok: true,
      user: {
        _id: user._id,
        username: user.username,
        nombre: user.nombre,
        apellido: user.apellido,
        email: user.email,
      },
      token,
    });
  } catch (error) {
    console.error("Error en registro:", error);
    res.status(500).json({
      message: "Error en el servidor",
    });
  }
};

// Login usuario
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Verificar si el usuario existe
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        message: "No existe una cuenta con este email",
      });
    }

    // Verificar password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        message: "La contraseña es incorrecta",
      });
    }

    // Generar token y enviar respuesta
    const token = generateToken(user._id);

    res.json({
      ok: true,
      user: {
        _id: user._id,
        username: user.username,
        nombre: user.nombre,
        apellido: user.apellido,
        email: user.email,
      },
      token,
    });
  } catch (error) {
    console.error("Error en login:", error);
    res.status(500).json({
      message: "Error en el servidor",
    });
  }
};

// Registro con Google
const registerWithGoogle = async (req, res) => {
  try {
    const { email, given_name, family_name, sub } = req.body;

    if (!email || !sub) {
      return res.status(400).json({
        message: "Datos de Google incompletos",
      });
    }

    // Verificar si el usuario ya existe
    const userExists = await User.findOne({ email });

    if (userExists) {
      // Si el usuario existe, generamos token y lo devolvemos
      const token = generateToken(userExists._id);
      return res.json({
        ok: true,
        user: {
          _id: userExists._id,
          username: userExists.username,
          nombre: userExists.nombre,
          apellido: userExists.apellido,
          email: userExists.email,
        },
        token,
      });
    }

    // Si no existe, creamos el usuario
    const username = email.split("@")[0] + Math.random().toString(36).slice(-4);

    const user = await User.create({
      username,
      nombre: given_name || "Usuario",
      apellido: family_name || "Google",
      email,
      googleId: sub,
      verificado: true,
      password: Math.random().toString(36).slice(-8), // Contraseña aleatoria
    });

    const token = generateToken(user._id);

    res.status(201).json({
      ok: true,
      user: {
        _id: user._id,
        username: user.username,
        nombre: user.nombre,
        apellido: user.apellido,
        email: user.email,
      },
      token,
    });
  } catch (error) {
    console.error("Error en registro con Google:", error);
    res.status(500).json({
      ok: false,
      message: "Error al registrar con Google",
    });
  }
};

// Obtener perfil del usuario
const profile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "Usuario no encontrado",
      });
    }

    res.json({
      ok: true,
      user: {
        _id: user._id,
        username: user.username,
        nombre: user.nombre,
        apellido: user.apellido,
        email: user.email,
        verificado: user.verificado,
      },
    });
  } catch (error) {
    console.error("Error al obtener perfil:", error);
    res.status(500).json({
      message: "Error al obtener el perfil",
    });
  }
};

// Login con Google
const loginWithGoogle = async (req, res) => {
  try {
    const { email, sub } = req.body;

    if (!email || !sub) {
      return res.status(400).json({
        message: "Datos de Google incompletos",
      });
    }

    // Buscar usuario por email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        message:
          "No existe una cuenta con este email. Por favor, regístrate primero.",
      });
    }

    // Verificar si el usuario se registró con Google
    if (!user.googleId) {
      return res.status(401).json({
        message:
          "Esta cuenta no está vinculada con Google. Por favor, inicia sesión con tu contraseña.",
      });
    }

    // Verificar que el googleId coincida
    if (user.googleId !== sub) {
      return res.status(401).json({
        message: "Credenciales de Google inválidas",
      });
    }

    // Generar token y enviar respuesta
    const token = generateToken(user._id);

    res.json({
      ok: true,
      user: {
        _id: user._id,
        username: user.username,
        nombre: user.nombre,
        apellido: user.apellido,
        email: user.email,
      },
      token,
    });
  } catch (error) {
    console.error("Error en login con Google:", error);
    res.status(500).json({
      ok: false,
      message: "Error al iniciar sesión con Google",
    });
  }
};

// Solicitar cambio de contraseña
const solicitarCambioPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const usuario = await User.findOne({ email });
    if (!usuario) {
      return res.status(404).json({
        message: "No existe una cuenta con este email",
      });
    }

    // Generar código simple de 6 dígitos
    const codigoRecuperacion = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    // Guardar en base de datos
    usuario.resetPasswordToken = codigoRecuperacion;
    usuario.resetPasswordExpires = Date.now() + 3600000; // 1 hora
    await usuario.save();

    // Email simple y directo
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Código para cambiar tu contraseña",
      html: `
        <div style="padding: 20px;">
          <h2>Cambio de Contraseña</h2>
          <p>Tu código para cambiar la contraseña es: <strong>${codigoRecuperacion}</strong></p>
          <p>Este código expira en 1 hora.</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    res.json({
      message: "Código enviado al email",
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      message: "Error al enviar el código",
    });
  }
};

// Verificar código y cambiar contraseña
const verificarCodigoYCambiarPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    console.log("Recibiendo solicitud de cambio de contraseña:");
    console.log("Token:", token);
    console.log("Nueva contraseña recibida:", password);

    // Buscar usuario
    const usuario = await User.findOne({ resetPasswordToken: token });

    if (!usuario) {
      console.log("No se encontró usuario con el token:", token);
      return res.status(400).json({
        message: "Código inválido",
      });
    }

    // Verificar expiración
    if (usuario.resetPasswordExpires < Date.now()) {
      console.log("Token expirado para usuario:", usuario.email);
      return res.status(400).json({
        message: "El código ha expirado",
      });
    }

    // Actualizar la contraseña directamente
    usuario.password = password;
    usuario.resetPasswordToken = undefined;
    usuario.resetPasswordExpires = undefined;

    // Guardar el usuario actualizado
    await usuario.save();

    console.log("Contraseña actualizada exitosamente para:", usuario.email);

    res.json({
      message: "Contraseña actualizada correctamente",
    });
  } catch (error) {
    console.error("Error detallado:", error);
    res.status(500).json({
      message: "Error al cambiar la contraseña",
    });
  }
};

export {
  register,
  login,
  registerWithGoogle,
  loginWithGoogle,
  profile,
  solicitarCambioPassword,
  verificarCodigoYCambiarPassword,
};
