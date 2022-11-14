// const rows = Array.from(chessDesk.querySelectorAll(".row"))
// const cells = new Array
// const cellsContent = new Array
// let img_src = 'chess_icons/'
// let figures = new Array

// const players = new Array

// rows.forEach(row => {
//     cellsContent.push(Array.from(row.querySelectorAll(".cell")))
// });

function isEmpty(obj) {
    for (var i in obj) {
        if (obj.hasOwnProperty(i)) {
            return false
        }
        return true;
    }
}

function getCells(cells) {
    let cellsContent = new Array
    const rows = Array.from(chessDesk.querySelectorAll(".row"))

    rows.forEach(row => {
        cellsContent.push(Array.from(row.querySelectorAll(".cell")))
    });

    for (let i = 0; i < cellsContent.length; i++) {
        for (let j = 0; j < cellsContent[i].length; j++) {
            let cell = {
                x: j + 1,
                y: i + 1,
                color: ((i + j) % 2) === 1 ? 'brown' : 'blue',
                content: cellsContent[i][j],
                isActive: false
            }
            cells.push(cell)
        }
    }
}

function drawCells(cells) {
    cells.map(cell => {
        cell.content.style.backgroundColor = cell.color;
        // // console.log(cell.content.style.backgroundImage)
    })
}

function initPlayers(players) {
    players.push({
        color: 'white',
        isMove: true,
        hasCheck: false,
        checkFigure: new Object,
        hasDraw: false,
        hasFailed: false
    }, {
        color: 'black',
        isMove: false,
        hasCheck: false,
        checkFigure: new Object,
        hasDraw: false,
        hasFailed: false
    })
}

function changePlayerMove (players) {
    let activePlayer = players.find(e => e.isMove === true)
    let inactivePlayer = players.find(e => e.isMove === false)

    activePlayer.isMove = false
    inactivePlayer.isMove = true
    // console.log(activePlayer, inactivePlayer)
}

function initFigures(figures, img_src) {
    function figure(name, color, x, y) { return {
        name: name,
        x:  x,
        y: y,
        color: color,
        img: color === 'black' ? img_src + name + '_b.png' : img_src + name + '_w.png',
        canBePinned: false,
        availableAttacks: new Array,
        availableCells: new Array
    }}

    for (let i = 1; i <= 8; i++) {
        figures.push(figure('pawn', 'black', i, 2), figure('pawn', 'white', i, 7))
    }

    figures.push(figure('king', 'black', 5, 1), figure('king', 'white', 5, 8))
    figures.push(figure('queen', 'black', 4, 1), figure('queen', 'white', 4, 8))
    figures.push(figure('bishop', 'black', 3, 1), figure('bishop', 'white', 3, 8))
    figures.push(figure('bishop', 'black', 6, 1), figure('bishop', 'white', 6, 8))
    figures.push(figure('knight', 'black', 2, 1), figure('knight', 'white', 2, 8))
    figures.push(figure('knight', 'black', 7, 1), figure('knight', 'white', 7, 8))
    figures.push(figure('rook', 'black', 1, 1), figure('rook', 'white', 1, 8))
    figures.push(figure('rook', 'black', 8, 1), figure('rook', 'white', 8, 8))
}

function drawFigure(cells, figure) {
    cells.map(cell => {
        if (figure.x === cell.x && figure.y === cell.y) {
            cell.content.style.backgroundImage = 'url(img)'.replace('img', figure.img)
        }
    })
}

function figureOnCell(cell, figures) {
    for (let figure of figures) {
        if (figure.x === cell.x && figure.y === cell.y) {
            return figure
        }
    }
    return new Object
}

function changeFigure(figures, oldFigure, newFigure) {
    figures.map(figure => {
        if (figure === oldFigure) {
            figure = newFigure
        }
    })
}

function eatFigure(figures, figure) {
    if (Object.keys(figure).length) {
        let index = figures.indexOf(figure)
        figures.splice(index, 1)
        // console.log(figures, index)
    }
}

