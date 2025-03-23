require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { swaggerUi, swaggerDocs } = require("./swagger");

const app = express();
const PORT = process.env.PORT || 3000;

// Habilitando CORS
const corsOptions = {
  origin: "*",  // Permite qualquer origem. Caso queira restringir, substitua "*" pelo domínio desejado (por exemplo, "https://apivai-1.onrender.com").
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.use(express.json());

// Rota da documentação Swagger
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Simulação de um banco de dados em memória
let materiais = [];

// Função para gerar um ID aleatório de até 4 dígitos
function gerarIdAleatorio() {
    return Math.floor(Math.random() * 9000) + 1000; // Gera um número entre 1000 e 9999
}

/**
 * @swagger
 * tags:
 *   name: Materiais
 *   description: API para gerenciar materiais
 */

/**
 * @swagger
 * /api/materiais:
 *   post:
 *     summary: Criar um novo material
 *     tags: [Materiais]
 *     description: Cadastra um novo material no sistema
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nomeProduto:
 *                 type: string
 *               quantidadePorCaixa:
 *                 type: integer
 *               quantidadeUnitaria:
 *                 type: integer
 *               codigoBarras:
 *                 type: string
 *               nomeFornecedor:
 *                 type: string
 *               nomeRecebedor:
 *                 type: string
 *               setorDestino:
 *                 type: string
 *               valorUnitario:
 *                 type: number
 *               valorTotal:
 *                 type: number
 *     responses:
 *       201:
 *         description: Material cadastrado com sucesso
 *       409:
 *         description: Código de barras já cadastrado
 */
app.post("/api/materiais", (req, res) => {
    const { nomeProduto, quantidadePorCaixa, quantidadeUnitaria, codigoBarras, nomeFornecedor, nomeRecebedor, setorDestino, valorUnitario, valorTotal } = req.body;

    if (!nomeProduto || !quantidadePorCaixa || !quantidadeUnitaria || !codigoBarras || !nomeFornecedor || !nomeRecebedor || !setorDestino || !valorUnitario || !valorTotal) {
        return res.status(400).json({ erro: "Todos os campos são obrigatórios." });
    }

    // Normalizar código de barras (remover espaços extras)
    const codigoNormalizado = codigoBarras.trim();

    // Verificar se o código de barras já existe
    const codigoExistente = materiais.some((material) => material.codigoBarras === codigoNormalizado);
    if (codigoExistente) {
        return res.status(409).json({ erro: "Código de barras já cadastrado." });
    }

    // Gerar um ID único
    let id;
    do {
        id = gerarIdAleatorio();
    } while (materiais.some((material) => material.id === id)); // Garante que o ID seja único

    const novoMaterial = { 
        id, // Usa o ID gerado
        nomeProduto, 
        quantidadePorCaixa, 
        quantidadeUnitaria, 
        codigoBarras: codigoNormalizado, 
        nomeFornecedor, 
        nomeRecebedor, 
        setorDestino, 
        valorUnitario, 
        valorTotal 
    };

    materiais.push(novoMaterial);
    res.status(201).json({ sucesso: "Material cadastrado com sucesso!", data: novoMaterial });
});

/**
 * @swagger
 * /api/materiais:
 *   get:
 *     summary: Listar todos os materiais cadastrados
 *     tags: [Materiais]
 *     responses:
 *       200:
 *         description: Lista de materiais cadastrados
 */
app.get("/api/materiais", (req, res) => {
    res.status(200).json({ materiais });
});

/**
 * @swagger
 * /api/materiais/{id}:
 *   put:
 *     summary: Atualizar um material pelo ID
 *     tags: [Materiais]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do material a ser atualizado
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nomeProduto:
 *                 type: string
 *               quantidadePorCaixa:
 *                 type: integer
 *               quantidadeUnitaria:
 *                 type: integer
 *               codigoBarras:
 *                 type: string
 *               nomeFornecedor:
 *                 type: string
 *               nomeRecebedor:
 *                 type: string
 *               setorDestino:
 *                 type: string
 *               valorUnitario:
 *                 type: number
 *               valorTotal:
 *                 type: number
 *     responses:
 *       200:
 *         description: Material atualizado com sucesso
 */
app.put("/api/materiais/:id", (req, res) => {
    const { id } = req.params;
    const { nomeProduto, quantidadePorCaixa, quantidadeUnitaria, codigoBarras, nomeFornecedor, nomeRecebedor, setorDestino, valorUnitario, valorTotal } = req.body;
    const index = materiais.findIndex((item) => item.id == id);

    if (index === -1) {
        return res.status(404).json({ erro: "Material não encontrado." });
    }

    materiais[index] = { id: Number(id), nomeProduto, quantidadePorCaixa, quantidadeUnitaria, codigoBarras, nomeFornecedor, nomeRecebedor, setorDestino, valorUnitario, valorTotal };
    res.status(200).json({ sucesso: "Material atualizado com sucesso!", data: materiais[index] });
});

/**
 * @swagger
 * /api/materiais/{id}:
 *   delete:
 *     summary: Excluir um material pelo ID
 *     tags: [Materiais]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do material a ser excluído
 *     responses:
 *       200:
 *         description: Material excluído com sucesso
 */
app.delete("/api/materiais/:id", (req, res) => {
    const { id } = req.params;
    const index = materiais.findIndex((item) => item.id == id);

    if (index === -1) {
        return res.status(404).json({ erro: "Material não encontrado." });
    }

    materiais = materiais.filter((item) => item.id != id);
    res.status(200).json({ sucesso: "Material excluído com sucesso!" });
});

// Iniciar o servidor
app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
    console.log(`📄 Documentação disponível em http://localhost:${PORT}/api-docs`);
});
