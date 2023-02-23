const express = require("express");
const { verifyJWT, autenticate, logout, storeWorkout, deleteAccount, cadastrarPersonal, cadastrarAluno, matricularAluno, avaliarPersonal, cadastrarTreino, listarTreinos } = require("../controllers/usuariosController");

const router = express.Router();

// Cadastrar aluno
router.route('/register/student').post(cadastrarAluno)
// Cadastrar personal trainer
router.route('/register/personal').post(cadastrarPersonal)

// Login
router.route("/auth").get(autenticate)
// Logout
router.route("/logout").get(logout)

// Os endpoints abaixo são voltados para os usuários do tipo ALUNO
// Registro de treino
router.route('/store/workout').post(verifyJWT, storeWorkout)
// Deletar conta de usuário
router.route('/account/delete').delete(verifyJWT, deleteAccount)
// Permitir que usuário avalie um personal
router.route('/personal/:personal_id/rating').post(verifyJWT, avaliarPersonal)


// Os endpoints abaixo são voltados para os usuários do tipo PERSONAL
// Matricular usuário como aluno de um determinado personal
router.route('/personal/student').post(verifyJWT, matricularAluno)
// Permitir que personal trainer cadastre treinos
router.route('/personal/workout').post(verifyJWT, cadastrarTreino)
// Consultar treinos cadastrados pelos personal 
router.route('/personal/workout').get(verifyJWT, listarTreinos)

module.exports = router;