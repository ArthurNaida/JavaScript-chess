const http = require('http');
const cors = require('cors');
const express = require('express');
const querystring = require('querystring')
const events = require('events');
const { removeAllListeners } = require('process');
const emitter = new events.EventEmitter

const app = express();

app.use(cors());
app.use(express.json())

// app.use('/', (req, res) => {

// })

app.get('/get-state', (req, res) => {
    console.log('get')
        emitter.once('newState', (state) => {
            console.log('emitter work')
            res.json(state);
        })
})

app.post('/post-state', (req, res) => {
    const state = req.body;
    emitter.emit('newState', state);
    res.status(200);
})

const users = new Array

app.get('/get-players', (req, res) => {
        res.json(users)
        console.log(users)
})

app.post('/post-players', (req, res) => {
    users.push(req.body);
    console.log(users)
    emitter.emit('/newPlayer', users);
    res.status(200);
    console.log(req.body)
})

app.listen(2000, () => {console.log('server running')});