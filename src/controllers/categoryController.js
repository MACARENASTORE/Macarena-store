const Category = require("../models/CategoryModel");

exports.createCategory = async (req, res) => {
    try {
      const { name, description} = req.body;
      const category = new Category({ name, description});
      await category.save();
      res.status(201).json(category);
    } catch (error) {
      res.status(500).json({ message: "Error al crear categoria", error });
    }
  };
  