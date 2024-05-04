const loadData = () => {
  const data = localStorage.getItem("mainData");
  return data ? JSON.parse(data) : { pertanyaan: [] };
};

const saveData = (data) => {
  localStorage.setItem("mainData", JSON.stringify(data));
};

const findBestMatch = (userQuestion, questions) => {
  const options = {
    includeScore: true, 
    threshold: 0.4,
  };

  const fuse = new Fuse(questions, options);
  const result = fuse.search(userQuestion);
  return result.length ? result[0].item : null;
};

const getAnswer = (question, mainData) => {
  const match = mainData.pertanyaan.find(
    (q) => q.pertanyaan.toLowerCase() === question.toLowerCase()
  );
  return match ? match.jawaban : null;
};

const addResponseToDOM = (text, isUser = false) => {
  const responses = document.getElementById("responses");
  const responseDiv = document.createElement("div");
  responseDiv.classList.add(isUser ? "user-item" : "response-item");

  const nameDiv = document.createElement("div");
  nameDiv.textContent = isUser ? "Anda" : "Plana";
  nameDiv.classList.add("name-text");
  // Menambahkan class khusus berdasarkan pengguna atau Plana
  nameDiv.classList.add(isUser ? "user-name" : "plana-name");
  responseDiv.appendChild(nameDiv);

  const messageDiv = document.createElement("div");
  messageDiv.classList.add("message-text");
  responseDiv.appendChild(messageDiv);

  responses.appendChild(responseDiv);

  // Hapus teks sebelumnya dan mulai efek ketik jika bukan pesan pengguna
  if (!isUser) {
    messageDiv.textContent = ""; // Bersihkan teks sebelumnya
    typeMessage(text, 0, 50, messageDiv);
  } else {
    messageDiv.textContent = text; // Langsung set teks untuk pesan pengguna
  }
};

function typeMessage(message, index, delay, element) {
  if (index < message.length) {
    element.textContent += message.charAt(index);
    index++;
    setTimeout(function () {
      typeMessage(message, index, delay, element);
    }, delay);
  }
}

const sendMessage = () => {
  const userInput = document.getElementById("userInput");
  const userQuestion = userInput.value.trim();

  if (userQuestion === "") {
    alert("Input tidak boleh kosong!");
    return;
  }

  // Tambahkan input pengguna ke DOM
  addResponseToDOM(userQuestion, true);

  userInput.value = ""; // Bersihkan input setelah mengirim

  if (userQuestion.toLowerCase() === "exit") {
    addResponseToDOM("Sampai Jumpa Sensei ! ><");
    return;
  }

  const mainData = loadData();
  const bestMatch = findBestMatch(
    userQuestion,
    mainData.pertanyaan.map((q) => q.pertanyaan)
  );
  if (bestMatch) {
    const answer = getAnswer(bestMatch, mainData);
    addResponseToDOM(answer);
  } else {
    const newAnswer = prompt(
      'Aku tidak tahu jawabannya Sensei (ketikan jawaban atau "skip" untuk skip)'
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

function typeMessage(message, index, delay, element) {
  if (index < message.length) {
    // Add character to the element
    element.textContent += message.charAt(index);
    index++;
    // Call this function again after a certain delay
    setTimeout(function () {
      typeMessage(message, index, delay, element);
    }, delay);
  }
}

document.getElementById("responses").addEventListener("wheel", function (event) {
    this.scrollTop += event.deltaY;
  });

function togglebubble(){
  $(".response-item").toggleClass("toggleBubble");
  $(".user-item").toggleClass("toggleBubble");
}

