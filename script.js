var questionID;

if (!sessionStorage.getItem("answerArray")) {
  let answerArray = [];
  for (let i = 0; i < 31; i++) {
    answerArray.push(null);
  }
  sessionStorage.setItem("answerArray", JSON.stringify(answerArray));
}

async function loadPage(page, ID) {
    try {
        sessionStorage.setItem("currentPage", page);
        sessionStorage.setItem("questionID", ID);
        questionID = ID;
        const response = await fetch(page);
        const html = await response.text();
        app.innerHTML = html;
        const scripts = app.querySelectorAll("script");
        scripts.forEach(oldScript => {
            const newScript = document.createElement("script");
            if (oldScript.src) {
                newScript.src = oldScript.src;
            } else {
                newScript.textContent = oldScript.textContent;
            }
            document.body.appendChild(newScript);
            oldScript.remove();
        });

        if (window.pageController && window.pageController.init) {
            window.pageController.init();
        }
        let answers = retrieveAnswer(ID);

        console.log("Loading answers:", answers);

        if (window.pageController && window.pageController.selectAnswer) {
            window.pageController.selectAnswer(answers);
        }
    } catch (error) {
        document.getElementById("app").innerHTML = "<h2>Error loading page</h2>";
        console.error(error);
    }
}

window.onload = function () {
    let numberList = sessionStorage.getItem("numberList");
    let IDList = sessionStorage.getItem("IDList");
    let typeList = sessionStorage.getItem("typeList");
    let questionAmount = Number(sessionStorage.getItem("questionAmount"));
    let savedPage = sessionStorage.getItem("currentPage");
    console.log(savedPage)
    let questionID = Number(sessionStorage.getItem("questionID"));
    console.log(questionID)
    if (!savedPage) {
        savedPage = "start.html";
    }
    loadPage(savedPage, questionID);
};

let questionAmount = 0;
let numberList = [];
let IDList = [];
let typeList = [];
let answerArray = [];

function randomize(min, max) {
  questionAmount = Math.floor(Math.random() * (30 - 20 + 1)) + 20;
  let random;
  for (let i = 0; i <= questionAmount; i++) {
    numberList.push(i);
    random = Math.floor(Math.random() * (max - min + 1)) + min;
    if (random >= 1 && random <= 50) {
      typeList.push(1);
    } else if (random >= 51 && random <= 100) {
      typeList.push(2);
    } else if (random >= 101 && random <= 150) {
      typeList.push(3);
    } else if (random >= 151 && random <= 200) {
      typeList.push(4);
    } else if (random >= 201 && random <= 250) {
      typeList.push(5);
    } else if (random >= 251 && random <= 300) {
      typeList.push(6);
    } else if (random >= 301 && random <= 350) {
      typeList.push(7);
    } else if (random >= 351 && random <= 400) {
      typeList.push(8);
    } else {
      typeList.push("NULL");
    }
    IDList.push(random);
  }
  sessionStorage.setItem("numberList", JSON.stringify(numberList));
  sessionStorage.setItem("IDList", JSON.stringify(IDList));
  sessionStorage.setItem("typeList", JSON.stringify(typeList));
  sessionStorage.setItem("questionAmount", JSON.stringify(questionAmount));
  return [numberList, IDList, typeList];
}

for (let i = 0; i <= 20; i++) {
  answerArray.push("NULL");
}

function getStoredArray() {
  return JSON.parse(sessionStorage.getItem("answerArray")) || [];
}

function updateAnswer(questionID, answerID) {

  let answers = getStoredArray();

  answers[questionID - 1] = answerID;

  sessionStorage.setItem("answerArray", JSON.stringify(answers));

  console.log("Saved:", answers);
}

function retrieveAnswer(questionID) {

  let answers = getStoredArray();

  console.log("Retrieved:", answers[questionID - 1]);

  return answers[questionID - 1] ?? null;
}

function nextQuestion(ID) {

  const listLength = sessionStorage.getItem("questionAmount");
  const typeList = sessionStorage.getItem("typeList") ? JSON.parse(sessionStorage.getItem("typeList")) : [];

  if (ID === listLength - 1) {
    loadPage("result.html", ID + 1)
    return;
  } else {

    let newID = ID + 1;
    console.log(newID)

    if (typeList[newID] === 1) {
      loadPage("multiple.html", newID);
    } else if (typeList[newID] === 2) {
      loadPage("select.html", newID);
    } else if (typeList[newID] === 3) {
      loadPage("onetofive.html", newID);
    } else if (typeList[newID] === 4) {
      loadPage("yesno.html", newID);
    } else if (typeList[newID] === 5) {
      loadPage("image.html", newID);
    } else if (typeList[newID] === 6) {
      loadPage("interpretation.html", newID);
    } else if (typeList[newID] === 7) {
      loadPage("openended.html", newID);
    } else if (typeList[newID] === 8) {
      loadPage("rank.html", newID);
    } else {
      alert("Redirection failed.");
    }
  }
}

function lastQuestion(ID) {

  const listLength = sessionStorage.getItem("questionAmount");
  const typeList = sessionStorage.getItem("typeList") ? JSON.parse(sessionStorage.getItem("typeList")) : [];

  if (ID === 1) {
    return alert("This is the first question.");
  } else {

    let newID = ID - 1;
    console.log(newID)

    if (typeList[newID] === 1) {
      loadPage("multiple.html", newID);
    } else if (typeList[newID] === 2) {
      loadPage("select.html", newID);
    } else if (typeList[newID] === 3) {
      loadPage("onetofive.html", newID);
    } else if (typeList[newID] === 4) {
      loadPage("yesno.html", newID);
    } else if (typeList[newID] === 5) {
      loadPage("image.html", newID);
    } else if (typeList[newID] === 6) {
      loadPage("interpretation.html", newID);
    } else if (typeList[newID] === 7) {
      loadPage("openended.html", newID);
    } else if (typeList[newID] === 8) {
      loadPage("rank.html", newID);
    } else {
      alert("Redirection Failed.");
    }
  }
}

var questions = JSON.parse(localStorage.getItem("questions"));

if (!questions) {
  questions = [
    select = [
      {
        id: 1,
        answers: []
      },
      {
        id: 2,
        answers: []
      }
    ],
    multiple = [
      {
        id: 1,
        answers: []
      },
      {
        id: 2,
        answers: []
      }
    ],
    onetofive = [
      {
        id: 1,
        answers: []
      },
      {
        id: 2,
        answers: []
      }
    ],
    yesno = [
      {
        id: 1,
        answers: []
      },
      {
        id: 2,
        answers: []
      }
    ],
    image = [
      {
        id: 1,
        answers: [],
        image: []
      },
      {
        id: 2,
        answers: [],
        image: []
      }
    ],
    interpret = [
      {
        id: 1,
        answers: [],
        image: []
      },
      {
        id: 2,
        answers: [],
        image: []
      }
    ],
    openended = [
      {
        id: 1,
        answers: []
      },
      {
        id: 2,
        answers: []
      }
    ],
    rank = [
      {
        id: 1,
        answers: []
      },
      {
        id: 2,
        answers: []
      }
    ]
  ]
}
