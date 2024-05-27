/*
    Este programa simula un juego llamado Mini Mage donde la persona se enfrenta a distintos enemigos y les gana si la vida del enemigo baja a 0 antes que terminen los turnos.
*/

function loadGame() {
    userCurrentString = localStorage.getItem('userCurrent')
        if (userCurrentString) {
            try {
                userCurrentString = JSON.parse(userCurrentString);
                userCurrent = new Character(characterName=userCurrentString.characterName, health=userCurrentString.health, attack=userCurrentString.attack, defense=userCurrentString.defense, dodge=userCurrentString.dodge, gold=userCurrentString.gold)
                arrayEnemiesString = JSON.parse(localStorage.getItem('arrayEnemies'))
                console.log(arrayEnemiesString)
                const arrayEnemies = []
                arrayEnemiesString.forEach(enemy => {
                    console.log(enemy)
                    arrayEnemies.push(
                        new Character(characterName=enemy.characterName, health=enemy.health, attack=enemy.attack, defense=enemy.defense, dodge=enemy.dodge, gold=enemy.gold)
                    )
                })
                console.log(arrayEnemies)
                alert("Welcome back, " + userCurrent.characterName)
                windowMainGame.removeAttribute("hidden")
                loadMainWindow(userCurrent, arrayEnemies)

            }
            catch (error) {
                console.log(error)
                alert("Could not find a valid saved character")
                continueLastGame = false;
            }
            
        }
        else {
            alert("Could not find a saved character")
            continueLastGame = false;
        }
}

function saveGame() {
    if (userCurrent) {
        console.log("Saving your game")
        localStorage.setItem("userCurrent", JSON.stringify(userCurrent))
        localStorage.setItem("arrayEnemies", JSON.stringify(arrayEnemies))
        if (userCurrent.health == 0) {
            localStorage.removeItem("userCurrent")
            localStorage.removeItem("arrayEnemies")
        }
    }
}

function loadMainWindow(userCurrent, arrayEnemies) {
    h2CurrentUser.innerText = "Current user: " + userCurrent.characterName
    containerUserStatus.innerHTML = `
        <div> Health: ${userCurrent.health} </div>
        <div> Attack: ${userCurrent.attack} </div>
        <div> Defense: ${userCurrent.defense} </div>
        <div> Dodge: ${userCurrent.dodge} </div>
        <div> Gold: ${userCurrent.gold} </div>
    `
    containerEnemies.innerHTML = ""
    try {
        for (var i = 0 ; i < arrayEnemies.length; i++) {
            const cardEnemy = document.createElement('div')
            const enemy = arrayEnemies[i]
            cardEnemy.className = "card-enemy"
            cardEnemy.id = "id-enemy-" + enemy.id
            cardEnemy.innerHTML = `
                <div> ${enemy.characterName} </div>
                <button class="btn-fight">Fight</button>
                <div> Health: ${enemy.health} </div>
            `
            containerEnemies.appendChild(cardEnemy)
            const btnFight = cardEnemy.querySelector('.btn-fight')
            btnFight.addEventListener('click', () => fightBattle(userCurrent, enemy)) 
        }
    }
    catch (error) {
        console.log(error)
    }
}

function fightInit(user, enemy) {
    alert("Fight between " + user.characterName + " and " + enemy.characterName + " has begun!!")
}

function fightDamage(character_1, character_2) {
    let arrayCharactersTurns = [[character_1, character_2], [character_2, character_1]]
    let logFightDamage = ""
    for (let index = 0; index < 2; index++) {
        const attacker = arrayCharactersTurns[index][0]
        const defender = arrayCharactersTurns[index][1]
        let dodged_attack = 100.0 * Math.random() < defender.dodge
        if (dodged_attack) {
            logFightDamage = logFightDamage + (defender.characterName + " avoided the attack from " + attacker.characterName)
        }
        else {
            let damageDone = Math.floor((0.5 + 0.5 * Math.random()) * (attacker.attack - defender.defense))
            if (damageDone < 0) {
                damageDone = 0
            }
            if (damageDone > defender.health) {
                damageDone = defender.health
            }
            defender.health = defender.health - damageDone
            if (defender.health <= 0) {
                defender.health = 0
                logFightDamage = logFightDamage + (attacker.characterName + " does " + damageDone.toString() + " damage to " + defender.characterName)
                logFightDamage = logFightDamage + "\n" + defender.characterName + " was defeated\n"
                break
            }
            logFightDamage = logFightDamage + (attacker.characterName + " does " + damageDone.toString() + " damage to " + defender.characterName)
        }
        logFightDamage = logFightDamage + "\n"
    }
    return logFightDamage
}

