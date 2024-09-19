const Review = require("../models/ReviewModel");

exports.createReview = async (req, res) => {
  try {
    const { user, product, rating, comment } = req.body;
    const review = new Review({ user, product, rating, comment });
    await review.save();
    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ message: "Error al crear la reseña", error });
  }
};

exports.getReviewsByProduct = async (req, res) => {
  try {
    const reviews = await Review.find({ product: req.params.productId }).populate("user");
    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener las reseñas", error });
  }
};

exports.deleteReview = async (req, res) => {
  try {
    await Review.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Reseña eliminada con éxito" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar la reseña", error });
  }
};
