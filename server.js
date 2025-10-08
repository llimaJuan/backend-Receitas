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
        const resultado = await pool.query('INSERT INTO USUARIO (NOME, SENHA, EMAIL, TELEFONE) VALUES ($1, $2, $3, $4) RETURNING *', [nome, senha, email, telefone])
        reply.status(200).send(resultado.rows[0])
    }catch(e){
        reply.status(500).send({ error: e.message })
    }
})



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

server.listen({
    port: 3000,
    host: "0.0.0.0"
})