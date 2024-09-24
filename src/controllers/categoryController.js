const Category = require("../models/CategoryModel");

// Crear una nueva categoría
exports.createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name || !description) {
      return res.status(400).json({ message: "Todos los campos son obligatorios" });
    }

    const category = new Category({ name, description });
    await category.save();

    res.status(201).json({
      message: "Categoría creada con éxito",
      category
    });
  } catch (error) {
    res.status(500).json({ message: "Error al crear la categoría", error });
  }
};

// Obtener todas las categorías
exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener las categorías", error });
  }
};

// Obtener una categoría por ID
exports.getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.findById(id);

    if (!category) {
      return res.status(404).json({ message: "Categoría no encontrada" });
    }

    res.status(200).json(category);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener la categoría", error });
  }
};

// Actualizar una categoría
exports.updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    const category = await Category.findById(id);

    if (!category) {
      return res.status(404).json({ message: "Categoría no encontrada" });
    }

    // Actualizar los campos que fueron enviados en el cuerpo de la solicitud
    if (name) category.name = name;
    if (description) category.description = description;

    await category.save();

    res.status(200).json({
      message: "Categoría actualizada con éxito",
      category
    });
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar la categoría", error });
  }
};

// Eliminar una categoría
exports.deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.findById(id);

    if (!category) {
      return res.status(404).json({ message: "Categoría no encontrada" });
    }

    await category.remove();
    res.status(200).json({ message: "Categoría eliminada con éxito" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar la categoría", error });
  }
};
