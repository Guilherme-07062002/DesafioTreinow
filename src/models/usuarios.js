const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/database");

class Usuarios extends Model { }

Usuarios.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        nome: {
            type: DataTypes.STRING,
            allowNull: false
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        documento: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        tipo: {
            type: DataTypes.STRING,
            allowNull: false
        },
        senha: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
    },
    {
        sequelize,
        modelName: "usuarios",
        timestamps: false
    }
);

module.exports = Usuarios