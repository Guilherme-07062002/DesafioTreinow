const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/database");

class registroTreino extends Model { }

registroTreino.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        inicioTreino: {
            type: DataTypes.DATE,
            defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
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
    },
    {
        sequelize,
        modelName: "registroTreino",
        timestamps: false
    }
);

module.exports = registroTreino