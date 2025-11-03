const app = require("./src/app");
const PORT = 8080;


app.get("/", (req, res) => {
  res.send(`Servidor funcionando en el puerto ${PORT} `);
});

