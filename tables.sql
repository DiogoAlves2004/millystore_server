

CREATE TABLE `pedidos` (
    `id_pedido` int NOT NULL AUTO_INCREMENT,
    `id_produto` int NOT NULL,
    `quantidade` int NOT NULL,
    + `valor` float NOT NULL,
    + `nome_cliente` varchar(60) NOT NULL,
    + `endereco_entrega` varchar(500) NOT NULL,
    + `status` int DEFAULT '0',
    PRIMARY KEY (`id_pedido`)
);


CREATE TABLE `produtos` (
    `id_produto` int NOT NULL AUTO_INCREMENT,
    `nome` varchar(45) NOT NULL,
    `preco` float NOT NULL,
    + `descricao` varchar(1000),
    + `image1` varchar(1000) NOT NULL,
    + `image2` varchar(1000),
    + `image3` varchar(1000),
    PRIMARY KEY (`id_produto`)
);