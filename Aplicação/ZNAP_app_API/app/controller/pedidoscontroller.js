import { db } from "../../setup/db.js";

// Buscar todos os pedidos
export const getPedidos = (_, res) => {
  const query = "SELECT * FROM pedidos";

  db.query(query, (err, data) => {
    if (err) {
      console.error("Erro ao buscar pedidos:", err);
      return res.status(500).json("Erro ao buscar pedidos.");
    }
    return res.status(200).json(data);
  });
};

// Adicionar um novo pedido
export const addPedido = (req, res) => {
  const query =
    "INSERT INTO pedidos (id_cliente, data, descricao, nome_cliente) VALUES (?)";

  const values = [
    req.body.id_cliente,
    req.body.data,
    req.body.descricao,
    req.body.nome_cliente,
  ];

  db.query(query, [values], (err) => {
    if (err) {
      console.error("Erro ao criar pedido:", err);
      return res.status(500).json("Erro ao criar pedido.");
    }
    return res.status(200).json("Pedido criado com sucesso.");
  });
};

// Atualizar um pedido existente
export const updatePedido = (req, res) => {
  const query =
    "UPDATE pedidos SET descricao = ?, data = ?, id_cliente = ?, nome_cliente = ? WHERE id_pedido = ?";

  const values = [
    req.body.descricao,
    req.body.data,
    req.body.id_cliente,
    req.body.nome_cliente,
    req.body.id_pedido,
  ];

  db.query(query, values, (err) => {
    if (err) {
      console.error("Erro ao atualizar pedido:", err);
      return res.status(500).json("Erro ao atualizar pedido.");
    }
    return res.status(200).json("Pedido atualizado com sucesso.");
  });
};

// Deletar um pedido e seus itens relacionados
export const deletePedido = (req, res) => {
  const idPedido = req.params.id;

  if (!idPedido) {
    return res.status(400).json("ID do pedido não foi fornecido.");
  }

  // Iniciaremos uma transação para garantir exclusão atômica
  db.beginTransaction((err) => {
    if (err) {
      console.error("Erro ao iniciar transação:", err);
      return res.status(500).json("Erro interno no servidor.");
    }

    // Primeiro, excluímos os itens do pedido relacionados
    const deleteItemsQuery = "DELETE FROM pedidoitens WHERE id_pedido = ?";
    db.query(deleteItemsQuery, [idPedido], (err) => {
      if (err) {
        console.error("Erro ao deletar itens do pedido:", err);
        return db.rollback(() => {
          res.status(500).json("Erro ao deletar itens do pedido.");
        });
      }

      // Em seguida, excluímos o pedido
      const deletePedidoQuery = "DELETE FROM pedidos WHERE id_pedido = ?";
      db.query(deletePedidoQuery, [idPedido], (err, result) => {
        if (err) {
          console.error("Erro ao deletar pedido:", err);
          return db.rollback(() => {
            res.status(500).json("Erro ao deletar pedido.");
          });
        }

        if (result.affectedRows === 0) {
          return db.rollback(() => {
            res.status(404).json("Pedido não encontrado.");
          });
        }

        // Se tudo ocorreu bem, aplicamos a transação
        db.commit((err) => {
          if (err) {
            console.error("Erro ao aplicar transação:", err);
            return db.rollback(() => {
              res.status(500).json("Erro interno ao salvar alterações.");
            });
          }

          res
            .status(200)
            .json("Pedido e itens relacionados excluídos com sucesso.");
        });
      });
    });
  });
};
