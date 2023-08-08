const Category = require("../models/category");

exports.getCategoryId = (req, res, next, id) => {
  Category.findById(id)
    .then((category) => {
      req.category = category;
      next();
    })
    .catch((err) => {
      if (err) {
        return res.status(400).json({ error: "Category not found in DB" });
      }
    });
};

exports.createCategory = (req, res) => {
  const category = new Category(req.body);
  category
    .save()
    .then((category) => res.json({ category }))
    .catch((err) => {
      if (err)
        return res.status(400).json({ error: "Cannot create a category" });
    });
};

exports.getCategory = (req, res) => {
  return res.json(req.category);
};

exports.getAllCategories = (req, res) => {
  const limit = parseInt(req.query.limit) || 8;
  const sortBy = req.query.sortBy || "_id";
  Category.find({})
    .select("-photo")
    .populate("category")
    .sort([[sortBy, "asc"]])
    .limit(limit)
    .then((allCategories) => {
      return res.status(200).json({ allCategories });
    })
    .catch((err) => {
      if (err) return res.status(400).json({ error: "No categories found" });
    });
};

exports.updateCategory = (req, res) => {
  const category = req.category;
  category.name = req.body.name;
  category
    .save()
    .then((updatedCategory) => res.json({ updatedCategory }))
    .catch((err) => {
      if (err)
        return res.status(400).json({ error: "Failed to update the category" });
    });
};

exports.removeCategory = (req, res) => {
  const category = req.category;
  category
    .deleteOne()
    .then((removedCategory) => {
      return res.json({
        message: `${removedCategory.name} category is successfully deleted`,
      });
    })
    .catch((err) => {
      if (err)
        return res.status(400).json({ error: "Failed to delete the category" });
    });
};
