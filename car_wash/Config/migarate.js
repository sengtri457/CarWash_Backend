const sequelize = require("./Config/db");
// const Category = require("./models/categoryModels");

(async () => {
  try {
    await sequelize.sync({ alter: true });
    console.log("✅ Migration completed");
  } catch (err) {
    console.error("❌ Migration failed:", err);
  }
})();