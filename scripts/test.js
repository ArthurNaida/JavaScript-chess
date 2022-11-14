// import { figures } from "./chess"
import { chessRun } from "./chess.js"
const rows = Array.from(chessDesk.querySelectorAll(".row"))
const cells = new Array
const cellsContent = new Array
let img_src = 'chess_icons/'
let figures = new Array

const players = new Array

rows.forEach(row => {
    cellsContent.push(Array.from(row.querySelectorAll(".cell")))
});

dropBoxBtn.addEventListener("click", () => {
        if (document.querySelector(".drop-box_table").style.display === "none") {
            document.querySelector(".drop-box_table").style.display = "block"
            document.querySelector(".drop-box_table").style.animation = "ani-open 0.5s"
        }
        else {
            document.querySelector(".drop-box_table").style.animation = "ani-close 0.75s"
            setTimeout( () => {
                document.querySelector(".drop-box_table").style.display = "none"
            }, 600)
        }
})

chessRun(players, cells, figures, img_src);
//document.querySelector(".").textContent = chessFigures
