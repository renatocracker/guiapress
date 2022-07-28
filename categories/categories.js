const { Sequelize } = require("sequelize/types");
const Siquelize = require("siquelize");
const connection = require("../database/database");

const Category = connection.define('categories', {
    title: {
        type: Sequelize.toString,
        allowNull: false
    },slug: {
        type: Sequelize.toString,
        allowNull: false
    }
});

module.exports = Category;