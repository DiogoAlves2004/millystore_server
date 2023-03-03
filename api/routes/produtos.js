const http = require('http');
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
                            request: {
                                tipo: 'GET',
                                descricao: 'Retorna somente o produto selecionado',
                                url: 'http://localhost:3000/produtos/'+prod.id_produto
                            }
                        }
                    })
                }
                res.status(200).send(response);
            }
        )
    })
});




//seleciona um produto especifico no db
router.get(`/:AUTHENTICATION/:id_produto`, (req, res, next)=> {
    const id = req.params.id_produto

    //Autenticação simples
    if(req.params.AUTHENTICATION != process.env.AUTHENTICATION){
        return res.status(401).send({erro: 401, message: 'Sua chave de autenticação esta errada!'})
    }

    mysql.getConnection((error, conn)=>{
        if(error){return res.status(500).send({ error: error })}
        conn.query(
            'SELECT * FROM produtos WHERE id_produto = ?',
            [req.params.id_produto],
            (error, result, field) => {
                conn.release()

                if(error){return res.status(500).send({ error: error })}


                if(result.length == 0){
                    return res.status(404).send({erro: 404 ,mensage: 'Esse produto provavelemente nao existe!'})
                }

                const response = {
                    
                    message: 'Produto selecionado:',
                    produto: {
                        id_produto: result[0].id_produto,
                        nome: result[0].nome,
                        preco: result[0].preco,
                        descricao: result[0].descricao,
                        image1: result[0].image1,
                        request: {
                            tipo: 'GET',
                            descricao: 'Retorna a lista de todos os produtos',
                            url: 'http://localhost:3000/produtos/'
                        }
                    }

                }
                return res.status(200).send(response);

            }
        )
    })

})


//insere um produto no db
router.post(`/:AUTHENTICATION`, (req, res, next)=> {

    //Autenticação simples
    if(req.params.AUTHENTICATION != process.env.AUTHENTICATION){
        return res.status(401).send({erro: 401, message: 'Sua chave de autenticação esta errada!'})
    }

    const nome = req.body.nome
    console.log(nome)

    mysql.getConnection((error, conn)=>{
        if(error){return res.status(500).send({ error: error })}
        conn.query(
            'INSERT INTO produtos (nome, preco, descricao, image1) VALUES (?,?,?,?);',
            [
                req.body.nome,
                req.body.preco,
                req.body.descricao,
                req.body.image1
            ],
            (error, result, field) => {
                conn.release()

                const response = {
                    
                    message: 'Produto inserido com sucesso:',
                    produto: {
                        id_produto: result.id_produto,
                        nome: req.body.nome,
                        preco: req.body.preco,
                        descricao: req.body.descricao,
                        image1: req.body.image1,
                        request: {
                            tipo: 'GET',
                            descricao: 'Retorna a lista de todos os produtos',
                            url: 'http://localhost:3000/produtos/'
                        }
                    }
                }
                if(error){return res.status(500).send({ error: error })}
                return res.status(201).send({response});
            }
        )
    })
})


//atualiza um protudo no db
router.patch(`/:AUTHENTICATION`,(req, res, next)=> {

        //Autenticação simples
        if(req.params.AUTHENTICATION != process.env.AUTHENTICATION){
            return res.status(401).send({erro: 401, message: 'Sua chave de autenticação esta errada!'})
        }

    mysql.getConnection((error, conn)=>{
        if(error){return res.status(500).send({ error: error })}
        conn.query(
            `UPDATE produtos
                SET nome        = ?,
                    preco       = ?,
                    descricao   = ?,
                    image1      = ? 
            WHERE id_produto    = ?;`
            ,
            [
                req.body.nome,
                req.body.preco,                
                req.body.descricao,
                req.body.image1,
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
router.delete(`/:AUTHENTICATION/:id_produto`,(req, res, next)=> {

    //Autenticação simples
    if(req.params.AUTHENTICATION != process.env.AUTHENTICATION){
        return res.status(401).send({erro: 401, message: 'Sua chave de autenticação esta errada!'})
    }

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