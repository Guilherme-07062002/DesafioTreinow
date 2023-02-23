const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/database");

class avaliacaoPersonal extends Model { }

avaliacaoPersonal.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        id_usuario: {
            type: DataTypes.INTEGER,
            references: {
                model: 'usuarios',
                key: 'id',
                onDelete: 'CASCADE'
            },
            allowNull: false
        },
        id_personal: {
            type: DataTypes.INTEGER,
            references: {
                model: 'usuarios',
                key: 'id',
                onDelete: 'CASCADE'
            },
            allowNull: false
        },
    },
    {
        sequelize,
        modelName: "avaliacaoPersonal",
        timestamps: false
    }
);

module.exports = avaliacaoPersonal