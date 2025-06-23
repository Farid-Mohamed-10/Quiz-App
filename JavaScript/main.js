// Select Elements
let countSpan = document.querySelector(".quiz-info .count span");
let mainBulletsContainer = document.querySelector(".bullets .spans");
let quizArea = document.querySelector(".quiz-app .quiz-area");
let answerArea = document.querySelector(".answers-area");
let submitBtn = document.querySelector(".submit-button");
let bullets = document.querySelector(".bullets");
let resultsContainer = document.querySelector(".results");
let countdownElement = document.querySelector(".countdown");


// Set Options
let currentIndex = 0;
let rightAnswers = 0;
let countdownInterval;


function getQuestions() {
  let myRequest = new XMLHttpRequest();
  myRequest.onreadystatechange = function () {
    if (this.status === 200 && this.readyState === 4) {
      let questionsObjectInJs = JSON.parse(this.responseText);
      console.log(questionsObjectInJs);
      let questionsCount = questionsObjectInJs.length;

      // Create Bullets + Set Questions Count
      createBullets(questionsCount);

      // Add Questions Data
      addQuestionData(questionsObjectInJs[currentIndex], questionsCount);

      // Start Countdown
      countdown(60, questionsCount);

      // Click On Submit 
      submitBtn.onclick = function () {
        // Get Right Answer
        let theRightAnswer = questionsObjectInJs[currentIndex].right_answer;
        
        // Increase Index
        currentIndex++;

        // Check The Answer
        checkAnswer(theRightAnswer, questionsCount);

        // Remove Previous Question
        quizArea.innerHTML = "";
        answerArea.innerHTML = "";

        // Add Questions Data
        addQuestionData(questionsObjectInJs[currentIndex], questionsCount);

        // Handle Bullets Class
        handleBullets();

        // Start Countdown
        clearInterval(countdownInterval);
        countdown(60, questionsCount);

        // Show Results 
        showResults(questionsCount);
      };
    }
  };
  myRequest.open("GET", "html_questions.json", true);
  myRequest.send();
}

getQuestions();

function createBullets(num) {
  countSpan.innerHTML = num;

  // Create Spans 
  for (let i = 0; i < num; i++) {
    // Create The Bullet Span
    let theBullet = document.createElement('span');
    
    // Check If It Is The First Bullet Span 
    if (i === 0) {
      theBullet.className = "on";
    }

    // Append Bullets To Main Bullets Container
    mainBulletsContainer.appendChild(theBullet);
  }
}

function addQuestionData(obj, count) {
  if (currentIndex < count) {
    // Create H2 Question Title
    let questionTitle = document.createElement("h2");

    // Create Question Text
    let questionText = document.createTextNode(obj.title);

    // Append Text To H2
    questionTitle.appendChild(questionText);

    // Append The Question To Quiz Area
    quizArea.appendChild(questionTitle);

    // Create The Answers
    for (let i = 1; i <= 4; i++) {
      // Create The Main Answer Div
      let answerDiv = document.createElement("div");

      // Add Class To The Main Answer Div 
      answerDiv.className = 'answer';

      // Create The Radio Input
      let radioInput = document.createElement('input');

      // Add Type + Name + Id + Data Attribute
      radioInput.name = 'question';
      radioInput.type = 'radio';
      radioInput.id = `answer_${i}`;
      radioInput.dataset.answer = obj[`answer_${i}`];

      // Make First Option Selected
      if (i === 1) {
        radioInput.checked = true;
      }

      // Create The Label 
      let theLabel = document.createElement("label");

      // Add "for" Attribute 
      theLabel.htmlFor = `answer_${i}`;

      // Create Label Text
      let theLabelText = document.createTextNode(obj[`answer_${i}`]);

      // Add The Text To Label 
      theLabel.appendChild(theLabelText);

      // Add Input + Label To The Main Answer Div
      answerDiv.appendChild(radioInput);
      answerDiv.appendChild(theLabel);

      // Add All Divs To Answers Area
      answerArea.appendChild(answerDiv);
    }
  }
}

function checkAnswer(theRightAnswer, questionsCount) {
  let answers = document.getElementsByName("question");
  let theChoosenAnswer;
  
  for (let i = 0; i < answers.length; i++) {
    if (answers[i].checked) {
      theChoosenAnswer = answers[i].dataset.answer;
    }
  }

  if (theRightAnswer === theChoosenAnswer) {
    rightAnswers++;
    console.log("Good Answer");
  }
}


function handleBullets() {
  let bulletsSpans = document.querySelectorAll(".bullets .spans span");
  let arrayOfSpans = Array.from(bulletsSpans);
  arrayOfSpans.forEach((span, index) => {
    // Add The Class On To The Current Bullet
    if (currentIndex === index) {
      span.className = 'on';
    }

    //  
  });
}


function showResults(questionsCount) {
  let theResults;
  if (currentIndex === questionsCount) {
    quizArea.remove();
    answerArea.remove();
    submitBtn.remove();
    bullets.remove();

    if (rightAnswers > (questionsCount / 2) && rightAnswers < questionsCount) {
      theResults = `<span class="good">Good</Span>, ${rightAnswers} From ${questionsCount}.`;
    } else if (rightAnswers === questionsCount) {
      theResults = `<span class="perfect">Perfect</Span>, All Answers Are Good.`;
    } else {
      theResults = `<span class="bad">Bad</Span>, ${rightAnswers} From ${questionsCount}.`;
    }


    resultsContainer.innerHTML = theResults;
    resultsContainer.style.padding = '10px';
    resultsContainer.style.backgroundColor = 'white';
    resultsContainer.style.marginTop = '10px';
  }
}


function countdown(duration, count) {
  if (currentIndex < count) {
    let minutes, seconds;
    countdownInterval = setInterval(function () {
      minutes = parseInt(duration / 60);
      seconds = parseInt(duration % 60);

      minutes = minutes < 10 ? `0${minutes}` : minutes;
      seconds = seconds < 10 ? `0${seconds}` : seconds;

      countdownElement.innerHTML = `${minutes}:${seconds}`;

      if (--duration < 0) {
        clearInterval(countdownInterval);
        submitBtn.click();
      }

    }, 1000)
  }
}