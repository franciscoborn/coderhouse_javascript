/*
    Este programa simula un juego llamado Mini Mage donde la persona se enfrenta a distintos enemigos y les gana si la vida del enemigo baja a 0 antes que terminen los turnos.
*/

function fightInit(user, enemy) {
    alert("Fight between " + user.name + " and " + enemy.name + " has begun!!")
}

function fightDamage(character_1, character_2) {
    let arrayCharactersTurns = [[character_1, character_2], [character_2, character_1]]
    let logFightDamage = ""
    for (let index = 0; index < 2; index++) {
        const attacker = arrayCharactersTurns[index][0]
        const defender = arrayCharactersTurns[index][1]
        let dodged_attack = 100.0 * Math.random() < defender.dodge
        if (dodged_attack) {
            logFightDamage = logFightDamage + (defender.name + " avoided the attack from " + attacker.name)
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
                logFightDamage = logFightDamage + (attacker.name + " does " + damageDone.toString() + " damage to " + defender.name)
                logFightDamage = logFightDamage + "\n" + defender.name + " was defeated\n"
                break
            }
            logFightDamage = logFightDamage + (attacker.name + " does " + damageDone.toString() + " damage to " + defender.name)
        }
        logFightDamage = logFightDamage + "\n"
    }
    return logFightDamage
}

function healthStatus(character) {
    return character.name + " has " + character.health.toString() + " HP"
}

function fightBattle(user, enemy) {
    let maxTurns = 20
    let logStatusEnemy, logFightDamage, turnMessage
    while (user.health > 0 && enemy.health > 0 && maxTurns > 0) {
        logFightDamage = fightDamage(user, enemy)
        logStatusUser = healthStatus(user)
        logStatusEnemy = healthStatus(enemy)
        turnMessage = [logFightDamage, logStatusUser, logStatusEnemy].join("\n")
        alert(turnMessage)
        if (enemy.health == 0) {
            let droppedGold = Math.floor(Math.random() * (enemy.gold + 1))
            user.gold = user.gold + droppedGold
            alert("Congratulations, you have won the battle!!\nYou got " + droppedGold.toString() + " gold.\n\nYou have " + user.gold.toString() + " gold in your bag.")
        }
        maxTurns --
        if (maxTurns == 0) {
            alert("Could not win the battle in the turn limit")
        }
    }
    alert("Fight ended")
}

function mainMiniMage() {
    for (let i = 0; i < 5; i++){
        console.log("If your name has exactly 8 characters, you get a bonus start =D!")
        userName = prompt("Welcome to Mini Mage!! \nWhat is your name?").trim()
        if (userName.length < 1) {
            alert("Invalid name. Try again")
            return
        }
        else {
            alert("Nice to meet you " + userName)
            break
        }
    }
    
    let userCurrent = {
        "name": userName,
        "health": 100,
        "attack": 20,
        "defense": 10,
        "dodge": 10,
        "gold": 0
    }
    
    if (userName.length == 8) {
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

    let enemyEasy = {
        "name": "Slime",
        "health": 30,
        "attack": 15,
        "defense": 5,
        "dodge": 50,
        "gold": 10
    }
    
    let enemyMedium = {
        "name": "Wolf",
        "health": 60,
        "attack": 20,
        "defense": 10,
        "dodge": 30,
        "gold": 20
    }
    
    let enemyHard = {
        "name": "Bear",
        "health": 100,
        "attack": 10,
        "defense": 20,
        "dodge": 10,
        "gold": 30
    }
    
    let arrayEnemies = [enemyEasy, enemyMedium, enemyHard]
    let enemy
    for (let i = 0; i < arrayEnemies.length; i++) {
        enemy = arrayEnemies[i]
        if (confirm("A wild " + enemy.name + " appeared.\nDo you want to fight?")) {
            fightInit(userCurrent, enemy)
            fightBattle(userCurrent, enemy)
        }       
    }

    alert("The game is over, thank you for playing Mini Mage!")
}

mainMiniMage()