function drawFigures(cells, figures) {
    cells.map(cell => {
        cell.content.style.backgroundImage = 'none';
    })
    figures.map(figure => {
        drawFigure(cells, figure);
    })
}

function canMove(figure, targetCell) {
    if (figure.availableCells.includes(targetCell)) {
        return true
    }
}

function moveFigure(figures, oldFigure, targetCell) {
    if (canMove(oldFigure, targetCell)) {
        let newFigure = oldFigure
        newFigure.x = targetCell.x
        newFigure.y = targetCell.y
        // console.log('go go')
        // console.log(newFigure)
        changeFigure(figures, oldFigure, newFigure)

        return true
    }
    else {
        return false
    }
}

function isFilledHorizontalAndVetical(players, cells, figures, figure, targetCell) {
    for (let cell of cells) {
        if (((cell.x < targetCell.x && cell.x > figure.x ||
            cell.x < figure.x && cell.x > targetCell.x) && cell.y === figure.y) ||
            ((cell.y < targetCell.y && cell.y > figure.y ||
            cell.y < figure.y && cell.y > targetCell.y) && cell.x === figure.x)) {
                if (Object.keys(figureOnCell(cell, figures)).length && figureOnCell(cell, figures).name === 'king' &&
                players.find(player => player.hasCheck) !== undefined && figureOnCell(cell, figures).color !== figure.color)
                {
                    continue
                }

                if (Object.keys(figureOnCell(cell, figures)).length) {
                    return true
                }
        }
    }
}

function isFilledDiagonal(players, cells, figures, figure, targetCell) {
    for (let cell of cells) {
        if ((cell.x - figure.x === cell.y - figure.y &&
        targetCell.x - figure.x > cell.x - figure.x && targetCell.x - figure.x > 0 &&
        targetCell.x - figure.x === targetCell.y - figure.y && cell.x > figure.x) ||
        (cell.x - figure.x === cell.y - figure.y &&
        targetCell.x - figure.x < cell.x - figure.x && targetCell.x - figure.x < 0 &&
        targetCell.x - figure.x === targetCell.y - figure.y && cell.x < figure.x) ||
        (cell.x - figure.x === figure.y - cell.y &&
        targetCell.x - figure.x > cell.x - figure.x && targetCell.x - figure.x > 0 &&
        targetCell.x - figure.x === figure.y - targetCell.y && cell.x > figure.x) ||
        (cell.x - figure.x === figure.y - cell.y &&
        targetCell.x - figure.x < cell.x - figure.x && targetCell.x - figure.x < 0 &&
        targetCell.x - figure.x === figure.y - targetCell.y && cell.x < figure.x)) {
            if (Object.keys(figureOnCell(cell, figures)).length && (figureOnCell(cell, figures)).name === 'king' &&
            players.find(player => player.hasCheck && player.checkFigure === figure) !== undefined && figureOnCell(cell, figures).color !== figure.color) {
                continue
            }

            if (Object.keys(figureOnCell(cell, figures)).length) {
                return true
            }
        }
    }
}

function isRook(players, cells, figures, figure, targetCell) {
    if (figure.name === 'rook' && !(targetCell.x === figure.x && targetCell.y === figure.y)) {
        if (targetCell.x === figure.x || targetCell.y === figure.y) {
            if (!isFilledHorizontalAndVetical(players, cells, figures, figure, targetCell)) {
                return true
            }
        }
    }
}

function isBishop(players, cells, figures, figure, targetCell) {
    if (figure.name === 'bishop' && !(targetCell.x === figure.x && targetCell.y === figure.y)) {
        if (Math.abs(targetCell.x - figure.x) === Math.abs(targetCell.y - figure.y)) {
            if (!isFilledDiagonal(players, cells, figures, figure, targetCell)) {
                return true
            }
        }
    }
}

