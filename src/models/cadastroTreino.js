const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/database");

class cadastroTreino extends Model { }

cadastroTreino.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        duracao: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        nome: {
            type: DataTypes.STRING,
            allowNull: false
        },
        data: {
            type: DataTypes.DATEONLY,
            defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
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
        modelName: "cadastroTreino",
        timestamps: false
    }
);

module.exports = cadastroTreino