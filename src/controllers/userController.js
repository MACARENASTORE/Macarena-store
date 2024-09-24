const User = require('../models/UserModel');


// Actualizar el perfil del usuario autenticado
exports.updateProfile = async (req, res) => {
  try {
    const { name, last_name, nick, bio } = req.body;

    // Buscar y actualizar el usuario por su ID (req.userId, que es obtenido del middleware de autenticación)
    const updatedUser = await User.findByIdAndUpdate(
      req.userId,
      { name, last_name, nick, bio },  // Campos que se actualizan
      { new: true, runValidators: true }  // Retornar el usuario actualizado y validar los cambios
    );

    // Verificar si el usuario fue encontrado y actualizado
    if (!updatedUser) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Responder con el usuario actualizado
    res.status(200).json({ message: 'Perfil actualizado correctamente', user: updatedUser });
  } catch (error) {
    res.status(500).json({ message: 'Error en el servidor', error });
  }
};

// Eliminar la cuenta del usuario autenticado
exports.deleteUser = async (req, res) => {
  try {
    // Buscar y eliminar el usuario por su ID
    const deletedUser = await User.findByIdAndDelete(req.userId);

    // Verificar si el usuario fue encontrado y eliminado
    if (!deletedUser) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Responder confirmando la eliminación del usuario
    res.status(200).json({ message: 'Usuario eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error en el servidor', error });
  }
};

// Obtener el perfil del usuario autenticado
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password'); // Excluir la contraseña
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ message: 'Error en el servidor', error });
  }
};