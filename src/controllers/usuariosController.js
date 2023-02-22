const Usuarios = require("../models/usuarios");
const registroTreino = require("../models/registroTreino")
const sequelize = require("../config/database");

const jwt = require("jsonwebtoken");
const SECRET = 'secret'
const blacklist = []

module.exports = {

    async all(request, response) {
        try {
            console.log('Acesso autorizado')
            const usuarios = await Usuarios.findAll();
            response.status(200).json(usuarios);
        } catch (error) {
            console.log(error);
            response.status(400).send(error);
        }
    },
    async autenticate(request, response) {
        try {
            const email = request.body.email;
            const senha = request.body.senha;
            const usuarios = await Usuarios.findOne({ where: { email, senha } });
            if (!usuarios) {
                return response.status(401).json("Falha na autenticação.");
            } else {
                if (request.body.email == usuarios.email && request.body.senha == usuarios.senha) {
                    const token = jwt.sign({ userId: usuarios.id }, SECRET, { expiresIn: 300 })
                    return response.json({ auth: true, token })
                }
            }
        } catch (error) {
            console.log(error)
            response.status(400).send(error)
        }
    },
    // Middleware de autenticação
    async verifyJWT(request, response, next) {
        const token = request.headers['x-access-token']
        const index = blacklist.findIndex(item => item === token)
        if (index !== -1) return response.status(401).end()
        jwt.verify(token, SECRET, (error, decoded) => {
            if (error) return response.status(401).end();

            console.log('Necessário realizar autenticação')
            request.userId = decoded.userId
            next()
        })
    },
    async logout(request, response) {
        console.log('Usuário fez logout.')
        blacklist.push(request.headers['x-access-token'])
        response.end()
    },
    async storeWorkout(request, response) {
        try {
            const token = request.headers['x-access-token']
            const decoded = jwt.verify(token, SECRET);
            const id_usuario = decoded.userId
            try {
                await registroTreino.create({id_usuario: id_usuario});
                response.status(200).json("Treino registrado.");
            } catch (error) {
                console.log(error);
                response.status(400).send(error);
            }

        } catch (error) {
            response.status(400).send(error)
        }
    }
    ,
    async deleteAccount(request, response) {
        const token = request.headers['x-access-token']
        const decoded = jwt.verify(token, SECRET);
        const user_id = decoded.userId
        try {
            await registroTreino.destroy({
                where: {
                    id_usuario: user_id
                }
            })
            Usuarios.destroy({
                where: {
                    id: user_id
                }
            })
            
            response.status(200).json('Usuário deletado.')
        } catch (error) {
            console.log(error);
            response.status(400).send(error);
        }

    },
    async showtreino(request, response) {
        try {
            console.log('Acesso autorizado')
            const usuarios = await registroTreino.findAll();
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
