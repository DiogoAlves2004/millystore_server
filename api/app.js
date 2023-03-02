const express = require('express');
const app = express();
const morgan = require('morgan')
const bodyPaser = require('body-parser')
require('dotenv').config()


const rotaProdutos = require('./routes/produtos')
const rotaPedidos = require('./routes/pedidos')


app.use(morgan('dev'))
app.use(bodyPaser.urlencoded({ extended: false }));
app.use(bodyPaser.json());


//CORS
app.use((req, res, next)=> {
    res.header('Acess-Control-Allow-Origin', '*')
    res.header(
        'Acess-Control-Allow-Header',
        'Content-Type, User-Agent, Origin, X-Requested-With, Accept, Authorization, Host, '
    );

    if(req.method === 'OPTIONS'){
        res.header(
            'Acess-Control-Allow-Methods',
            'PUT, POST, PATCH, DELETE, GET'
        );
        return res.status(200).send({})
    }
    next();
})


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

module.exports = app