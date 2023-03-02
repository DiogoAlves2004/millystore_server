const express = require('express');
const router = express.Router();




//DATABASE
const mysql = require('../mysql').pool




router.get('/',(req, res, next) => {

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
                            request: {
                                tipo: 'GET',
                                descricao: 'retorna o produto inserido no pedido',
                                url: 'http://localhost:3000/produtos/'+pedido.id_produto
                            }
                        }
                    })
                }

                res.status(501).send(response);

            }
        )
    })

});





router.get('/:id_produto', (req, res, next)=> {
    const id = req.params.id_produto

    mysql.getConnection((error, conn)=>{
        if(error){return res.status(500).send({ error: error })}
        conn.query(
            'SELECT * FROM pedidos WHERE id_pedido = ?',
            [req.params.id_pedido],
            (error, result, field) => {
                conn.release()

                if(error){return res.status(500).send({ error: error })}


                if(result.length == 0){
                    return res.status(404).send({mensage: 'Algo esta errado!'})
                }

                const response = {
                    message: 'Produto selecionado:',
                    id_pedido: pedido.id_pedido,
                    id_produto: pedido.id_produto,
                    quantidade: pedido.quantidade,
                    request: {
                        tipo: 'GET',
                        descricao: 'retorna todos os produtos',
                        url: 'http://localhost:3000/produtos/'
                    }

                }
                return res.status(501).send(response);

            }
        )
    })

})



//insere um pedido no db
router.post('/', (req, res, next)=> {
    mysql.getConnection((error, conn)=>{
        if(error){return res.status(500).send({ error: error })}
        conn.query(
            'INSERT INTO pedidos (id_produto, quantidade) VALUES (?,?);',
            [req.body.id_produto, req.body.quantidade],
            (error, result, field) => {
                conn.release()

                if(error){return res.status(500).send({ error: error })}
                


                const response = {
                    
                    message: 'Pedido inserido com sucesso',
                    pedidoCriado: {
                        id_pedido: req.body.id_pedido,
                        id_produto: req.body.id_produto,
                        quantidade: req.body.quantidade,
                        request: {
                            tipo: 'GET',
                            descricao: 'retorna todos os pedidos',
                            url: 'http://localhost:3000/pedidos/'
                        }
                    }

                }
                return res.status(501).send(response);

            }
        )
    })

})


//atualiza um protudo no db
router.patch('/',(req, res, next)=> {
    mysql.getConnection((error, conn)=>{
        if(error){return res.status(500).send({ error: error })}
        conn.query(
            `UPDATE pedidos
                SET id_produto  = ?,
                    quantidade  = ? 
            WHERE id_pedido = ?;`
            ,
            [
                req.body.id_produto,
                req.body.quantidade, 
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
router.delete('/:id_pedido',(req, res, next)=> {

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