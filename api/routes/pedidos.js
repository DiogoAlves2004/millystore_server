const express = require('express');
const router = express.Router();




//DATABASE
const mysql = require('../mysql').pool




router.get(`/:AUTHENTICATION`,(req, res, next) => {

    //Autenticação simples
    if(req.params.AUTHENTICATION != process.env.AUTHENTICATION){
        return res.status(401).send({erro: 401, message: 'Sua chave de autenticação esta errada!'})
    }

    mysql.getConnection((error, conn)=>{
        if(error){return res.status(500).send({ error: error })}
        conn.query('SELECT * FROM produtos WHERE id_produto = ?',[req.body.id_produto],)
    })

    mysql.getConnection((error, conn)=>{
        if(error){return res.status(500).send({ error: error })}
        conn.query(
            'SELECT * FROM pedidos',
            (error, result, field) => {
                conn.release()
                if(error){return res.status(500).send({ error: error })}
                const response = {
                    quantidade: result.length,
                    pedidos: result.map(pedido => {
                        return{
                            id_pedido: pedido.id_pedido,
                            id_produto: pedido.id_produto,
                            quantidade: pedido.quantidade,
                            valor: pedido.valor,
                            nome_cliente: pedido.nome_cliente,
                            endereco_entrega: pedido.endereco_entrega,
                            status: pedido.status,
                            request: {
                                tipo: 'GET',
                                descricao: 'retorna o produto inserido no pedido',
                                url: 'http://localhost:3000/produtos/'+pedido.id_produto
                            }
                        }
                    })
                }
                res.status(200).send(response);
            }
        )
    })
});





router.get(`/:AUTHENTICATION/:id_pedido`, (req, res, next)=> {
    const id = req.params.id_pedido

    //Autenticação simples
    if(req.params.AUTHENTICATION != process.env.AUTHENTICATION){
        return res.status(401).send({erro: 401, message: 'Sua chave de autenticação esta errada!'})
    }

    mysql.getConnection((error, conn)=>{
        if(error){return res.status(500).send({ error: error })}
        conn.query(
            'SELECT * FROM pedidos WHERE id_pedido = ?;',
            [req.params.id_pedido],
            (error, result, field) => {
                conn.release()

                if(error){return res.status(500).send({ error: error })}


                if(result.length == 0){
                    return res.status(404).send({erro: 404, mensage: 'Esse pedido nao existe ou ja foi excluido!'})
                }

                const response = {
                    message: 'Produto selecionado:',
                    id_pedido: result[0].id_pedido,
                    id_produto: result[0].id_produto,
                    quantidade: result[0].quantidade,
                    valor: result[0].valor,
                    nome_cliente: result[0].nome_cliente,
                    endereco_entrega: result[0].endereco_entrega,
                    status: result[0].status,
                    request: {
                        tipo: 'GET',
                        descricao: 'retorna todos os produtos',
                        url: 'http://localhost:3000/produtos/'
                    }
                }
                return res.status(200).send(response);
            }
        )
    })
})



//insere um pedido no db
router.post(`/:AUTHENTICATION`, (req, res, next)=> {


    //Autenticação simples
    if(req.params.AUTHENTICATION != process.env.AUTHENTICATION){
        return res.status(401).send({erro: 401, message: 'Sua chave de autenticação esta errada!'})
    }

    mysql.getConnection((error, conn)=>{
        var id_produto = req.body.id_produto
        var quantidade = req.body.quantidade
        if(error){return res.status(500).send({ error: error })}
        conn.query(
            'INSERT INTO pedidos (id_produto, quantidade, nome_cliente, endereco_entrega) VALUES (?,?,?,?);',
            [
                req.body.id_produto,
                req.body.quantidade,
                req.body.nome_cliente,
                req.body.endereco_entrega,
            ],
            (error, result, field) => {
                conn.release()
                if(error){return res.status(500).send({ error: error })}
                const response = {
                    message: 'Pedido inserido com sucesso',
                    pedidoCriado: {
                        id_produto: req.body.id_produto,
                        quantidade: req.body.quantidade,
                        nome_cliente: req.nome_cliente,
                        endereco_entrega: req.body.endereco_entrega,
                        
                        request: {
                            tipo: 'GET',
                            descricao: 'Retorna o produto que esta inserido nesse pedido',
                            url: 'http://localhost:3000/produtos/'+req.body.id_produto
                        }
                    }
                }
                return res.status(200).send({response})
            }
        )
    })
})


//atualiza um produto no db
router.patch(`/:AUTHENTICATION`,(req, res, next)=> {


    //Autenticação simples
    if(req.params.AUTHENTICATION != process.env.AUTHENTICATION){
        return res.status(401).send({erro: 401, message: 'Sua chave de autenticação esta errada!'})
    }

    mysql.getConnection((error, conn)=>{
        if(error){return res.status(500).send({ error: error })}
        conn.query(
            `UPDATE pedidos
                SET id_produto      = ?,
                    quantidade      = ?,
                    nome_cliente    = ?,
                    endereco_entrega =?
            WHERE id_pedido = ?;`
            ,
            [
                req.body.id_produto,
                req.body.quantidade,
                req.body.nome_cliente,
                req.body.endereco_entrega,
                req.body.id_pedido
            ],
            (error, resultado, field) => {
                conn.release()
                if(error){return res.status(500).send({ error: error })}
                const response = {
                    message: 'Pedido Atualizado com sucesso',
                    produtoAtualizado: {
                        id_produto: req.body.id_produto,
                        quantidade: req.body.quantidade,
                        id_pedido: req.body.id_pedido,
                        request: {
                            tipo: 'GET',
                            descricao: 'Retorna o produto do pedido atualizado',
                            url: 'http://localhost:3000/produtos/'+req.body.id_produto
                        }
                    }
                }
                res.status(201).send(response);
            }
        )
    })
})


//deleta um produto no db
router.delete(`/:AUTHENTICATION/:id_pedido`,(req, res, next)=> {

    //Autenticação simples
    if(req.params.AUTHENTICATION != process.env.AUTHENTICATION){
        return res.status(401).send({erro: 401, message: 'Sua chave de autenticação esta errada!'})
    }

    mysql.getConnection((error, conn)=>{
        if(error){return res.status(500).send({ error: error })}
        conn.query(
            'DELETE FROM pedidos WHERE id_pedido = ?'
            ,
            [req.params.id_pedido],
            (error, resultado, field) => {
                conn.release()

                if(error){return res.status(500).send({ error: error })}


                const response = {
                    menssage: 'Pedido removido com sucesso',
                    request: {
                        tipo: 'Get',
                        descricao: 'Retorna todos os pedidos',
                        url: 'http://localhost/peididos'
                    }
                }
                res.status(201).send(response);
            }
        )
    })

})

module.exports = router