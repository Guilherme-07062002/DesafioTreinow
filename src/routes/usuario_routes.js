const express = require("express");
const { verifyJWT, autenticate, logout, storeWorkout, deleteAccount, cadastrarPersonal, cadastrarAluno } = require("../controllers/usuariosController");
const usuariosController = require("../controllers/usuariosController");

const router = express.Router();


// Rota de teste
//router.route("/teste").get(verifyJWT, usuariosController.showtreino)
//router.route('/create').post(usuariosController.create)
// Login
router.route("/auth").get(autenticate)
// Logout
router.route("/logout").get(logout)
// Registro de treino
router.route('/store/workout').post(verifyJWT, storeWorkout)
// Deletar conta de usuário
router.route('/account/delete').get(deleteAccount)
// Cadastrar aluno
router.route('/register/student').post(cadastrarAluno)
// Cadastrar personal trainer
router.route('/register/personal').post(cadastrarPersonal)


// router.route("/:id").get(usuariosController.one).put(usuariosController.update).delete(usuariosController.delete)

module.exports = router;