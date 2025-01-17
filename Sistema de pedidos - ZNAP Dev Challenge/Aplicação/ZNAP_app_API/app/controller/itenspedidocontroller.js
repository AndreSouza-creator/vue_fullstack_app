import { db } from "../../setup/db.js";

// Obter itens de um pedido específico
export const getItensPedidos = (req, res) => {
  const query = "SELECT * FROM pedidoitens WHERE `id_pedido` = ?";

  // Obtemos o ID do pedido da URL
  const idPedido = req.params.id;

  if (!idPedido) {
    return res.status(400).json("ID do pedido não foi fornecido.");
  }

  db.query(query, [idPedido], (err, data) => {
    if (err) {
      console.error("Erro ao obter itens do pedido:", err);
      return res.status(500).json("Erro interno no servidor.");
    }
    return res.status(200).json(data);
  });
};

// Adicionar um novo item ao pedido
export const addItemPedido = (req, res) => {
  const query =
    "INSERT INTO pedidoitens (`id_pedido`, `id_produto`, `qtde`, `preco`) VALUES (?)";

  const values = [
    req.body.id_pedido, // ID do pedido
    req.body.id_produto, // ID do produto
    req.body.qtde, // Quantidade do item
    req.body.preco, // Preço do item
  ];

  if (!req.body.id_pedido || !req.body.id_produto || !req.body.qtde || !req.body.preco) {
    return res.status(400).json("Todos os campos são obrigatórios.");
  }

  db.query(query, [values], (err) => {
    if (err) {
      console.error("Erro ao adicionar item ao pedido:", err);
      return res.status(500).json("Erro ao adicionar item ao pedido.");
    }

    return res.status(201).json("Item adicionado ao pedido com sucesso.");
  });
};

// Atualizar um item do pedido
export const updatePedidoItem = (req, res) => {
  const query =
    "UPDATE pedidoitens SET `id_produto` = ?, `qtde` = ?, `preco` = ? WHERE `id_pedido_item` = ?";

  const values = [
    req.body.id_produto, // ID do produto
    req.body.qtde, // Quantidade do item
    req.body.preco, // Preço do item
    req.body.id_pedido_item, // ID do item no pedido
  ];

  if (!req.body.id_pedido_item || !req.body.id_produto || !req.body.qtde || !req.body.preco) {
    return res.status(400).json("Todos os campos são obrigatórios.");
  }

  db.query(query, values, (err) => {
    if (err) {
      console.error("Erro ao atualizar o item do pedido:", err);
      return res.status(500).json("Erro ao atualizar o item do pedido.");
    }

    return res.status(200).json("Item do pedido atualizado com sucesso.");
  });
};

// Deletar um item do pedido
export const deletePedidoItem = (req, res) => {
  const query = "DELETE FROM pedidoitens WHERE `id_pedido_item` = ?";

  const idPedidoItem = req.params.id;

  if (!idPedidoItem) {
    return res.status(400).json("ID do item do pedido não foi fornecido.");
  }

  db.query(query, [idPedidoItem], (err, result) => {
    if (err) {
      console.error("Erro ao deletar item do pedido:", err);
      return res.status(500).json("Erro interno no servidor.");
    }

    if (result.affectedRows === 0) {
      return res.status(404).json("Item do pedido não encontrado.");
    }

    return res.status(200).json("Item do pedido deletado com sucesso.");
  });
};
