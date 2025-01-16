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
  const query =
    "UPDATE produtos SET `nome` = ?, `preco` = ? WHERE `id_produto` = ?";

  const values = [
    req.body.nome,
    req.body.preco,
    req.body.id_produto // O ID deve vir do corpo da requisição
  ];

  db.query(query, values, (err) => {
    if (err) return res.json(err);

    return res.status(200).json("Produto atualizado com sucesso.");
  });
};


export const deleteProduct = (req, res) => {
      
  const query = "DELETE FROM produtos WHERE `id_produto` = ?";
  
  db.query(query, [req.params.id], (err, result) => { 
    if (err) {
      return res.status(500).json(err);     }
    if (result.affectedRows === 0) {
      return res.status(404).json("Produto não encontrado.");
    }
    return res.status(200).json("Produto deletado com sucesso.");
  });
};
