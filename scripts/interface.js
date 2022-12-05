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

console.log(window.location)
// button.addEventListener("click", () => {
//     let radioColors = initPlayerForm.querySelectorAll("input[type=radio]")
//     radioColors.forEach(radio => {
//         if (radio.checked) {
//             const id = time.getMinutes().toString() + time.getSeconds().toString() + time.getMilliseconds().toString()
//             axios.post("http://localhost:2000", {
//                 id: id,
//                 color: radio.value
//             })
//             initPlayerForm.style.display = "none"
//         }
//     })
// })