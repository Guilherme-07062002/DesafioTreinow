const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/database");

class avaliacaoPersonal extends Model { }

// Tabela responsável por armazenar as avaliações dos personais feitas pelos alunos

avaliacaoPersonal.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        id_aluno: {
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
        avaliacao: {
            type: DataTypes.SMALLINT,
            allowNull: false
        }
    },
    {
        sequelize,
        modelName: "avaliacaoPersonal",
        timestamps: false
    }
);

module.exports = avaliacaoPersonal