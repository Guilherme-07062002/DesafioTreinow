const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/database");

class alunoPersonal extends Model { }

// Essa tabela é responsavel por dizer quais alunos estão relacionados aos seus devidos personais

alunoPersonal.init(
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
        
    },
    {
        sequelize,
        modelName: "alunoPersonal",
        timestamps: false
    }
);

module.exports = alunoPersonal