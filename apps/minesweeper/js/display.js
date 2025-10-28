/**
 * Displays the game grid
 * Should be called on every change in the grid
 */
function displayGrid() {
    let table = document.getElementById('grid')

    // clear the table
    if (table.hasChildNodes) {
        table.innerHTML = ""
    }

    for (let i = 0; i < difficulty.rows; i++) {
        let t_row = document.createElement('tr')
        for (let j = 0; j < difficulty.cols; j++) {
            let t_data = document.createElement('td')
            let button = document.createElement('button')

            button.classList.add("field_button")
            if (playing) {
                // Use addEventListener instead of inline onclick
                button.addEventListener('click', () => clickButton(i, j));
                button.addEventListener('contextmenu', (e) => {
                    e.preventDefault();
                    flagButton(i, j);
                    return false;
                });
                button.addEventListener('mousedown', () => smiley("img/wow.png"));
                button.addEventListener('mouseup', () => smiley("img/ok.png"));
            }

            if (grid[i][j].isFlagged) {
                button.classList.add("field_button_flagged")
            }

            if (grid[i][j].isClicked) {
                if (grid[i][j].isMine) {
                    button.classList.add("field_button")
                    button.classList.add("field_button_mine")
                    if (grid[i][j].isExplodedMine) {
                        button.setAttribute("style", "background-color: red")
                    }
                }
                else if (grid[i][j].numNeighborMines == 0) {
                    button.classList.remove("field_button")
                    button.classList.add("field_button_empty")

                }
                if (grid[i][j].numNeighborMines > 0) {
                    button.classList.remove("field_button")
                    // add picture to button
                    let img = document.createElement('img')
                    img.src = "img/num_of_neighbors/open" + grid[i][j].numNeighborMines + ".png"
                    button.classList.add("field_button_img")
                    button.appendChild(img)
                }
            }

            t_data.appendChild(button)
            t_row.appendChild(t_data)
        }
        table.appendChild(t_row)
    }
}

/**
 * Hides or shows the game window
 */
function closeWindow() {
    resetGame()
    let window = document.getElementById("game_window")
    window.classList.toggle("hidden")
    difficulty = difficulty_presets.easy

    if (window.classList.contains("hidden")) {
        document.getElementById("start").src = "img/taskbar_left_inactive.png"
    } else {
        document.getElementById("start").src = "img/taskbar_left_active.png"
        startGame()
    }
}

/**
 * Change the picture of similey face
 * @param {string} img Path to image
 */
function smiley(img) {
    document.getElementById("smiley").src = img
}

/**
 * Updates the time in the bottom right corner
 * Called once on page load
 */
function displayTime() {
    const date = new Date()
    let h = ("0" + date.getHours()).slice(-2)
    let m = ("0" + date.getMinutes()).slice(-2)
    time = (h + ":" + m)
    document.getElementById("clock").innerHTML = time
    setTimeout(displayTime, 2000)
}

/**
 * Opens a dropdown for selecting difficulty
 */
function enableDropdown() {
    let dropdown = document.getElementById("difficulty_dropdown")
    dropdown.classList.toggle("show")
    
    // Update checkmarks when opening
    if (dropdown.classList.contains("show")) {
        let buttons = dropdown.querySelectorAll("button")
        console.log("[MINESWEEPER] Current difficulty:", difficulty.name);
        buttons.forEach(btn => {
            const diffName = btn.dataset.difficulty;
            const currentDiff = difficulty.name.toLowerCase();
            console.log(`[MINESWEEPER] Comparing: ${diffName} === ${currentDiff}`);
            
            if (diffName === currentDiff) {
                console.log("[MINESWEEPER] Adding checkmark to:", btn.textContent);
                btn.classList.add("checkmark")
            } else {
                btn.classList.remove("checkmark")
            }
        });
    }
}

/**
 * Close the dropdown if the user clicks outside of it
 * Source: https://www.w3schools.com/howto/howto_js_dropdown.asp
 */
window.onclick = function (event) {
    if (!event.target.matches('#difficulty_button')) {
        let dropdowns = document.getElementsByClassName("dropdown-content")
        for (let i = 0; i < dropdowns.length; i++) {
            let openDropdown = dropdowns[i]
            if (openDropdown.classList.contains('show')) {
                openDropdown.classList.remove('show')
            }
        }
    }
}

/**
 * Removed window.onresize check - not needed inside iframe
 * The parent window handles sizing
 */

/**
 * Pauses the game and hides the game window
 * Called when the user clicks the minimize button or taskbar icon
 */
function toggleWindowVisibility() {
    let window = document.getElementById("game_window")
    window.classList.toggle("hidden")
    if (window.classList.contains("hidden")) {
        document.getElementById("start").src = "img/taskbar_left_inactive.png"
        running = false
    } else {
        document.getElementById("start").src = "img/taskbar_left_active.png"
        if (playing && !firstClick) { // resumes the game if it was running before
            running = true
        } else if (playing && firstClick) { // ensures the window is correctly displayed after it is reopened
            resetGame()
        }
    }
}