function fightBattle(user, enemy) {
    let maxTurns = 20
    let logStatusEnemy, logFightDamage, turnMessage
    while (user.health > 0 && enemy.health > 0 && maxTurns > 0) {
        logFightDamage = fightDamage(user, enemy)
        logStatusUser = user.healthStatus()
        logStatusEnemy = enemy.healthStatus()
        turnMessage = [logFightDamage, logStatusUser, logStatusEnemy].join("\n")
        alert(turnMessage)
        if (user.health == 0) {
            alert("You have lost the game!")
            localStorage.removeItem("userCurrent")
            localStorage.removeItem("arrayEnemies")
        }
        if (enemy.health == 0) {
            let droppedGold = Math.floor(Math.random() * (enemy.gold + 1))
            user.gold = user.gold + droppedGold
            alert("Congratulations, you have won the battle!!\nYou got " + droppedGold.toString() + " gold.\n\nYou have " + user.gold.toString() + " gold in your bag.")
            arrayEnemies = arrayEnemies.filter(e => e.id !== enemy.id)
            const cardToRemove = document.getElementById("id-enemy-" + enemy.id);
            if (cardToRemove) {
                cardToRemove.remove();
            }
        }
        maxTurns --
        if (maxTurns == 0) {
            alert("Could not win the battle in the turn limit")
        }
    }
    alert("Fight ended")
    loadMainWindow(user, arrayEnemies)
}

class Character {
    static currentId = 0;

    constructor(characterName, health, attack, defense, dodge, gold) {
        this.characterName = characterName;
        this.health = health;
        this.attack = attack;
        this.defense = defense;
        this.dodge = dodge;
        this.gold = gold;
        this.id = Character.generateId();
    }

    healthStatus() {
        return this.characterName + " has " + this.health.toString() + " HP"
    }

    static generateId() {
        return Character.currentId++;
    }
}


const handleNewGame = () => {
    windowNewGame.removeAttribute("hidden")
}

const confirmNewName = () => {
    let playersName = textPlayerName.value
    if (playersName.length < 1) {
        alert("Invalid name. Try again")
    }
    else {
        windowNewGame.setAttribute("hidden", "")
        startNewGame(playersName)
    }
}

const startNewGame =(playersName) => {
    alert("Nice to meet you " + playersName)
    windowMainGame.removeAttribute("hidden")

    userCurrent = new Character(characterName=playersName, health=100, attack=20, defense=10, dodge=10, gold=0);
    let enemySlime = new Character(characterName="Slime", health=30, attack=15, defense=5, dodge=50, gold=10)
    let enemyWolf = new Character(characterName="Wolf", health=60, attack=25, defense=10, dodge=30, gold=20)
    let enemyBear = new Character(characterName="Bear", health=100, attack=0, defense=20, dodge=10, gold=30)
    arrayEnemies = [enemySlime, enemyWolf, enemyBear]

    if (playersName.length == 8) {
        console.log("Bonus activated!")
        userCurrent.health = Math.floor(1.1 * userCurrent.health)
        userCurrent.attack = Math.floor(1.1 * userCurrent.attack)
        userCurrent.defense = Math.floor(1.1 * userCurrent.defense)
        userCurrent.dodge = Math.floor(1.1 * userCurrent.dodge)
        userCurrent.gold = 10
    }
    else {
        console.log("You did not get the bonus =(")
    }
    loadMainWindow(userCurrent, arrayEnemies)
}

let userCurrent = new Character(characterName="Default", health=100, attack=20, defense=10, dodge=10, gold=0);
let arrayEnemies = []
// Constants
const btnNewGame = document.getElementById("btn-new-game")
const btnLoadGame = document.getElementById("btn-load-game")
const btnSaveGame = document.getElementById("btn-save-game")
const btnConfirmName = document.getElementById("btn-confirm-name")
const windowNewGame = document.getElementById("window-new-game")
const windowMainGame = document.getElementById("window-main-game")
const textPlayerName = document.getElementById("text-player-name")
const h2CurrentUser = document.getElementById("h2-current-user")
const containerUserStatus = document.getElementById("container-user-status")
const containerEnemies = document.getElementById("container-enemies")

// Events
btnNewGame.addEventListener("click", handleNewGame)
btnConfirmName.addEventListener("click", confirmNewName)
btnSaveGame.addEventListener("click", saveGame)
btnLoadGame.addEventListener("click", loadGame)
textPlayerName.addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        confirmNewName()
    }
});

