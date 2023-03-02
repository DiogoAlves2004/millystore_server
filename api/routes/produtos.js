const express = require('express');
const router = express.Router();




//DATABASE
const mysql = require('../mysql').pool




router.get('/',(req, res, next) => {
    mysql.getConnection((error, conn)=>{
        if(error){return res.status(500).send({ error: error })}
        conn.query(


            'SELECT * FROM produtos',
            (error, result, field) => {
                conn.release()

                if(error){return res.status(500).send({ error: error })}

                const response = {
                    quantidade: result.length,
                    produtos: result.map(prod => {
                        return{
                            id_produto: prod.id_produto,
                            nome: prod.nome,
                            preco: prod.preco,
                            descricao: prod.descricao,
                            image1: prod.image1,
                            image2: prod.image2,
                            image3: prod.image3,
                            request: {
                                tipo: 'GET',
                                descricao: 'retorna todos os produtos',
                                url: 'http://localhost:3000/produtos/'+prod.id_produto
                            }
                        }
                    })
                }


                res.status(501).send(response);

            }
        )
    })

});




//seleciona um produto especifico no db
router.get('/:id_produto', (req, res, next)=> {
    const id = req.params.id_produto

    mysql.getConnection((error, conn)=>{
        if(error){return res.status(500).send({ error: error })}
        conn.query(
            'SELECT * FROM produtos WHERE id_produto = ?',
            [req.params.id_produto],
            (error, result, field) => {
                conn.release()

                if(error){return res.status(500).send({ error: error })}


                if(result.length == 0){
                    return res.status(404).send({mensage: 'Algo esta errado!'})
                }

                const response = {
                    
                    message: 'Produto selecionado:',
                    produto: {
                        id_produto: result[0].id_produto,
                        nome: result[0].nome,
                        preco: result[0].preco,
                        request: {
                            tipo: 'GET',
                            descricao: 'retorna um  produto epecifico',
                            url: 'http://localhost:3000/produtos/'
                        }
                    }

                }
                return res.status(501).send(response);

            }
        )
    })

})



//insere um produto no db
router.post('/', (req, res, next)=> {
    mysql.getConnection((error, conn)=>{
        if(error){return res.status(500).send({ error: error })}
        conn.query(
            'INSERT INTO produtos (nome, preco) VALUES (?,?);',
            [req.body.nome, req.body.preco],
            (error, result, field) => {
                conn.release()

                if(error){return res.status(500).send({ error: error })}

                const response = {
                    
                    message: 'Produto inserido com sucesso',
                    produtoCriado: {
                        id_produto: result.id_produto,
                        nome: req.body.nome,
                        preco: req.body.preco,
                        request: {
                            tipo: 'POST',
                            descricao: 'retorna todos os produtos',
                            url: 'http://localhost:3000/produtos/'
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
            `UPDATE produtos
                SET nome     = ?,
                    preco    = ? 
            WHERE id_produto = ?;`
            ,
            [
                req.body.nome,
                req.body.preco, 
                req.body.id_produto
            ],
            (error, resultado, field) => {
                conn.release()

                if(error){return res.status(500).send({ error: error })}

                
                const response = {
                    message: 'Produto Atualizado com sucesso',
                    produtoAtualizado: {

                        id_produto: req.body.id_produto,
                        nome: req.body.nome,
                        preco: req.body.preco,
                        request: {
                            tipo: 'GET',
                            descricao: 'Atualiza um produto',
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
router.delete('/:id_produto',(req, res, next)=> {

    mysql.getConnection((error, conn)=>{
        if(error){return res.status(500).send({ error: error })}
        conn.query(
            'DELETE FROM produtos WHERE id_produto = ?'
            ,
            [req.params.id_produto],
            (error, resultado, field) => {
                conn.release()

                if(error){return res.status(500).send({ error: error })}


                const response = {
                    menssage: 'Produto removido com sucesso',
                    request: {
                        tipo: 'GET',
                        descricao: 'Retorna todos os produtos',
                        url: 'http://localhost:3000/produtos'
                    }
                }

                res.status(201).send(response);

            }
        )
    })

})




module.exports = router