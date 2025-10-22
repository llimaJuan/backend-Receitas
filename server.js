import Fastify from "fastify";
import pkg from 'pg'

const { Pool } = pkg

const pool = new Pool({
    user: 'local',
    host: 'localhost',
    database: 'RECEITAS',
    password: '12345',
    port: '5432'
})

const server = Fastify()

// req são os dados da requisição
server.get('/usuarios', async (req, reply) => {

    try {
        const resultado = await pool.query('SELECT * FROM USUARIO')
        reply.status(200).send(resultado.rows)
    } catch(e){
        reply.status(500).send({ error: e.message })
    }
})


server.post('/usuarios', async (req, reply) => {
    const { nome, senha, email, telefone } = req.body

    try {
        const resultado = await pool.query(
            'INSERT INTO USUARIO (NOME, SENHA, EMAIL, TELEFONE) VALUES ($1, $2, $3, $4) RETURNING *',
            [nome, senha, email, telefone]
        )
        reply.status(200).send(resultado.rows[0])
    } catch(e) {
        reply.status(500).send({ error: e.message })
    }
})

// deletar

server.delete('/usuarios/:id', async (req, reply) => {
    const id = req.params.id

    try {
        await pool.query('DELETE FROM USUARIO WHERE id=$1', [id])
        reply.send({ message: 'Usuário deletado' })
    } catch(e) {
        reply.send({ error: e.message })
    }
})

// editar

server.put('/usuarios/:id', async (req, reply) => {
    const { nome, senha, email, telefone, ativo} = req.body
    const id = req.params.id

    try {
        const resultado = await pool.query(
            'UPDATE USUARIO SET nome=$1, senha=$2, email=$3, telefone=$4, ativo=$6 WHERE id=$5 RETURNING *',
            [nome, senha, email, telefone, id, ativo]
        )
        reply.status(200).send(resultado.rows[0])
    } catch(e) {
        reply.status(500).send({ error: e.message })
    }
})

// categorias

server.get('/categorias', async (req, reply) => {
    try {
        const resultado = await pool.query('SELECT * FROM CATEGORIA')
        reply.status(200).send(resultado.rows)
    }catch(e){
        reply.status(500).send({ error: e.message })
    }
})


server.post('/categorias', async (req, reply) => {
    const { nome } = req.body
    try {
        const resultado = await pool.query('INSERT INTO CATEGORIA (NOME) VALUES ($1) RETURNING *', [nome])
        reply.status(200).send(resultado.rows[0])
    }catch(e){
        reply.status(500).send({ error: e.message })
    }
})

// deletar

server.delete('/categorias/:id', async (req, reply) => {
    const id = req.params.id

    try {
        await pool.query('DELETE FROM CATEGORIA WHERE id=$1', [id])
        reply.send({ message: 'Categoria deletada '})
    } catch(e) {
        reply.send({ error: e.message })
    }
})

// editar

server.put('/categorias/:id', async (req, reply) => {
    const { nome } = req.body
    const id = req.params.id

    try {
        const resultado = await pool.query(
            'UPDATE CATEGORIA SET nome=$1 WHERE id=$2 RETURNING *',
            [nome, id]
        )
        reply.status(200).send(resultado.rows[0])
    } catch(e) {
        reply.status(500).send({ error: e.message })
    }
})

server.get('/receitas', async (req, reply) => {
    // vai passar alguma página com um número de requisitos ex: 1pg 10ele
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const allowedOrder = ['id', 'nome']
    const sort = allowedOrder.includes(req.query.sort) ? req.query.sort : 'id'
    const order = req.query.order === 'desc' ? "DESC" : "ASC"

    try {
        const resultado = await pool.query(`SELECT * FROM RECEITA ORDER BY ${sort} ${order} LIMIT ${limit} OFFSET ${offset}`)
        reply.send(resultado.rows)
    } catch(e) {
        reply.status(500).send({ error: e.message })
    }
})


server.post('/receitas', async (req, reply) => {
    const { nome, modo_preparo, ingredientes, usuario_id, categoria_id, porcoes, tempo_preparo_minutos } = req.body

    try {
        const resultado = await pool.query(
            'INSERT INTO RECEITA (NOME, MODO_PREPARO, INGREDIENTES, USUARIO_ID, CATEGORIA_ID, PORCOES, TEMPO_PREPARO_MINUTOS) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
            [nome, modo_preparo, ingredientes, usuario_id, categoria_id, porcoes, tempo_preparo_minutos]
        )
        reply.status(200).send(resultado.rows[0])
    } catch(e) {
        reply.status(500).send({ error: e.message })
    }
})

server.listen({
    port: 3000,
    host: "0.0.0.0"
})