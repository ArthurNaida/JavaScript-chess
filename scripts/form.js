let time = new Date
const id = time.getMinutes().toString() + time.getSeconds().toString() + time.getMilliseconds().toString()
const button = initPlayerForm.querySelector("input[type=submit]")

function addURLParam(id) {
    if (history.pushState) {
        const loc = window.location
        const searchParams = new URLSearchParams(loc.search)
        const newURL = "http://localhost:3000/?" + searchParams.toString()
        searchParams.set("id", id)
        history.pushState(null, "", newURL)
        return new URL("http://localhost:3000/?" + searchParams.toString())
    }
}

initPlayerForm.querySelector("form").action = addURLParam(id)

button.addEventListener("click", () => {
    let radioColors = initPlayerForm.querySelectorAll("input[type=radio]")
    radioColors.forEach(radio => {
        if (radio.checked) {
            axios.post("http://localhost:2000/post-players", {
                id: id,
                color: radio.value
            })
            initPlayerForm.style.display = "none"
        }
    })
})