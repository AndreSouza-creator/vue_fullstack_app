import {db} from "../../setup/db.js";

export const getProdutos = (_ , res) => {
    const query = "SELECT * FROM produtos";

    db.query(query, (err, data) => {
        if(err) return res.json(err);
        return res.status(200).json(data);
    })
}

export const addProduct = (req , res) => {
    const query = "INSERT INTO produtos (`nome`, `preco`) VALUES(?)";

    const values = [
        req.body.nome,
        req.body.preco
    ]

    db.query(query, [values], (err) => {
        if(err) return res.json(err);
        return res.status(200).json("Produto criado com sucessso");
    })
}

export const updateProduct = (req, res) => {
    const q =
      "UPDATE produtos SET `nome` = ?, `email` = ? WHERE `id_cliente` = ?";
  
    const values = [
      req.body.nome,
      req.body.preco,
    ];
  
    db.query(q, [...values, req.params.id], (err) => {
      if (err) return res.json(err);
  
      return res.status(200).json("Produto atualizado com sucesso.");
    });
  };

  export const deleteProduct = (req, res) => {
    const q = "DELETE FROM produtos WHERE `id` = ?";
  
    db.query(q, [req.params.id], (err) => {
      if (err) return res.json(err);
  
      return res.status(200).json("Produto deletado com sucesso.");
    });
  };