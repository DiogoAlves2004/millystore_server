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
    const erro = new Error('Seja benvindo ao DB_STORE, possivelmente se estiver aqui a sua URL esta errada ou a rota solicitada é inexistente!');
    erro.status = 404;
    next(erro);
})

app.use((error, req, res, next)=>{
    res.status(error.status || 500)
    return res.send({        
        erro: {
        mensagem: error.message
        },
        MEU_CRIADOR: "DB_STORE estruturado e criado por DIOGO ALVES",
        AUTENTICAÇÃO: "Essa API exige autenticação de uma chave unica, *SENHA*, passada como parametro na url! Ao usar lembre-se de substituir *SENHA* por sua chave de autenticação!",
        rotas: {
            produtos:{
                GET:  'http://localhost:3000/produtos/SENHA/',
                GET_ESPECIFICO:  'http://localhost:3000/produtos/SENHA/{id}',
                POST:  {
                    url: 'http://localhost:3000/produtos/SENHA/',
                    body: {
                        param1: 'nome',
                        param2: 'preco',
                        param3: 'descricao',
                        param4: 'image1'
                    }
                },
                PATCH: {
                    url: 'http://localhost:3000/produtos/SENHA/',
                    body: {
                        param1: 'nome',
                        param2: 'preco',
                        param3: 'descricao',
                        param4: 'image1',
                        param5: 'id_produto'
                    }
                },
                DELETE: 'http://localhost:3000/produtos/SENHA/{id}'
            },
            pedidos:{
                GET:  'http://localhost:3000/pedidosSENHA/',
                GET_ESPECIFICO:  'http://localhost:3000/pedidos/SENHA/{id}',
                POST:  {
                    url: 'http://localhost:3000/pedidos/SENHA/',
                    body: {
                        param1: 'id_produto',
                        param2: 'quantidade',
                        param3: 'nome_cliente',
                        param4: 'endereco_entrega'
                    }
                },
                PATCH: {
                    url: 'http://localhost:3000/pedidos/SENHA/',
                    body: {
                        param1: 'id_produto',
                        param2: 'quantidade',
                        param3: 'nome_cliente',
                        param4: 'endereco_entrega',
                        param5: 'id_pedido'
                    }
                },
                DELETE: 'http://localhost:3000/pedidos/SENHA/{id}'
            },
        }
    })
})

app.listen(3000)
