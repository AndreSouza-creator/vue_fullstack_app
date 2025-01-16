import {db} from "./../../setup/db.js";

export const getUsers = (_ , res) => {
    const query = "SELECT * FROM clientes";

    db.query(query, (err, data) => {
        if(err) return res.json(err);
        return res.status(200).json(data);
    })
}

export const addUser = (req , res) => {
    console.log(req);
    const query = "INSERT INTO clientes (`nome`, `email`) VALUES(?)";

    const values = [
        req.body.nome,
        req.body.email
    ]

    db.query(query, [values], (err) => {
        if(err) return res.json(err);
        return res.status(200).json("Cliente criado com sucessso");
    })
}

export const updateUser = (req, res) => {
    const q =
      "UPDATE clientes SET `nome` = ?, `email` = ? WHERE `id_cliente` = ?";
  
    const values = [
      req.body.nome,
      req.body.email,
    ];
  
    db.query(q, [...values, req.params.id], (err) => {
      if (err) return res.json(err);
  
      return res.status(200).json("Usuário atualizado com sucesso.");
    });
  };

  export const deleteUser = (req, res) => {
    const idCliente = req.params.id;
  
    // - ANDRESOUZA : Exclui os pedidos relacionados ao cliente
    const deletePedidosQuery = "DELETE FROM pedidos WHERE id_cliente = ?";
    
    db.query(deletePedidosQuery, [idCliente], (err, result) => {
      if (err) {
        return res.status(500).json({ message: "Erro ao excluir pedidos.", error: err });
      }
  
      // - ANDRESOUZA : Em seguida o cliente
      const deleteUserQuery = "DELETE FROM clientes WHERE `id_cliente` = ?";
      
      db.query(deleteUserQuery, [idCliente], (err) => {
        if (err) return res.status(500).json({ message: "Erro ao excluir o usuário.", error: err });
  
        return res.status(200).json("Usuário e pedidos deletados com sucesso.");
      });
    });
  };
  
  