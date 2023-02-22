const Sequelize = require("sequelize")
const sequelize = new Sequelize("bd", "gui", "12345", {
    dialect: "sqlite",
    host: "./dev.sqlite",
    //timezone: '-03:00' O banco de dados sqlite não permite a alteração do fuso horário padrão, logo ao inserir o horário do treino ele não estará configurado devidamente como o fuso horário de Brasilia.
  });
  
  module.exports = sequelize;