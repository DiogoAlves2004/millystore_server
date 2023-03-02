const express = require('express');
const app = express();
const morgan = require('morgan')
const bodyPaser = require('body-parser')
require('dotenv').config()


const rotaProdutos = require('./routes/produtos')
const rotaPedidos = require('./routes/pedidos')


app.use(morgan('dev'))




//rotas
app.use('/produtos', rotaProdutos)
app.use('/pedidos', rotaPedidos)


app.use((req, res, next) => {
    const erro = new Error('Não encontrado');
    erro.status = 404;
    next(erro);
})

app.use((error, req, res, next)=>{
    res.status(error.status || 500)
    return res.send({
        erro: {
            mensagem: error.message
        }
    })
})

app.listen(4000)