function isQueen(players, cells, figures, figure, targetCell) {
    if (figure.name === 'queen' && !(targetCell.x === figure.x && targetCell.y === figure.y)) {
        if ((Math.abs(targetCell.x - figure.x) === Math.abs(targetCell.y - figure.y) &&
        !isFilledDiagonal(players, cells, figures, figure, targetCell)) || 
        ((targetCell.x === figure.x || targetCell.y === figure.y) && !isFilledHorizontalAndVetical(players, cells, figures, figure, targetCell))) {
           return true
        }
    }
}

function isKnight(figure, targetCell) {
    if (figure.name === 'knight') {
        if (Math.abs(targetCell.x - figure.x) + Math.abs(targetCell.y - figure.y) === 3 &&
        targetCell.y !== figure.y && targetCell.x !== figure.x) {
            return true
        }
    }
}

function isKing(cells, figures, figure, targetCell) {
    if (figure.name === 'king' && !(targetCell.x === figure.x && targetCell.y === figure.y)) {

        for (let enemyFigure of figures) {
            if (enemyFigure.color !== figure.color) {
                
                if (enemyFigure.availableAttacks.includes(targetCell)) {
                    return false
                }
            }
        }

        if (Math.abs(figure.x - targetCell.x) <= 1 && Math.abs(figure.y - targetCell.y) <= 1) {
            let enemyKingCell = cells.find(cell => (Object.keys(figureOnCell(cell, figures)).length && figureOnCell(cell, figures).name === 'king' &&
            figureOnCell(cell, figures).color !== figure.color && (Math.abs(cell.x - targetCell.x) <= 1 && Math.abs(cell.y - targetCell.y) <= 1)))
            
            if (enemyKingCell !== undefined) {
                return false
            }
            return true
        }
    }
}

function isPawn(cells, figures, figure, targetCell, len=Object.keys(figureOnCell(targetCell, figures)).length) {
    if (figure.name === 'pawn') {
        if ((figure.y === 2 || figure.y === 7) && targetCell.x === figure.x) {
            if (figure.color === 'white') {
                if (figure.y - targetCell.y === 2 && !len) {
                    if (cells.find(cell => 
                        figure.x === cell.x && 
                        figure.y - cell.y === 1 &&
                        Object.keys(figureOnCell(cell, figures)).length === 0
                    )) {
                        return true
                    }
                }
                else if (figure.y - targetCell.y === 1 && !len) {
                    return true
                }
            }
            else if (figure.color === 'black') {
                if (targetCell.y - figure.y === 2 && !len) {
                    if (cells.find(cell => 
                        figure.x === cell.x && 
                        cell.y - figure.y === 1 &&
                        !len
                    )) {
                        return true
                    }
                }
                else if (targetCell.y - figure.y === 1 && !len) {
                    return true
                }
            }
        }
        else if (targetCell.x === figure.x) {
            if (figure.color === 'white') {
                if (figure.y - targetCell.y === 1 && !len) {
                    return true
                }
            }
            else if (figure.color === 'black') {
                if (targetCell.y - figure.y === 1 && !len) {
                    return true
                }
            }
        }

        if (targetCell.x === figure.x + 1 || targetCell.x === figure.x - 1) {
            if (figure.color === 'black' && targetCell.y === figure.y + 1) {
                if (len) {
                    return true
                }
            }
            else if (figure.color === 'white' && targetCell.y === figure.y - 1) {
                if (len) {
                    return true
                }
            }
        }
    }
}

function getAvailableCells(players, cells, figures, figure) {
    if (figure.availableCells.length) {
        figure.availableCells = new Array
    }

    for (let cell of cells) {
        if (figureOnCell(cell, figures)) {
            if (figure.color === figureOnCell(cell, figures).color) {
                continue 
            }
        }

        switch(true) {
            case isPawn(cells, figures, figure, cell):
                figure.availableCells.push(cell);
                break;
            case isKing(cells, figures, figure, cell):
                figure.availableCells.push(cell);
                break;
            case isQueen(players, cells, figures, figure, cell):
                figure.availableCells.push(cell);
                break;
            case isBishop(players, cells, figures, figure, cell):
                figure.availableCells.push(cell);
                break;
            case isKnight(figure, cell):
                figure.availableCells.push(cell);
                break;
            case isRook(players, cells, figures, figure, cell):
                figure.availableCells.push(cell);
                break;
        }
    }
}

