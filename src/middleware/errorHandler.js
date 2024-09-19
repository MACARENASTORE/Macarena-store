const errorHandler = (err, req, res, next) => {
    console.error(err.stack); // Loguea el error completo en la consola
  
    res.status(err.status || 500).json({
      message: err.message || "Ocurrió un error en el servidor",
    });
  };
  
  module.exports = errorHandler;
  