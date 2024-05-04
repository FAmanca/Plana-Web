// Function to load data from localStorage
const loadData = () => {
  const data = localStorage.getItem("planaData");
  return data ? JSON.parse(data) : { pertanyaan: [] };
};

// Function to save data to localStorage
const saveData = (data) => {
  localStorage.setItem("planaData", JSON.stringify(data));
};

// Function to find best match for user question
const findBestMatch = (userQuestion, questions) => {
  const similarityScores = questions.map((question) =>
    similarity(userQuestion.toLowerCase(), question.toLowerCase())
  );
  const maxScore = Math.max(...similarityScores);
  return maxScore > 0.5 ? questions[similarityScores.indexOf(maxScore)] : null;
};

// Function to calculate similarity between two strings (using Jaccard similarity)
const similarity = (s1, s2) => {
  const set1 = new Set(s1.split(" "));
  const set2 = new Set(s2.split(" "));
  const intersection = new Set([...set1].filter((x) => set2.has(x)));
  const union = new Set([...set1, ...set2]);
  return intersection.size / union.size;
};

// Function to add response to the DOM
const addResponseToDOM = (text) => {
  const responses = document.getElementById("responses");
  const responseDiv = document.createElement("div");
  responseDiv.classList.add("response-item"); // Add class for CSS styling

  const botDiv = document.createElement("div");
  botDiv.textContent = "Plana :"; // Text "Plana :"
  botDiv.classList.add("bot-text"); // Add class for CSS styling
  responseDiv.appendChild(botDiv);

  const answerDiv = document.createElement("div");
  answerDiv.classList.add("answer-text"); // Add class for CSS styling
  answerDiv.textContent = text;
  responseDiv.appendChild(answerDiv);

  responses.appendChild(responseDiv);
};

// Function to add user question to the DOM
const addRequestToDOM = (text) => {
  const responses = document.getElementById("responses");
  const responseDiv = document.createElement("div");
  responseDiv.classList.add("response-item"); // Add class for CSS styling

  const userDiv = document.createElement("div");
  userDiv.textContent = "You :"; // Text "You :"
  userDiv.classList.add("user-text"); // Add class for CSS styling
  responseDiv.appendChild(userDiv);

  const questionDiv = document.createElement("div");
  questionDiv.classList.add("question-text"); // Add class for CSS styling
  questionDiv.textContent = text;
  responseDiv.appendChild(questionDiv);

  responses.appendChild(responseDiv);
};

// Function to handle sending message
const sendMessage = () => {
  const userInput = document.getElementById("userInput");
  const userQuestion = userInput.value.trim();
  userInput.value = ""; // Clear the input after sending

  if (userQuestion.toLowerCase() === "exit") {
    addResponseToDOM("Sampai Jumpa Sensei ! ><");
    return;
  }

  // Add user question to the DOM
  addRequestToDOM(userQuestion);

  const mainData = loadData();
  const bestMatch = findBestMatch(
    userQuestion,
    mainData.pertanyaan.map((q) => q.pertanyaan)
  );
  if (bestMatch) {
    const answer = getAnswer(bestMatch, mainData);
    addResponseToDOM(answer);
  } else {
    addResponseToDOM("Aku tidak tahu jawabannya sensei, bisa ajari aku?");
    const newAnswer = prompt(
      'Ketik jawabannya atau "skip" untuk tidak menjawabnya:'
    );
    if (newAnswer.toLowerCase() !== "skip") {
      mainData.pertanyaan.push({
        pertanyaan: userQuestion,
        jawaban: newAnswer,
      });
      saveData(mainData);
      addResponseToDOM("Terimakasih Sensei, aku mempelajari respon baru ! ><");
    }
  }
};

// Function to retrieve answer from the data
const getAnswer = (question, data) => {
  const index = data.pertanyaan.findIndex((q) => q.pertanyaan === question);
  return data.pertanyaan[index].jawaban;
};

// Event listener for send button
document.getElementById("sendButton").addEventListener("click", sendMessage);

// Event listener for input field (Enter key)
document.getElementById("userInput").addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    sendMessage();
  }
});

// Initial welcome message
addResponseToDOM("Halo Sensei, ada yang bisa aku bantu? :)");