function drawAvailableCells(figure) {
    figure.availableCells.map(cell => {
        cell.content.style.backgroundColor = 'grey'
    })
}

function getAvailableCellsForAll(players, cells, figures) {
    figures.map(figure => {
        getAvailableCells(players, cells, figures, figure)
    })
}

function getAvailableAttacks(players, cells, figures, figure) {
    if (figure.availableAttacks.length) {
        figure.availableAttacks = new Array
    }

    for (let cell of cells) {
        switch(true) {
            case isPawn(cells, figures, figure, cell, 1):
                if (Math.abs(figure.y - cell.y) === 1){
                    figure.availableAttacks.push(cell)
                }
                break;
            case isKing(cells, figures, figure, cell):
                figure.availableAttacks.push(cell);
                break;
            case isQueen(players, cells, figures, figure, cell):
                figure.availableAttacks.push(cell);
                break;
            case isBishop(players, cells, figures, figure, cell):
                figure.availableAttacks.push(cell);;
                break;
            case isKnight(figure, cell):
                figure.availableAttacks.push(cell);
                break;
            case isRook(players, cells, figures, figure, cell):
                figure.availableAttacks.push(cell);
                break;
        }
    }
}

function getAvailableAttacksForAll(players, cells, figures) {
    figures.map(figure => {
        getAvailableAttacks(players, cells, figures, figure)
    })
}

function isCheck(figures, enemy) {
    for (let figure of figures) {
        if (figure.color === enemy.color && figure.name === 'king') {
            for (let playerFigure of figures) {
                if (playerFigure.color !== enemy.color) {
                    for (let cell of playerFigure.availableAttacks) {
                        if (figure === figureOnCell(cell, figures)) {
                            enemy.checkFigure = playerFigure
                            console.log(enemy.checkFigure)
                            return true
                        }
                    }
                }
            }
        }
    }
}


function kingCanBeEaten(players, cells, figures, player, figure, cell) {
    let virtualFigures = figures
    let virtualFigure = figure
    let playerKing = figures.find(e => e.name === 'king' && e.color === player.color) 
    let playerKingCell = cells.find(e => e.x === playerKing.x && e.y === playerKing.y)
    let targetFigure = figureOnCell(cell, figures)

    if (Object.keys(figure).length && figure !== targetFigure) {
        moveFigure(virtualFigures, virtualFigure, cell)
    }

    for (let enemyFigure of virtualFigures) {
        if (enemyFigure.color !== virtualFigure.color) {
            getAvailableAttacks(players, cells, virtualFigures, enemyFigure)
            if (enemyFigure.availableAttacks.includes(playerKingCell) && enemyFigure !== targetFigure) {
                return true
            }
        }
    }
    return false
}

function filterMovesAfterCheck(players, cells, figures, player, enemy, figure) {
    getAvailableCells(players, cells, figures, figure)

    if (figure.color === player.color && enemy.color !== figure.color) {
        const defaultFigurePos = {x: figure.x, y: figure.y}
        if (figure.name !== 'king'){
            figure.availableCells = figure.availableCells.filter(cell => (!kingCanBeEaten(players, cells, figures, player, figure, cell)))
            figure.x = defaultFigurePos.x
            figure.y = defaultFigurePos.y    
        }

        getAvailableAttacks(players, cells, figures, figure)
    }
}

function figurePin(player, enemy, figure) {
    figures.map(figure => {
        filterMovesAfterCheck(player, enemy, figure)
    })
}

