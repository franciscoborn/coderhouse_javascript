/*
    Este programa simula un juego llamado Mini Mage donde la persona se enfrenta a distintos enemigos y les gana si la vida del enemigo baja a 0 antes que terminen los turnos.
*/
const URL = "https://projectfirebase-33aa8-default-rtdb.firebaseio.com/"

const getEnemies = async () => {
    try {
        const response = await fetch(URL + "enemies.json")
        const enemies = await response.json()

        const arrayEnemiestest = []
        enemies.forEach(enemy => {
            arrayEnemiestest.push(
                new Character(characterName=enemy.name, health=enemy.health, attack=enemy.attack, defense=enemy.defense, dodge=enemy.dodge, gold=enemy.gold, experience=enemy.experience)
            )
        })
        return arrayEnemiestest
    } catch (error) {
        console.log(error)
    }
}

const getShopItems = async (characterLevel) => {
    try {
        const response = await fetch(URL + "shop.json")
        const shop = await response.json()

        const allowedShopItemsJson = shop.filter((obj) => obj.level_requirement <= characterLevel);
        const allowedShopItems = []
        allowedShopItemsJson.forEach(item => {
            allowedShopItems.push(item)
        })
        return allowedShopItems
    } catch (error) {
        console.log(error)
    }
}

function loadGame() {
    userCurrentString = localStorage.getItem('userCurrent')
        if (userCurrentString) {
            try {
                userCurrentString = JSON.parse(userCurrentString);
                userCurrent = new Character(characterName=userCurrentString.characterName, health=userCurrentString.health, attack=userCurrentString.attack, defense=userCurrentString.defense, dodge=userCurrentString.dodge, gold=userCurrentString.gold, experience=userCurrentString.experience)
                arrayEnemiesString = JSON.parse(localStorage.getItem('arrayEnemies'))
                const arrayEnemies = []
                arrayEnemiesString.forEach(enemy => {
                    arrayEnemies.push(
                        new Character(characterName=enemy.characterName, health=enemy.health, attack=enemy.attack, defense=enemy.defense, dodge=enemy.dodge, gold=enemy.gold, experience=enemy.experience)
                    )
                })
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

function refreshEnemies(arrayEnemies) {
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

function buyItem(user, shopItem) {
    if (user.gold >= shopItem.gold_cost) {
        if (shopItem.type == "Potion") {
            user.health = user.health + shopItem.health_recover
        }
        else if (shopItem.type == "Weapon") {
            user.attack = user.attack + shopItem.attack
        }
        user.gold = user.gold - shopItem.gold_cost
        refreshUserStatus(user)
    }
}

const refreshShopItems = async () => {
    arrayShopItems = await getShopItems(userCurrent.experience)
    containerShopItems.innerHTML = ""
    try {
        for (var i = 0 ; i < arrayShopItems.length; i++) {
            const cardShopItem = document.createElement('div')
            const shopItem = arrayShopItems[i]
            cardShopItem.className = "card-shop-item"
            cardShopItem.id = "id-shop-item-" + shopItem.id
            cardShopItem.innerHTML = `
                <div> ${shopItem.name} </div>
                <button class="btn-buy-item">Buy</button>
                <div> Cost: ${shopItem.gold_cost} </div>
            `
            containerShopItems.appendChild(cardShopItem)
            const btnFight = cardShopItem.querySelector('.btn-buy-item')
            btnFight.addEventListener('click', () => buyItem(userCurrent, shopItem)) 
        }
    }
    catch (error) {
        console.log(error)
    }
}

function refreshUserStatus(userCurrent) {
    h2CurrentUser.innerText = "Current user: " + userCurrent.characterName
    containerUserStatus.innerHTML = `
        <div> <img src="images/icon-health.png" alt="icon-health red heart with a crossing sword with a gray background" class="user-status-icon"> <p> ${userCurrent.health} </p> </div>
        <div> <img src="images/icon-sword.png" alt="icon-sword sword with a gray background" class="user-status-icon"> <p> ${userCurrent.attack} </p></div>
        <div> <img src="images/icon-defense.png" alt="icon-shield shield and a sword with a gray background" class="user-status-icon"> <p> ${userCurrent.defense} </p></div>
        <div> <img src="images/icon-dodge.png" alt="icon-dodge person running and a gray background" class="user-status-icon"> <p> ${userCurrent.dodge} </p></div>
        <div> <img src="images/icon-gold.png" alt="icon-gold pile of gold with a gray background" class="user-status-icon"> <p> ${userCurrent.gold} </p></div>
        <div> <img src="images/icon-experience.png" alt="icon-experience EXP letters with a gray background" class="user-status-icon"> <p> ${userCurrent.experience} </p></div>
    `
}

function loadMainWindow(userCurrent, arrayEnemies) {
    refreshUserStatus(userCurrent)
    refreshEnemies(arrayEnemies)
    refreshShopItems()
}

function fightInit(user, enemy) {
    alert("Fight between " + user.characterName + " and " + enemy.characterName + " has begun!!")
}

const searchEnemy = async () => {
    if (userCurrent.gold >= 3 && arrayEnemies.length < 5) {
        enemies = await getEnemies()
        const enemy = enemies[Math.floor(Math.random() * enemies.length)]
        arrayEnemies.push(new Character(characterName=enemy.characterName, health=enemy.health, attack=enemy.attack, defense=enemy.defense, dodge=enemy.dodge, gold=enemy.gold, experience=enemy.experience))
        userCurrent.gold = userCurrent.gold - 3
        refreshUserStatus(userCurrent)
        refreshEnemies(arrayEnemies)
    } else {
        console.log("Not enough gold.")
    }
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
            user.experience = user.experience + enemy.experience
            alert("Congratulations, you have won the battle!!\nYou got " + droppedGold.toString() + " gold.\n\nYou have " + user.gold.toString() + " gold in your bag.")
            arrayEnemies = arrayEnemies.filter(e => e.id !== enemy.id)
            const cardToRemove = document.getElementById("id-enemy-" + enemy.id);
            if (cardToRemove) {
                cardToRemove.remove();
            }
            refreshShopItems()
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

    constructor(characterName, health, attack, defense, dodge, gold, experience) {
        this.characterName = characterName;
        this.health = health;
        this.attack = attack;
        this.defense = defense;
        this.dodge = dodge;
        this.gold = gold;
        this.experience = experience;
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

const startNewGame = async (playersName) => {
    alert("Nice to meet you " + playersName)
    windowMainGame.removeAttribute("hidden")

    userCurrent = new Character(characterName=playersName, health=100, attack=20, defense=10, dodge=10, gold=0, experience=0);
    arrayEnemies = await getEnemies()
    arrayShopItems = await getShopItems(userCurrent.experience)
    console.log(arrayShopItems)
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

let userCurrent = new Character(characterName="Default", health=100, attack=20, defense=10, dodge=10, gold=0, experience=0);
let arrayEnemies = []
let arrayShopItems = []
// Constants
const btnNewGame = document.getElementById("btn-new-game")
const btnLoadGame = document.getElementById("btn-load-game")
const btnSaveGame = document.getElementById("btn-save-game")
const btnConfirmName = document.getElementById("btn-confirm-name")
const btnSearchEnemy = document.getElementById("btn-search-enemy")
const windowNewGame = document.getElementById("window-new-game")
const windowMainGame = document.getElementById("window-main-game")
const textPlayerName = document.getElementById("text-player-name")
const h2CurrentUser = document.getElementById("h2-current-user")
const containerUserStatus = document.getElementById("container-user-status")
const containerEnemies = document.getElementById("container-enemies")
const containerShopItems = document.getElementById("container-shop-items")

// Events
btnNewGame.addEventListener("click", handleNewGame)
btnConfirmName.addEventListener("click", confirmNewName)
btnSaveGame.addEventListener("click", saveGame)
btnLoadGame.addEventListener("click", loadGame)
btnSearchEnemy.addEventListener("click", searchEnemy)
textPlayerName.addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        confirmNewName()
    }
});

