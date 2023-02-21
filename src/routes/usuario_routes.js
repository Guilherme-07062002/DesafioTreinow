const express = require("express");
const usuariosController = require("../controllers/usuariosController");

const router = express.Router();

router.route("/").get(usuariosController.all).post(usuariosController.create)
// router.route("/:id").get(usuariosController.one).put(usuariosController.update).delete(usuariosController.delete)

module.exports = router;