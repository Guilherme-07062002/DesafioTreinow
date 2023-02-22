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
                key: 'id'
            }
        }
    },
    {
        sequelize,
        modelName: "registroTreino",
        timestamps: false,
        // timezone: '-03:00' O banco de dados sqlite não permite a alteração do fuso horário padrão, logo ao inserir o horário do treino ele não estará configurado devidamente como o fuso horário de Brasilia.
        
    }
);

module.exports = registroTreino