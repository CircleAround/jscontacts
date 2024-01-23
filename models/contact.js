"use strict";
const { Model, Op } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Contact extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.Category = this.belongsTo(models.Category, {
        foreignKey: "categoryId",
        as: "category",
      });
    }

    static async latest(limit = 3) {
      return await Contact.findAll({ order: [["id", "DESC"]], limit });
    }

    static async search({ name, email, sinceDaysAgo }, baseDate = new Date()) {
      const where = {};

      if (name) {
        where.name = { [Op.substring]: name };
      }

      if (email) {
        where.email = { [Op.substring]: email };
      }

      if (sinceDaysAgo) {
        const since = new Date(baseDate);
        since.setDate(since.getDate() - sinceDaysAgo);
        where.createdAt = { [Op.gte]: since };
      }

      return await Contact.findAll({
        order: [["id", "DESC"]],
        where,
      });
    }

    isExample() {
      return this.email.endsWith("@example.com");
    }
  }
  Contact.init(
    {
      name: {
        type: DataTypes.STRING,
        validate: {
          notEmpty: true,
          len: [0, 20],
        },
      },
      email: {
        type: DataTypes.STRING,
        validate: {
          notEmpty: true,
          isEmail: true,
          len: [0, 100],
        },
      },
    },
    {
      sequelize,
      modelName: "Contact",
    }
  );
  return Contact;
};
