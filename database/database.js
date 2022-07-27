
const Sequelize = require("Sequelize");

const connection = new Sequelize('guiapress','root','123456',{
    host: 'localhost',
    dialect: 'mysql'
});

module.exports = connection;