function staleMate(figures, player, enemy) {
    let playerFigures = figures.filter(figure => figure.color === player.color)
    let enemyFigures = figures.filter(figure => figure.color === enemy.color)
    console.log(playerFigures.reduce((prev, figure) => {return prev + figure.availableCells.length;}, 0))
    console.log(enemyFigures.reduce((prev, figure) => {return prev + figure.availableCells.length;}, 0))
    
    return (playerFigures.reduce((prev, figure) => {return prev + figure.availableCells.length;}, 0) === 0 ||
    enemyFigures.reduce((prev, figure) => {return prev + figure.availableCells.length;}, 0) === 0)
}

function checkMate(players, cells, figures, player, enemy) {
    if (player.hasCheck) {
        let allMoves = new Array

        for (let figure of figures) {
            if (figure.color === player.color) {
                filterMovesAfterCheck(players, cells, figures, player, enemy, figure)
                allMoves = allMoves.concat(figure.availableCells)
            }
        }

        if (allMoves.length === 0) {
            return true
        }
    }
}

function chessListen(players, cells, figures) {
    document.addEventListener("DOMContentLoaded", () => {
        let active = {
            cell: new Object,
            figure: new Object
        }
        let target = {
            cell: new Object,
            figure: new Object
        }
        let player = new Object
        let enemy = new Object

        cells.map(cell => {
            cell.content.onclick = function() {
                player = players.find( e => e.isMove === true)
                enemy = players.find( e => e.isMove === false)

                if (Object.keys(active.cell).length) {
                    target.cell = cell
                    target.figure = figureOnCell(target.cell, figures)

                    if (Object.keys(active.figure).length) {
                        for (let cell of active.figure.availableCells) {
                            cell.content.style.backgroundColor = cell.color
                        }
                    }

                    active.cell.content.style.backgroundColor = active.cell.color
                    active.cell = {}
                    
                    if (active.figure.color !== target.figure.color && player.color === active.figure.color) {
                        if (canMove(active.figure, target.cell) && active.figure.color !== target.figure.color &&
                        player.color === active.figure.color) {
                            if (Object.keys(active.figure).length && active.figure !== target.figure) {
                                moveFigure(figures, active.figure, target.cell)
                                eatFigure(figures, target.figure)
                            }
                            else {
                                moveFigure(figures, active.figure, target.cell)
                            }

                            getAvailableAttacksForAll(players, cells, figures)

                            if (isCheck(figures, enemy)) {
                                enemy.hasCheck = true
                            }
                            console.log(figures)
                            if (staleMate(figures, enemy, player)) {
                                enemy.hasDraw = true
                                player.hasDraw = true
                            }

                            if (checkMate(players, cells, figures, enemy, player)) {
                                enemy.hasFailed = true
                            }

                            if (player.hasCheck) {
                                player.hasCheck = false
                            }

                            drawFigures(cells, figures)
                            changePlayerMove(players)

                            if (enemy.hasFailed) {
                                document.querySelector('.greeting').textContent = 'Шах и мат!!!'
                            }
                            else if (enemy.hasDraw) {
                                document.querySelector('.greeting').textContent = 'Пат!'
                            }
                            else {
                                document.querySelector('.greeting').textContent = (player.color === 'white' ? "Ход черных" : "Ход белых")
                            }

                            return {'players': players, 'cells': cells, 'figures': figures}
                        }
                    }
                }

                else {
                    
                        cell.content.style.backgroundColor = 'green'
                        active.figure = figureOnCell(cell, figures)
                        active.cell = cell

                        getAvailableCellsForAll(players, cells, figures)
                        getAvailableAttacksForAll(players, cells, figures)

                        if (Object.keys(active.figure).length) {
                            filterMovesAfterCheck(players, cells, figures, player, enemy, active.figure)

                            if (player.color === active.figure.color) {
                                drawAvailableCells(active.figure)
                            }
                        }
                }
            }
        })
    })
}

export function chessRun(players, cells, figures, img_src) {
    initFigures(figures, img_src)
    getCells(cells);
    initPlayers(players);
    drawCells(cells);
    drawFigures(cells, figures);
    console.log(players, figures, cells);
    chessListen(players, cells, figures);
}

//chessRun(players, cells, figures)
