const Category = require("../Models/categories");

// @desc    Get all categories
// @route   GET /api/categories
// @access  Private (or Public depending on preference, let's keep it protected for admin/staff)
const getCategories = async (req, res) => {
  try {
    const categories = await Category.findAll({
      order: [["createdAt", "DESC"]]
    });
    res.json(categories);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Create a category
// @route   POST /api/categories
// @access  Private/Admin
const createCategory = async (req, res) => {
  const { categoryName, categoryPrice, categoryDescription } = req.body;

  try {
    const category = await Category.create({
      categoryName,
      categoryPrice,
      categoryDescription,
    });
    res.status(201).json(category);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Delete a category
// @route   DELETE /api/categories/:id
// @access  Private/Admin
const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id);
    if (category) {
      await category.destroy();
      res.json({ message: "Category removed" });
    } else {
      res.status(404).json({ message: "Category not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  getCategories,
  createCategory,
  deleteCategory,
};
