const { DataTypes } = require("sequelize");
const sequelize = require("../Config/db");

const Category = sequelize.define("Category", {
  categoryId: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  categoryName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  categoryPrice: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  categoryDescription: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
}, {
  timestamps: true,
});

module.exports = Category;
