const Sequelize = require("sequelize");
const connection = require("../database/database");

const User = connection.define('users',{
    email: {
        type: Sequelize.STRING,
        allowNull: false
    },senha: {
        type: Sequelize.STRING,
        allowNull: false
    }
})

User.sync({force:false}); //se a tabela não exisiter no banco ele cria automaticamente

module.exports = User;