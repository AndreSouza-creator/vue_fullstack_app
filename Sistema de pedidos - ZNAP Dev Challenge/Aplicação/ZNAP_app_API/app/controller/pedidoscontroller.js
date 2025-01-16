import {db} from "../../setup/db.js";

export const getPedidos = (_ , res) => {
    const query = "SELECT * FROM pedidos";

    db.query(query, (err, data) => {
        if(err) return res.json(err);
        return res.status(200).json(data);
    })
}

export const addPedido = (req , res) => {
    const query = "INSERT INTO pedidos (`nome`, `preco`) VALUES(?)";

    const values = [
        req.body.nome,
        req.body.preco
    ]

    db.query(query, [values], (err) => {
        if(err) return res.json(err);
        return res.status(200).json("Produto criado com sucessso");
    })
}

export const updatePedido = (req, res) => {
    const q =
      "UPDATE pedidos SET `nome` = ?, `email` = ? WHERE `id_cliente` = ?";
  
    const values = [
      req.body.nome,
      req.body.preco,
    ];

    db.query(q, [...values, req.params.id], (err) => {
      if (err) return res.json(err);
  
      return res.status(200).json("Produto atualizado com sucesso.");
    });
  };

  export const deletePedido = (req, res) => {
    const q = "DELETE FROM produtos WHERE `id` = ?";
  
    db.query(q, [req.params.id], (err) => {
      if (err) return res.json(err);
  
      return res.status(200).json("Produto deletado com sucesso.");
    });
  };