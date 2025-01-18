import express from 'express'
import { getPedidos } from "../controller/pedidoscontroller.js"
import { addPedido } from "../controller/pedidoscontroller.js"
import { updatePedido } from "../controller/pedidoscontroller.js"
import { deletePedido } from "../controller/pedidoscontroller.js"
import { getItensPedidos } from "../controller/itenspedidocontroller.js"
import { addItemPedido } from "../controller/itenspedidocontroller.js"
import { updatePedidoItem } from "../controller/itenspedidocontroller.js"
import { deletePedidoItem } from "../controller/itenspedidocontroller.js"

const pedidosRoutes = express.Router()
pedidosRoutes.get("/getpedidos", getPedidos)
pedidosRoutes.post("/addpedido", addPedido)
pedidosRoutes.put("/editpedido", updatePedido)
pedidosRoutes.delete("/deletepedido/:id", deletePedido)
pedidosRoutes.get("/getpedidoitens/:id", getItensPedidos)
pedidosRoutes.post("/addpedidoitem", addItemPedido)
pedidosRoutes.put("/editpedidoitem", updatePedidoItem)
pedidosRoutes.delete("/deletepedidoitem/:id", deletePedidoItem)


export default pedidosRoutes