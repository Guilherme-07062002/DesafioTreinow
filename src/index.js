const express = require("express")

const app = express()
const sequelize = require('./config/database')
const usuarioRoutes = require("./routes/usuario_routes");

sequelize.sync().then(() => console.log("Banco de dados conectado com sucesso."));

app.use(express.json())

app.use("/api/usuarios", usuarioRoutes)

app.listen(3000, () => {
    console.log("Servidor funcionando na porta 3000.")
})