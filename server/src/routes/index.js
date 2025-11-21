const express = require("express");
const router = express.Router();
const productRouter = require("./product.router");
const cartRouter = require("./cart.router");
const clienteRouter = require("./cliente.router");

router.use("/products", productRouter);
router.use("/carts", cartRouter);
router.use("/clientes", clienteRouter);

module.exports = router;
