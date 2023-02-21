const Usuarios = require("../models/usuarios");

module.exports = {
    async all(request, response) {
        try {
            const usuarios = await Usuarios.findAll();
            response.status(200).json(usuarios);
        } catch (error) {
            console.log(error);
            response.status(400).send(error);
        }
    }
    ,
    async create(request, response) {
        try {
            await Usuarios.create(request.body);
            response.status(200).json("Usuário Cadastrado.");
        } catch (error) {
            console.log(error);
            response.status(400).send(error);
        }
    }
    //,
    // async one(request, response) {
    //     try {
    //         const id = request.params.id;
    //         const usuarios = await Usuarios.findOne({ where: { id } });
    //         if (!usuarios) {
    //             return response.status(400).json("Usuário não encontrado.");
    //         }
    //         response.status(200).json(usuarios);
    //     } catch (error) {
    //         console.log(error);
    //         response.status(400).send(error);
    //     }
    // },
    // async update(request, response) {
    //     try {
    //         const { nome, email, documento, tipo, senha } = request.body;
    //         const id = request.params.id;
    //         const usuarios = await Usuarios.findOne({ where: { id } });

    //         if (!usuarios) {
    //             return response.status(400).json("Usuário não encontrado.");
    //         }
    //         usuarios.nome = nome;
    //         usuarios.email = email;
    //         usuarios.documento = documento;
    //         usuarios.tipo = tipo;
    //         usuarios.senha = senha;

    //         await usuarios.save();
    //         response.status(200).json("Dados do usuário atualizados.");
    //     } catch (error) {
    //         console.log(error);
    //         response.status(400).send(error);
    //     }
    // },
    // async delete(request, response) {
    //     try {
    //         const id = request.params.id;
    //         const usuarios = await Usuarios.destroy({ where: { id } });
    //         if (!usuarios) {
    //             return response.status(400).json("Usuário não encontrado.");
    //         }
    //         response.status(200).json("Usuário removido.");
    //     } catch (error) {
    //         console.log(error);
    //         response.status(400).send(error);
    //     }
    // }
};
