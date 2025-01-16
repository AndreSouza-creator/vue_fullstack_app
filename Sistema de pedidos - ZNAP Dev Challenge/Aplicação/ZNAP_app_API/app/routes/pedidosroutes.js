import express from 'express'
import { getPedidos } from "../controller/pedidoscontroller.js"
import { addPedido } from "../controller/pedidoscontroller.js"
import { updatePedido } from "../controller/pedidoscontroller.js"
import { deletePedido } from "../controller/pedidoscontroller.js"

const pedidosRoutes = express.Router()
pedidosRoutes.get("/getpedidos", getPedidos)
pedidosRoutes.post("/addpedido", addPedido)
pedidosRoutes.post("/editpedido", updatePedido)
pedidosRoutes.post("/editpedido", deletePedido)

export default pedidosRoutes