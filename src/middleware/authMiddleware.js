const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET || "mysecretkey";

const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    return res.status(403).json({ message: "No hay token suministrado" });
  }

  const token = authHeader.split(" ")[1]; // Extraemos el token quitando el prefijo "Bearer"
  if (!token) {
    return res.status(403).json({ message: "No hay token suministrado" });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Token inválido" });
    }
    req.userId = decoded.id; // Almacena el ID del usuario decodificado en la solicitud
    next(); // Continua al siguiente middleware o controlador
  });
};

module.exports = verifyToken;
