let dealerSum = 0;
let yourSum = 0;

let timer;
let remainingTime = 60;

let dealerAceCount = 0;
let yourAceCount = 0; 

let hidden;
let deck;

let canHit = true; //allows the player to draw while yourSum <= 21

window.onload = function() {
    buildDeck();
    shuffleDeck();
    startGame();
}

function buildDeck() {
    let values = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
    let types = ["C", "D", "H", "S"];
    deck = [];

    for (let i = 0; i < types.length; i++) {
        for (let j = 0; j < values.length; j++) {
            deck.push(values[j] + "-" + types[i]); //A-C -> K-C, A-D -> K-D
        }
    }
    // console.log(deck);
}

function shuffleDeck() {
    for (let i = 0; i < deck.length; i++) {
        let j = Math.floor(Math.random() * deck.length); 
        let temp = deck[i];
        deck[i] = deck[j];
        deck[j] = temp;
    }
    console.log(deck);
}


function startGame() {
    hidden = deck.pop();
    dealerSum += getValue(hidden);
    dealerAceCount += checkAce(hidden);
    while (dealerSum < 17) {
        //<img src="./cards/4-C.png">
        let cardImg = document.createElement("img");
        let card = deck.pop();
        cardImg.src = "./cards/" + card + ".png";
        dealerSum += getValue(card);
        dealerAceCount += checkAce(card);
        document.getElementById("dealer-cards").append(cardImg);
    }
    console.log(dealerSum);

    for (let i = 0; i < 2; i++) {
        let cardImg = document.createElement("img");
        let card = deck.pop();
        cardImg.src = "./cards/" + card + ".png";
        yourSum += getValue(card);
        yourAceCount += checkAce(card);
        document.getElementById("your-cards").append(cardImg);
    }

    console.log(yourSum);
    document.getElementById("hit").addEventListener("click", hit);
    document.getElementById("stay").addEventListener("click", stay); 
    startTimer();
}


function hit() {

    if(canHit){
        const backgroundSound = new Audio("./assets/hitsound.mp3");
        backgroundSound.play();
        backgroundSound.loop = false; 
    }

    if (!canHit) {
        return;
    }

    let cardImg = document.createElement("img");
    let card = deck.pop();
    cardImg.src = "./cards/" + card + ".png";
    yourSum += getValue(card);
    yourAceCount += checkAce(card);
    document.getElementById("your-cards").append(cardImg);

    if (reduceAce(yourSum, yourAceCount) > 21) { 
        canHit = false;
    }
    if(yourSum>21){
        alert("Looks like you are busted 😔, You can't hit anymore, Please press stay button to continue.");
    }

}

function stay() {
    dealerSum = reduceAce(dealerSum, dealerAceCount);
    yourSum = reduceAce(yourSum, yourAceCount);

    canHit = false;
    document.getElementById("hidden").src = "./cards/" + hidden + ".png";

    let message = "";
    if (yourSum > 21) {
       message = "Better luck next time😔";
       localStorage.setItem("message", message);
       endGame();
     
    }
    else if (dealerSum > 21) {
        message = "Hooray! You beat the dealer🎉";
        localStorage.setItem("message", message);
        endGame();
    }
    else if (yourSum == dealerSum) {
        message = "It's a Tie!";
        localStorage.setItem("message", message);
        endGame();
    }
    else if (yourSum > dealerSum) {
        message = "Hooray! You beat the dealer🎉";
        localStorage.setItem("message", message);
        endGame();
    }
    else if (yourSum < dealerSum) {
        message = "Better luck next time😔";
        localStorage.setItem("message", message);
        endGame();
    }

    document.getElementById("dealer-sum").innerText = dealerSum;
    localStorage.setItem("dealersum", dealerSum);
    document.getElementById("your-sum").innerText = yourSum;
    localStorage.setItem("yoursum", yourSum);

    clearInterval(timer);
    endGame();
}

function getValue(card) {
    let data = card.split("-"); // "4-C" -> ["4", "C"]
    let value = data[0];

    if (isNaN(value)) { //A J Q K
        if (value == "A") {
            return 11;
        }
        return 10;
    }
    return parseInt(value);
}

function checkAce(card) {
    if (card[0] == "A") {
        return 1;
    }
    return 0;
}

function reduceAce(playerSum, playerAceCount) {
    while (playerSum > 21 && playerAceCount > 0) {
        playerSum -= 10;
        playerAceCount -= 1;
    }
    return playerSum;
}

function startTimer() {
    timer = setInterval(function () {
        remainingTime--;
        
        let message = ""
        if (remainingTime <= 0) {
            message = "Your time is up!";
            localStorage.setItem("message", message);
            location.href = "./endpage.html";

            endGame(); 
        }

        updateTimerDisplay();
    }, 1000); // 1000 milliseconds = 1 second
}

function updateTimerDisplay() {
    document.getElementById("seconds").innerText = remainingTime;
}
 

// function endGame() {
//     clearInterval(timer); // Clear the timer
//     canHit = false;
    
// }

function endGame(){
    setTimeout(function () { 
        clearInterval(timer);
        window.location.href = "./endpage.html";
    }, 3000);
}

