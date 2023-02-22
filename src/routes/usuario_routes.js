const express = require("express");
const { verifyJWT, autenticate, logout, storeWorkout } = require("../controllers/usuariosController");
const usuariosController = require("../controllers/usuariosController");

const router = express.Router();


// Rota de teste
router.route("/teste").get(verifyJWT, usuariosController.showtreino)
// Login
router.route("/auth").get(autenticate)
// Logout
router.route("/logout").get(logout)
// Registro de treino
router.route('/store/workout').get(storeWorkout)
// .post(usuariosController.create)
// router.route("/:id").get(usuariosController.one).put(usuariosController.update).delete(usuariosController.delete)

module.exports = router;