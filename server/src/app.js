const express = require("express");
const app = express();
const PORT = 8080;

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Importar routers
const apiRouter = require("./routes");
app.use("/api", apiRouter);
const style = ` body {
      font-family: Arial, sans-serif;
      background: #f4f4f4;
      margin: 0;
      padding: 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100vh;
    }

    header {
      text-align: center;
      margin-bottom: 40px;
    }

    h1 {
      color: #333;
      font-size: 2.5rem;
      margin-bottom: 10px;
    }

    p {
      color: #666;
      font-size: 1.1rem;
    }

    .botones {
      display: flex;
      gap: 20px;
    }

    button {
      padding: 12px 30px;
      font-size: 1rem;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      transition: 0.3s;
    }

    .btn-deportivos {
      background-color: #e63946;
      color: white;
    }

    .btn-deportivos:hover {
      background-color: #d62828;
    }

    .btn-suv {
      background-color: #457b9d;
      color: white;
    }

    .btn-suv:hover {
      background-color: #1d3557;
    }`;
const html = `
    <!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Concesionaria El bermelho</title>
  <style>${style}</style>
  </head>
<body>
  <header>
    <h1>Concesionaria El bermelho</h1>
    <p>Elegí tu próximo auto</p>
  </header>
  <div class="botones">
    <a class="btn-deportivos"href="/api/deportivos">Deportivos de alta gama</a>
    <a class="btn-suv" href="/api/suv">Suvs y familiares</a>
  </div>
</body>
</html>`;

app.get("/", (req, res) => {
  try{
  res.status(200).send(html)
}catch (error) {
    res.status(500).json({ error: "Error al cargar la pagina" });
  }
});
const db_deportivos = [
  { id: 1, marca: "Ferrari", modelo: "488 Spider", año: 2020, precio: 250000 },
  { id: 2, marca: "Lamborghini", modelo: "Huracan EVO", año: 2021, precio: 300000 },
  { id: 3, marca: "Porsche", modelo: "911 Turbo S", año: 2019, precio: 150000 }
];

const db_suv = [
  { id: 1, marca: "Range Rover", modelo: "Velar", año: 2020, precio: 90000 },
  { id: 2, marca: "Jeep", modelo: "Grand Cherokee", año: 2021, precio: 75000 },
  { id: 3, marca: "Toyota", modelo: "Land Cruiser", año: 2019, precio: 85000 }
];

app.get("/api/deportivos", (req, res) => {
  try {
    res.status(200).json(db_deportivos);
  } catch (error) {
    res.status(500).json({ error: "Error al cargar la base de datos" });
  }
});

app.get("/api/suv", (req, res) => {
  try {
    res.status(200).json(db_suv);
  } catch (error) {
    res.status(500).json({ error: "Error al cargar la base de datos" });
  }
});

//filtrados por id
app.get("/api/deportivos/:id", (req, res) => {
  try {
    const { id } = req.params;
    const deportivo = db_deportivos.find((d) => d.id === parseInt(id));

    if (deportivo) {
      res.status(200).json(deportivo);
    } else {
      res.status(404).json({ error: "el deportivo no se encontro" });
    }
  } catch (error) {
    res.status(500).json({ error: "Error al obtener el deportivo" });
  }
});

app.get("/api/suv/:id", (req, res) => {
  try {
    const { id } = req.params;
    const suv = db_suv.find((s) => s.id === parseInt(id));
    if (suv) {
      res.status(200).json(suv);
    } else {
      res.status(404).json({ error: "el suv o camioneta familiar no se encontro" });
    }
  } catch (error) {
    res.status(500).json({ error: "Error al obtener el suv" });
  }
});
//ejecucion del servidor
app.listen(PORT, () => {
  console.log(`Example app listening on port http://localhost:${PORT}`);
});
module.exports = app;