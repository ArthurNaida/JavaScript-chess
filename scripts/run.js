// import { figures } from "./chess"
//import {axios} from "https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"
import { chessInit } from "./chess.js"
import { chessState } from "./chess.js"
import { changeChessState } from "./chess.js"
const rows = Array.from(chessDesk.querySelectorAll(".row"))
const cells = new Array
const cellsContent = new Array
let img_src = 'chess_icons/'
let figures = new Array
let players = new Array

rows.forEach(row => {
    cellsContent.push(Array.from(row.querySelectorAll(".cell")))
});

let active = {
    cell: new Object,
    figure: new Object
}
let target = {
    cell: new Object,
    figure: new Object
}

const userId = window.location.search.match(/\d+/).map(v => +v)[0]
console.log(userId)

async function newState(data) {
    players = data.players
    figures = data.figures
    console.log('new state')
    changeChessState(players, cells, figures)
}

async function getRequest(func, page) {
    const {data} = await axios.get('http://localhost:2000/' + page)
    console.log('http://localhost:2000/' + page)
    // console.log(data)
    await func(data)
    return data
}

const subscribePlayer = async (page='') => {
    const data = await getRequest(newPlayer, page)
    console.log(data)
    if (data.length < 2) {
        setTimeout(() => {
            subscribePlayer(page)
        }, 500)
    }
}

const subscribeState = async (page='') => {
    try {
        await getRequest(newState, page)
        await subscribeState(page)
    } catch (e) {
        setTimeout(() => {
            subscribeState(page)
            console.log('err')
        }, 500)
    }
}

function newPlayer(data) {
    if (data.length > 1) {
        data.forEach(user => {
            let player = players.find(pl => (pl.color === user.color))
            if (player.id === '') {
                player.id = user.id
            }
        })
    }
    // else {
    //     if (players.find(pl => (pl.id === ''))  !== undefined){
    //         setTimeout(() => {
    //             subscribe(newPlayer, 'get-players')
    //         }, 500)
    //     }
    // }
}

chessInit(players, cells, figures, img_src)

subscribePlayer('get-players').then(()=> {
    console.log(players[0])
})

subscribeState('get-state').then(() => {
    console.log('failed')
})

addEventListener('DOMContentLoaded', () => {
        cells.map(cell => {
            cell.content.onclick = function() {
                let player = players.find(pl => pl.id == userId)
                // console.log(players)
                // console.log(players[1].id)
                // console.log(userId)
                // console.log(players.find(pl => pl.id == userId))
                if (player.isMove) {
                    let state = chessState(players, cells, figures, target, active, cell)
                    console.log(state)
                    if (state != undefined) {
                        console.log('post')
                        axios.post("http://localhost:2000/post-state", {'players': players, 'figures': figures}).then((res) => {console.log(res)})
                    }
                }
            }
        })
})
