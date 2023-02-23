const Usuarios = require("../models/usuarios");
const registroTreino = require("../models/registroTreino")
const alunoPersonal = require('../models/alunoPersonal')
const avaliacaoPersonal = require('../models/avaliacaoPersonal')
const cadastroTreino = require("../models/cadastroTreino");

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
                    const token = jwt.sign({ userId: usuarios.id, userTipo: usuarios.tipo }, SECRET, { expiresIn: 300 })
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
                await registroTreino.create({ id_usuario: id_usuario });
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
    async cadastrarAluno(request, response) {
        try {
            await Usuarios.create({
                nome: request.body.nome,
                email: request.body.email,
                documento: request.body.documento,
                tipo: "aluno",
                senha: request.body.senha
            });
            response.status(200).json("Aluno Cadastrado.");
        } catch (error) {
            console.log(error);
            response.status(400).send(error);
        }
    },
    async cadastrarPersonal(request, response) {
        try {
            await Usuarios.create({
                nome: request.body.nome,
                email: request.body.email,
                documento: request.body.documento,
                tipo: "personal",
                senha: request.body.senha
            });
            response.status(200).json("Personal Trainer Cadastrado.");
        } catch (error) {
            console.log(error);
            response.status(400).send(error);
        }
    },
    async matricularAluno(request, response) {
        const token = request.headers['x-access-token']
        const decoded = jwt.verify(token, SECRET);
        const tipo = decoded.userTipo
        const user_id = decoded.userId
        if (tipo == 'personal') {
            const id = request.body.id;
            const aluno = await Usuarios.findOne({ where: { id } });
            console.log(aluno.tipo)
            if (aluno.tipo == "aluno") {
                try {
                    await alunoPersonal.create({
                        id_aluno: request.body.id,
                        id_personal: user_id
                    });
                    response.status(200).json("Usuário matriculado como seu aluno.");
                } catch (error) {
                    console.log(error);
                    response.status(400).send(error);
                }
            } else {
                response.status(400).json("Você não pode cadastrar outro personal trainer como seu aluno.")
            }
        }
        else {
            response.status(400).json("Só um personal trainer pode cadastrar um aluno.")
        }
    },
    async avaliarPersonal(request, response) {
        const token = request.headers['x-access-token']
        const decoded = jwt.verify(token, SECRET);
        const tipo = decoded.userTipo
        if (tipo == 'aluno') {
            const nota_avaliacao = request.body.avaliacao
            if (nota_avaliacao > 1 && nota_avaliacao < 5) {
                const id_personal = request.params.personal_id
                const user_id = decoded.userId
                const quantAvaliacoes = await avaliacaoPersonal.findAll({ where: { id_aluno: user_id, id_personal: id_personal } })
                // O usuário só poderá avaliar o personal uma vez
                if (quantAvaliacoes.length == 0) {
                    const personal = await Usuarios.findOne({ where: { id: id_personal } });
                    // Checando se existe algum registro daquele personal
                    if (personal == null) {
                        response.status(400).json("Personal inválido.")
                    } else {
                        if (personal.tipo == "personal") {
                            const cadastrado = await alunoPersonal.findOne({ where: { id_aluno: user_id, id_personal: id_personal } })
                            // Verificar se o usuário que está avaliando é aluno daquele personal
                            if (cadastrado) {
                                try {
                                    await avaliacaoPersonal.create({
                                        id_aluno: user_id,
                                        id_personal: id_personal,
                                        avaliacao: nota_avaliacao
                                    });
                                    response.status(200).json("Avaliação do personal foi enviada com sucesso.");
                                } catch (error) {
                                    console.log(error);
                                    response.status(400).send(error);
                                }
                            } else {
                                response.status(400).json("Apenas os alunos deste personal podem avaliá-lo.")
                            }

                        } else {
                            response.status(400).json("Você não pode avaliar um aluno.")
                        }
                    }
                } else {
                    response.status(400).json("O usuário não pode avaliar o mesmo personal mais de uma vez")
                }
            } else {
                response.status(400).json('Valor inválido, a nota de avaliação deve ser um número entre 1 a 5.')
            }
        } else {
            response.status(400).json("Somente um aluno pode avaliar um personal.")
        }
    },
    async cadastrarTreino(request, response) {
        const token = request.headers['x-access-token']
        const decoded = jwt.verify(token, SECRET);
        const tipo = decoded.userTipo
        const id = decoded.userId
        if (tipo == 'personal') {
            try {
                await cadastroTreino.create({
                    duracao: request.body.duracao,
                    nome: request.body.nome,
                    id_personal: id
                });
                response.status(200).json("Treino cadastrado com sucesso");
            } catch (error) {
                console.log(error);
                response.status(400).send(error);
            }
        } else {
            response.status(400).json("Somente um personal trainer pode cadastrar um treino.")
        }
    }

    // ,
    // async showtreino(request, response) {
    //     try {
    //         console.log('Acesso autorizado')
    //         const usuarios = await registroTreino.findAll();
    //         response.status(200).json(usuarios);
    //     } catch (error) {
    //         console.log(error);
    //         response.status(400).send(error);
    //     }
    // }
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
