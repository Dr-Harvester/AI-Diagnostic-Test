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

        loadData(ID);

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
    let questionid = sessionStorage.getItem("questionid");
    let IDList = sessionStorage.getItem("IDList");
    let typeList = sessionStorage.getItem("typeList");
    let savedPage = sessionStorage.getItem("currentPage");
    console.log(savedPage)
    let questionID = Number(sessionStorage.getItem("questionID"));
    console.log(questionID)
    if (!savedPage) {
        savedPage = "start.html";
    }
    loadPage(savedPage, questionID);
};

let questionAmount;
let numberList = [];
let IDList = [];
let typeList = [];
let answerArray = [];

function randomize(min, max) {
  questionAmount = Math.floor(Math.random() * (30 - 20 + 1)) + 20;
  let random;
  diagnosisINT = Math.floor((Math.random() * ((2 - 1) + 1)) + 2);
  chosendiagnosis = diagnosisses[diagnosisINT - 1];
  for (let i = 0; i <= questionAmount; i++) {
    numberList.push(i);
    random = Math.floor(Math.random() * ((max - min) + 1) + min);
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
  sessionStorage.setItem("diagnosisfinal", JSON.stringify(chosendiagnosis));
  sessionStorage.setItem("numberList", JSON.stringify(numberList));
  sessionStorage.setItem("IDList", JSON.stringify(IDList));
  sessionStorage.setItem("typeList", JSON.stringify(typeList));
  sessionStorage.setItem("questionAmount", JSON.stringify(questionAmount));
  return [numberList, IDList, typeList];
}

for (let i = 0; i <= 20; i++) {
  answerArray.push("NULL");
}

function loadData(ID) {
  chosendiagnosis = JSON.parse(sessionStorage.getItem("diagnosisfinal")) || 1;
  console.log(chosendiagnosis);
  IDList = JSON.parse(sessionStorage.getItem("IDList")) || [];
  const textelement = document.getElementById("questiontext");
  const Imageone = document.getElementById("Imageone");
  const Imagetwo = document.getElementById("Imagetwo");
  const resultelement = document.getElementById("diagnosistext");
  const description = document.getElementById("description");
  const first = document.getElementById("1st-Answer");
  const second = document.getElementById("2nd-Answer");
  const third = document.getElementById("3rd-Answer");
  const fourth = document.getElementById("4th-Answer");
  const fifth = document.getElementById("5th-Answer");
  questionid = IDList[ID];
  if (textelement) {
    textelement.innerHTML = questions[questionid]?.text;
    if (first) {first.innerHTML = questions[questionid]?.answers[0]};
    if (second) {second.innerHTML = questions[questionid]?.answers[1]};
    if (third) {third.innerHTML = questions[questionid]?.answers[2]};
    if (fourth) {fourth.innerHTML = questions[questionid]?.answers[3]};
    if (fifth) {fifth.innerHTML = questions[questionid]?.answers[4]};
    if (Imageone) {
      const src = "Images/" + questions[questionid]?.answers[0];
      Imageone.src = src;
      console.log("Image 1:", src);
    }
    if (Imagetwo) {
      const src = "Images/" + questions[questionid]?.answers[1];
      Imagetwo.src = src;
      console.log("Image 2:", src);
    }
  }
  if (resultelement) {
    console.log(chosendiagnosis?.diagnosis);
    console.log(chosendiagnosis?.description);
    resultelement.innerHTML = chosendiagnosis?.diagnosis;
    description.innerHTML = chosendiagnosis?.description;
  }
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

questions = {
  1: { text: "hello", answers: ["A", "B", "C", "D"] },
  2: { text: "hello", answers: ["A", "B", "C", "D"] },
  3: { text: "hello", answers: ["A", "B", "C", "D"] },
  4: { text: "hello", answers: ["A", "B", "C", "D"] },
  5: { text: "hello", answers: ["A", "B", "C", "D"] },
  6: { text: "hello", answers: ["A", "B", "C", "D"] },
  7: { text: "hello", answers: ["A", "B", "C", "D"] },
  8: { text: "hello", answers: ["A", "B", "C", "D"] },
  9: { text: "hello", answers: ["A", "B", "C", "D"] },
  10: { text: "hello", answers: ["A", "B", "C", "D"] },
  11: { text: "hello", answers: ["A", "B", "C", "D"] },
  12: { text: "hello", answers: ["A", "B", "C", "D"] },
  13: { text: "hello", answers: ["A", "B", "C", "D"] },
  14: { text: "hello", answers: ["A", "B", "C", "D"] },
  15: { text: "hello", answers: ["A", "B", "C", "D"] },
  16: { text: "hello", answers: ["A", "B", "C", "D"] },
  17: { text: "hello", answers: ["A", "B", "C", "D"] },
  18: { text: "hello", answers: ["A", "B", "C", "D"] },
  19: { text: "hello", answers: ["A", "B", "C", "D"] },
  20: { text: "hello", answers: ["A", "B", "C", "D"] },
  21: { text: "hello", answers: ["A", "B", "C", "D"] },
  22: { text: "hello", answers: ["A", "B", "C", "D"] },
  23: { text: "hello", answers: ["A", "B", "C", "D"] },
  24: { text: "hello", answers: ["A", "B", "C", "D"] },
  25: { text: "hello", answers: ["A", "B", "C", "D"] },
  26: { text: "hello", answers: ["A", "B", "C", "D"] },
  27: { text: "hello", answers: ["A", "B", "C", "D"] },
  28: { text: "hello", answers: ["A", "B", "C", "D"] },
  29: { text: "hello", answers: ["A", "B", "C", "D"] },
  30: { text: "hello", answers: ["A", "B", "C", "D"] },
  31: { text: "hello", answers: ["A", "B", "C", "D"] },
  32: { text: "hello", answers: ["A", "B", "C", "D"] },
  33: { text: "hello", answers: ["A", "B", "C", "D"] },
  34: { text: "hello", answers: ["A", "B", "C", "D"] },
  35: { text: "hello", answers: ["A", "B", "C", "D"] },
  36: { text: "hello", answers: ["A", "B", "C", "D"] },
  37: { text: "hello", answers: ["A", "B", "C", "D"] },
  38: { text: "hello", answers: ["A", "B", "C", "D"] },
  39: { text: "hello", answers: ["A", "B", "C", "D"] },
  40: { text: "hello", answers: ["A", "B", "C", "D"] },
  41: { text: "hello", answers: ["A", "B", "C", "D"] },
  42: { text: "hello", answers: ["A", "B", "C", "D"] },
  43: { text: "hello", answers: ["A", "B", "C", "D"] },
  44: { text: "hello", answers: ["A", "B", "C", "D"] },
  45: { text: "hello", answers: ["A", "B", "C", "D"] },
  46: { text: "hello", answers: ["A", "B", "C", "D"] },
  47: { text: "hello", answers: ["A", "B", "C", "D"] },
  48: { text: "hello", answers: ["A", "B", "C", "D"] },
  49: { text: "hello", answers: ["A", "B", "C", "D"] },
  50: { text: "hello", answers: ["A", "B", "C", "D"] },
  51: { text: "hello", answers: ["A", "B", "C", "D"] },
  52: { text: "hello", answers: ["A", "B", "C", "D"] },
  53: { text: "hello", answers: ["A", "B", "C", "D"] },
  54: { text: "hello", answers: ["A", "B", "C", "D"] },
  55: { text: "hello", answers: ["A", "B", "C", "D"] },
  56: { text: "hello", answers: ["A", "B", "C", "D"] },
  57: { text: "hello", answers: ["A", "B", "C", "D"] },
  58: { text: "hello", answers: ["A", "B", "C", "D"] },
  59: { text: "hello", answers: ["A", "B", "C", "D"] },
  60: { text: "hello", answers: ["A", "B", "C", "D"] },
  61: { text: "hello", answers: ["A", "B", "C", "D"] },
  62: { text: "hello", answers: ["A", "B", "C", "D"] },
  63: { text: "hello", answers: ["A", "B", "C", "D"] },
  64: { text: "hello", answers: ["A", "B", "C", "D"] },
  65: { text: "hello", answers: ["A", "B", "C", "D"] },
  66: { text: "hello", answers: ["A", "B", "C", "D"] },
  67: { text: "hello", answers: ["A", "B", "C", "D"] },
  68: { text: "hello", answers: ["A", "B", "C", "D"] },
  69: { text: "hello", answers: ["A", "B", "C", "D"] },
  70: { text: "hello", answers: ["A", "B", "C", "D"] },
  71: { text: "hello", answers: ["A", "B", "C", "D"] },
  72: { text: "hello", answers: ["A", "B", "C", "D"] },
  73: { text: "hello", answers: ["A", "B", "C", "D"] },
  74: { text: "hello", answers: ["A", "B", "C", "D"] },
  75: { text: "hello", answers: ["A", "B", "C", "D"] },
  76: { text: "hello", answers: ["A", "B", "C", "D"] },
  77: { text: "hello", answers: ["A", "B", "C", "D"] },
  78: { text: "hello", answers: ["A", "B", "C", "D"] },
  79: { text: "hello", answers: ["A", "B", "C", "D"] },
  80: { text: "hello", answers: ["A", "B", "C", "D"] },
  81: { text: "hello", answers: ["A", "B", "C", "D"] },
  82: { text: "hello", answers: ["A", "B", "C", "D"] },
  83: { text: "hello", answers: ["A", "B", "C", "D"] },
  84: { text: "hello", answers: ["A", "B", "C", "D"] },
  85: { text: "hello", answers: ["A", "B", "C", "D"] },
  86: { text: "hello", answers: ["A", "B", "C", "D"] },
  87: { text: "hello", answers: ["A", "B", "C", "D"] },
  88: { text: "hello", answers: ["A", "B", "C", "D"] },
  89: { text: "hello", answers: ["A", "B", "C", "D"] },
  90: { text: "hello", answers: ["A", "B", "C", "D"] },
  91: { text: "hello", answers: ["A", "B", "C", "D"] },
  92: { text: "hello", answers: ["A", "B", "C", "D"] },
  93: { text: "hello", answers: ["A", "B", "C", "D"] },
  94: { text: "hello", answers: ["A", "B", "C", "D"] },
  95: { text: "hello", answers: ["A", "B", "C", "D"] },
  96: { text: "hello", answers: ["A", "B", "C", "D"] },
  97: { text: "hello", answers: ["A", "B", "C", "D"] },
  98: { text: "hello", answers: ["A", "B", "C", "D"] },
  99: { text: "hello", answers: ["A", "B", "C", "D"] },
  100: { text: "hello", answers: ["A", "B", "C", "D"] },
  101: { text: "Over the last 2 weeks, how often have you been bothered by little interest or pleasure in doing things?", answers: ["Not at all", "Several days", "More than half of days", "Nearly every day", "Every day"] },
  102: { text: "I fear being left alone to take care of myself.", answers: ["Disagree", "Somewhat disagree", "Not sure", "Somewhat agree", "Agree"] },
  103: { text: "I become upset when I don't get the attention I think I deserve.", answers: ["Disagree", "Somewhat disagree", "Not sure", "Somewhat agree", "Agree"] },
  104: { text: "I often feel that people are out to get me.", answers: ["Disagree", "Somewhat disagree", "Not sure", "Somewhat agree", "Agree"] },
  105: { text: "I am overly cautious about sharing personal information.", answers: ["Disagree", "Somewhat disagree", "Not sure", "Somewhat agree", "Agree"] },
  106: { text: "I often feel uncomfortable in social situations.", answers: ["Disagree", "Somewhat disagree", "Not sure", "Somewhat agree", "Agree"] },
  107: { text: "I rarely experience strong emotions, whether positive or negative.", answers: ["Disagree", "Somewhat disagree", "Not sure", "Somewhat agree", "Agree"] },
  108: { text: "I have sudden mood swings that are hard to control", answers: ["Disagree", "Somewhat disagree", "Not sure", "Somewhat agree", "Agree"] },
  109: { text: "I sometimes feel helpless or dependent on others.", answers: ["Not at all", "Several days", "More than half of days", "Nearly every day", "Every day"] },
  110: { text: "I have very high standards for myself and others.", answers: ["Disagree", "Somewhat disagree", "Not sure", "Somewhat agree", "Agree"] },
  111: { text: "I worry excessively about being judged or rejected.", answers: ["Not at all", "Several days", "More than half of days", "Nearly every day", "Every day"] },
  112: { text: "I avoid close relationships because I fear being hurt or betrayed.", answers: ["Disagree", "Somewhat disagree", "Not sure", "Somewhat agree", "Agree"] },
  113: { text: "I avoid taking risks for fear of embarrassment or failure.", answers: ["Disagree", "Somewhat disagree", "Not sure", "Somewhat agree", "Agree"] },
  114: { text: "My thoughts or speech can seem unusual to others.", answers: ["Disagree", "Somewhat disagree", "Not sure", "Somewhat agree", "Agree"] },
  115: { text: "People sometimes think I lack emotion or warmth.", answers: ["Disagree", "Somewhat disagree", "Not sure", "Somewhat agree", "Agree"] },
  116: { text: "I hold grudges and find it hard to forgive others.", answers: ["Disagree", "Somewhat disagree", "Not sure", "Somewhat agree", "Agree"] },
  117: { text: "I find it hard to delegate tasks because others might not do them correctly.", answers: ["Disagree", "Somewhat disagree", "Not sure", "Somewhat agree", "Agree"] },
  118: { text: "I often feel superior to other people.", answers: ["Disagree", "Somewhat disagree", "Not sure", "Somewhat agree", "Agree"] },
  119: { text: "I frequently feel empty or bored inside.", answers: ["Not at all", "Several days", "More than half of days", "Nearly every day", "Every day"] },
  120: { text: "I often act impulsively without thinking about the consequences.", answers: ["Not at all", "Several days", "More than half of days", "Nearly every day", "Every day"] },
  121: { text: "I feel anxious if things are out of place or messy.", answers: ["Disagree", "Somewhat disagree", "Not sure", "Somewhat agree", "Agree"] },
  122: { text: "I often need to be the center of attention.", answers: ["Disagree", "Somewhat disagree", "Not sure", "Somewhat agree", "Agree"] },
  123: { text: "I sometimes exaggerate my achievements to impress others.", answers: ["Disagree", "Somewhat disagree", "Not sure", "Somewhat agree", "Agree"] },
  124: { text: "I have a strong fear of being abandoned by others", answers: ["Disagree", "Somewhat disagree", "Not sure", "Somewhat agree", "Agree"] },
  125: { text: "I feel that I deserve special treatment or recognition.", answers: ["Disagree", "Somewhat disagree", "Not sure", "Somewhat agree", "Agree"] },
  126: { text: "I find it hard to empathize with other people's feelings", answers: ["Disagree", "Somewhat disagree", "Not sure", "Somewhat agree", "Agree"] },
  127: { text: "I can become very angry if things don't go my way.", answers: ["Disagree", "Somewhat disagree", "Not sure", "Somewhat agree", "Agree"] },
  128: { text: "I often disregard rules or laws if they inconvenience me.", answers: ["Not at all", "Several days", "More than half of days", "Nearly every day", "Every day"] },
  129: { text: "I have little interest in forming close relationships.", answers: ["Disagree", "Somewhat disagree", "Not sure", "Somewhat agree", "Agree"] },
  130: { text: "I worry that others will leave me, even when there's no reason.", answers: ["Not at all", "Several days", "More than half of days", "Nearly every day", "Every day"] },
  131: { text: "I am often irresponsible when it comes to work or obligations.", answers: ["Not at all", "Several days", "More than half of days", "Nearly every day", "Every day"] },
  132: { text: "I often fantasize about being powerful, successful, or admired.", answers: ["Not at all", "Several days", "More than half of days", "Nearly every day", "Every day"] },
  133: { text: "I prefer being alone over spending time with others.", answers: ["Not at all", "Several days", "More than half of days", "Nearly every day", "Every day"] },
  134: { text: "I often focus so much on details that I lose sight of the bigger picture.", answers: ["Disagree", "Somewhat disagree", "Not sure", "Somewhat agree", "Agree"] },
  135: { text: "I notice patterns or connections that others do not see.", answers: ["Disagree", "Somewhat disagree", "Not sure", "Somewhat agree", "Agree"] },
  136: { text: "I sometimes harm myself or think about it when I'm upset.", answers: ["Not at all", "Several days", "More than half of days", "Nearly every day", "Every day"] },
  137: { text: "My relationships are either very close or very distant, with no middle ground.", answers: ["Disagree", "Somewhat disagree", "Not sure", "Somewhat agree", "Agree"] },
  138: { text: "I go to great lengths to avoid conflict or criticism.", answers: ["Disagree", "Somewhat disagree", "Not sure", "Somewhat agree", "Agree"] },
  139: { text: "My relationships tend to be intense and unstable", answers: ["Disagree", "Somewhat disagree", "Not sure", "Somewhat agree", "Agree"] },
  140: { text: "I frequently believe that things have special meanings meant just for me.", answers: ["Disagree", "Somewhat disagree", "Not sure", "Somewhat agree", "Agree"] },
  141: { text: "I don't feel bad about lying or manipulating others if it benefits me.", answers: ["Disagree", "Somewhat disagree", "Not sure", "Somewhat agree", "Agree"] },
  142: { text: "I suspect others have hidden motives, even when there's no evidence.", answers: ["Disagree", "Somewhat disagree", "Not sure", "Somewhat agree", "Agree"] },
  143: { text: "I am extremely uncomfortable when I'm not in control of a situation.", answers: ["Disagree", "Somewhat disagree", "Not sure", "Somewhat agree", "Agree"] },
  144: { text: "I often feel misunderstood or unfairly treated.", answers: ["Disagree", "Somewhat disagree", "Not sure", "Somewhat agree", "Agree"] },
  145: { text: "My emotions can change very quickly.", answers: ["Disagree", "Somewhat disagree", "Not sure", "Somewhat agree", "Agree"] },
  146: { text: "I sometimes hurt others to get what I want.", answers: ["Disagree", "Somewhat disagree", "Not sure", "Somewhat agree", "Agree"] },
  147: { text: "I feel indifferent about praise or criticism from others.", answers: ["Disagree", "Somewhat disagree", "Not sure", "Somewhat agree", "Agree"] },
  148: { text: "I find it hard to stay out of trouble for long periods.", answers: ["Disagree", "Somewhat disagree", "Not sure", "Somewhat agree", "Agree"] },
  149: { text: "I feel that people often lie to me or hide things from me.", answers: ["Not at all", "Several days", "More than half of days", "Nearly every day", "Every day"] },
  150: { text: "I am overly concerned about making mistakes or doing things wrong.", answers: ["Disagree", "Somewhat disagree", "Not sure", "Somewhat agree", "Agree"] },
  151: { text: "hello", answers: ["Yes", "No"] },
  152: { text: "hello", answers: ["Yes", "No"] },
  153: { text: "hello", answers: ["Yes", "No"] },
  154: { text: "hello", answers: ["Yes", "No"] },
  155: { text: "hello", answers: ["Yes", "No"] },
  156: { text: "hello", answers: ["Yes", "No"] },
  157: { text: "hello", answers: ["Yes", "No"] },
  158: { text: "hello", answers: ["Yes", "No"] },
  159: { text: "hello", answers: ["Yes", "No"] },
  160: { text: "hello", answers: ["Yes", "No"] },
  161: { text: "hello", answers: ["Yes", "No"] },
  162: { text: "hello", answers: ["Yes", "No"] },
  163: { text: "hello", answers: ["Yes", "No"] },
  164: { text: "hello", answers: ["Yes", "No"] },
  165: { text: "hello", answers: ["Yes", "No"] },
  166: { text: "hello", answers: ["Yes", "No"] },
  167: { text: "hello", answers: ["Yes", "No"] },
  168: { text: "hello", answers: ["Yes", "No"] },
  169: { text: "hello", answers: ["Yes", "No"] },
  170: { text: "hello", answers: ["Yes", "No"] },
  171: { text: "hello", answers: ["Yes", "No"] },
  172: { text: "hello", answers: ["Yes", "No"] },
  173: { text: "hello", answers: ["Yes", "No"] },
  174: { text: "hello", answers: ["Yes", "No"] },
  175: { text: "hello", answers: ["Yes", "No"] },
  176: { text: "hello", answers: ["Yes", "No"] },
  177: { text: "hello", answers: ["Yes", "No"] },
  178: { text: "hello", answers: ["Yes", "No"] },
  179: { text: "hello", answers: ["Yes", "No"] },
  180: { text: "hello", answers: ["Yes", "No"] },
  181: { text: "hello", answers: ["Yes", "No"] },
  182: { text: "hello", answers: ["Yes", "No"] },
  183: { text: "hello", answers: ["Yes", "No"] },
  184: { text: "hello", answers: ["Yes", "No"] },
  185: { text: "hello", answers: ["Yes", "No"] },
  186: { text: "hello", answers: ["Yes", "No"] },
  187: { text: "hello", answers: ["Yes", "No"] },
  188: { text: "hello", answers: ["Yes", "No"] },
  189: { text: "hello", answers: ["Yes", "No"] },
  190: { text: "hello", answers: ["Yes", "No"] },
  191: { text: "hello", answers: ["Yes", "No"] },
  192: { text: "hello", answers: ["Yes", "No"] },
  193: { text: "hello", answers: ["Yes", "No"] },
  194: { text: "hello", answers: ["Yes", "No"] },
  195: { text: "hello", answers: ["Yes", "No"] },
  196: { text: "hello", answers: ["Yes", "No"] },
  197: { text: "hello", answers: ["Yes", "No"] },
  198: { text: "hello", answers: ["Yes", "No"] },
  199: { text: "hello", answers: ["Yes", "No"] },
  200: { text: "hello", answers: ["Yes", "No"] },
  201: { text: "hello", answers: ["1-1.png", "1-2.png"] },
  202: { text: "hello", answers: ["2-1.png", "2-2.png"] },
  203: { text: "hello", answers: ["3-1.png", "3-2.png"] },
  204: { text: "hello", answers: ["4-1.png", "4-2.png"] },
  205: { text: "hello", answers: ["5-1.png", "5-2.png"] },
  206: { text: "hello", answers: ["6-1.png", "6-2.png"] },
  207: { text: "hello", answers: ["7-1.png", "7-2.png"] },
  208: { text: "hello", answers: ["8-1.png", "8-2.png"] },
  209: { text: "hello", answers: ["9-1.png", "9-2.png"] },
  210: { text: "hello", answers: ["10-1.png", "10-2.png"] },
  211: { text: "hello", answers: ["11-1.png", "11-2.png"] },
  212: { text: "hello", answers: ["12-1.png", "12-2.png"] },
  213: { text: "hello", answers: ["13-1.png", "13-2.png"] },
  214: { text: "hello", answers: ["14-1.png", "14-2.png"] },
  215: { text: "hello", answers: ["15-1.png", "15-2.png"] },
  216: { text: "hello", answers: ["16-1.png", "16-2.png"] },
  217: { text: "hello", answers: ["17-1.png", "17-2.png"] },
  218: { text: "hello", answers: ["18-1.png", "18-2.png"] },
  219: { text: "hello", answers: ["19-1.png", "19-2.png"] },
  220: { text: "hello", answers: ["20-1.png", "20-2.png"] },
  221: { text: "hello", answers: ["21-1.png", "21-2.png"] },
  222: { text: "hello", answers: ["22-1.png", "22-2.png"] },
  223: { text: "hello", answers: ["23-1.png", "23-2.png"] },
  224: { text: "hello", answers: ["24-1.png", "24-2.png"] },
  225: { text: "hello", answers: ["25-1.png", "25-2.png"] },
  226: { text: "hello", answers: ["26-1.png", "26-2.png"] },
  227: { text: "hello", answers: ["27-1.png", "27-2.png"] },
  228: { text: "hello", answers: ["28-1.png", "28-2.png"] },
  229: { text: "hello", answers: ["29-1.png", "29-2.png"] },
  230: { text: "hello", answers: ["30-1.png", "30-2.png"] },
  231: { text: "hello", answers: ["31-1.png", "31-2.png"] },
  232: { text: "hello", answers: ["32-1.png", "32-2.png"] },
  233: { text: "hello", answers: ["33-1.png", "33-2.png"] },
  234: { text: "hello", answers: ["34-1.png", "34-2.png"] },
  235: { text: "hello", answers: ["35-1.png", "35-2.png"] },
  236: { text: "hello", answers: ["36-1.png", "36-2.png"] },
  237: { text: "hello", answers: ["37-1.png", "37-2.png"] },
  238: { text: "hello", answers: ["38-1.png", "38-2.png"] },
  239: { text: "hello", answers: ["39-1.png", "39-2.png"] },
  240: { text: "hello", answers: ["40-1.png", "40-2.png"] },
  241: { text: "hello", answers: ["41-1.png", "41-2.png"] },
  242: { text: "hello", answers: ["42-1.png", "42-2.png"] },
  243: { text: "hello", answers: ["43-1.png", "43-2.png"] },
  244: { text: "hello", answers: ["44-1.png", "44-2.png"] },
  245: { text: "hello", answers: ["45-1.png", "45-2.png"] },
  246: { text: "hello", answers: ["46-1.png", "46-2.png"] },
  247: { text: "hello", answers: ["47-1.png", "47-2.png"] },
  248: { text: "hello", answers: ["48-1.png", "48-2.png"] },
  249: { text: "hello", answers: ["49-1.png", "49-2.png"] },
  250: { text: "hello", answers: ["50-1.png", "50-2.png"] },
  251: { text: "hello", answers: [] },
  252: { text: "hello", answers: [] },
  253: { text: "hello", answers: [] },
  254: { text: "hello", answers: [] },
  255: { text: "hello", answers: [] },
  256: { text: "hello", answers: [] },
  257: { text: "hello", answers: [] },
  258: { text: "hello", answers: [] },
  259: { text: "hello", answers: [] },
  260: { text: "hello", answers: [] },
  261: { text: "hello", answers: [] },
  262: { text: "hello", answers: [] },
  263: { text: "hello", answers: [] },
  264: { text: "hello", answers: [] },
  265: { text: "hello", answers: [] },
  266: { text: "hello", answers: [] },
  267: { text: "hello", answers: [] },
  268: { text: "hello", answers: [] },
  269: { text: "hello", answers: [] },
  270: { text: "hello", answers: [] },
  271: { text: "hello", answers: [] },
  272: { text: "hello", answers: [] },
  273: { text: "hello", answers: [] },
  274: { text: "hello", answers: [] },
  275: { text: "hello", answers: [] },
  276: { text: "hello", answers: [] },
  277: { text: "hello", answers: [] },
  278: { text: "hello", answers: [] },
  279: { text: "hello", answers: [] },
  280: { text: "hello", answers: [] },
  281: { text: "hello", answers: [] },
  282: { text: "hello", answers: [] },
  283: { text: "hello", answers: [] },
  284: { text: "hello", answers: [] },
  285: { text: "hello", answers: [] },
  286: { text: "hello", answers: [] },
  287: { text: "hello", answers: [] },
  288: { text: "hello", answers: [] },
  289: { text: "hello", answers: [] },
  290: { text: "hello", answers: [] },
  291: { text: "hello", answers: [] },
  292: { text: "hello", answers: [] },
  293: { text: "hello", answers: [] },
  294: { text: "hello", answers: [] },
  295: { text: "hello", answers: [] },
  296: { text: "hello", answers: [] },
  297: { text: "hello", answers: [] },
  298: { text: "hello", answers: [] },
  299: { text: "hello", answers: [] },
  300: { text: "hello", answers: [] },
  301: { text: "hello", answers: [] },
  302: { text: "hello", answers: [] },
  303: { text: "hello", answers: [] },
  304: { text: "hello", answers: [] },
  305: { text: "hello", answers: [] },
  306: { text: "hello", answers: [] },
  307: { text: "hello", answers: [] },
  308: { text: "hello", answers: [] },
  309: { text: "hello", answers: [] },
  310: { text: "hello", answers: [] },
  311: { text: "hello", answers: [] },
  312: { text: "hello", answers: [] },
  313: { text: "hello", answers: [] },
  314: { text: "hello", answers: [] },
  315: { text: "hello", answers: [] },
  316: { text: "hello", answers: [] },
  317: { text: "hello", answers: [] },
  318: { text: "hello", answers: [] },
  319: { text: "hello", answers: [] },
  320: { text: "hello", answers: [] },
  321: { text: "hello", answers: [] },
  322: { text: "hello", answers: [] },
  323: { text: "hello", answers: [] },
  324: { text: "hello", answers: [] },
  325: { text: "hello", answers: [] },
  326: { text: "hello", answers: [] },
  327: { text: "hello", answers: [] },
  328: { text: "hello", answers: [] },
  329: { text: "hello", answers: [] },
  330: { text: "hello", answers: [] },
  331: { text: "hello", answers: [] },
  332: { text: "hello", answers: [] },
  333: { text: "hello", answers: [] },
  334: { text: "hello", answers: [] },
  335: { text: "hello", answers: [] },
  336: { text: "hello", answers: [] },
  337: { text: "hello", answers: [] },
  338: { text: "hello", answers: [] },
  339: { text: "hello", answers: [] },
  340: { text: "hello", answers: [] },
  341: { text: "hello", answers: [] },
  342: { text: "hello", answers: [] },
  343: { text: "hello", answers: [] },
  344: { text: "hello", answers: [] },
  345: { text: "hello", answers: [] },
  346: { text: "hello", answers: [] },
  347: { text: "hello", answers: [] },
  348: { text: "hello", answers: [] },
  349: { text: "hello", answers: [] },
  350: { text: "hello", answers: [] },
  351: { text: "hello", answers: ["A", "B", "C", "D", "E"] },
  352: { text: "hello", answers: ["A", "B", "C", "D", "E"] },
  353: { text: "hello", answers: ["A", "B", "C", "D", "E"] },
  354: { text: "hello", answers: ["A", "B", "C", "D", "E"] },
  355: { text: "hello", answers: ["A", "B", "C", "D", "E"] },
  356: { text: "hello", answers: ["A", "B", "C", "D", "E"] },
  357: { text: "hello", answers: ["A", "B", "C", "D", "E"] },
  358: { text: "hello", answers: ["A", "B", "C", "D", "E"] },
  359: { text: "hello", answers: ["A", "B", "C", "D", "E"] },
  360: { text: "hello", answers: ["A", "B", "C", "D", "E"] },
  361: { text: "hello", answers: ["A", "B", "C", "D", "E"] },
  362: { text: "hello", answers: ["A", "B", "C", "D", "E"] },
  363: { text: "hello", answers: ["A", "B", "C", "D", "E"] },
  364: { text: "hello", answers: ["A", "B", "C", "D", "E"] },
  365: { text: "hello", answers: ["A", "B", "C", "D", "E"] },
  366: { text: "hello", answers: ["A", "B", "C", "D", "E"] },
  367: { text: "hello", answers: ["A", "B", "C", "D", "E"] },
  368: { text: "hello", answers: ["A", "B", "C", "D", "E"] },
  369: { text: "hello", answers: ["A", "B", "C", "D", "E"] },
  370: { text: "hello", answers: ["A", "B", "C", "D", "E"] },
  371: { text: "hello", answers: ["A", "B", "C", "D", "E"] },
  372: { text: "hello", answers: ["A", "B", "C", "D", "E"] },
  373: { text: "hello", answers: ["A", "B", "C", "D", "E"] },
  374: { text: "hello", answers: ["A", "B", "C", "D", "E"] },
  375: { text: "hello", answers: ["A", "B", "C", "D", "E"] },
  376: { text: "hello", answers: ["A", "B", "C", "D", "E"] },
  377: { text: "hello", answers: ["A", "B", "C", "D", "E"] },
  378: { text: "hello", answers: ["A", "B", "C", "D", "E"] },
  379: { text: "hello", answers: ["A", "B", "C", "D", "E"] },
  380: { text: "hello", answers: ["A", "B", "C", "D", "E"] },
  381: { text: "hello", answers: ["A", "B", "C", "D", "E"] },
  382: { text: "hello", answers: ["A", "B", "C", "D", "E"] },
  383: { text: "hello", answers: ["A", "B", "C", "D", "E"] },
  384: { text: "hello", answers: ["A", "B", "C", "D", "E"] },
  385: { text: "hello", answers: ["A", "B", "C", "D", "E"] },
  386: { text: "hello", answers: ["A", "B", "C", "D", "E"] },
  387: { text: "hello", answers: ["A", "B", "C", "D", "E"] },
  388: { text: "hello", answers: ["A", "B", "C", "D", "E"] },
  389: { text: "hello", answers: ["A", "B", "C", "D", "E"] },
  390: { text: "hello", answers: ["A", "B", "C", "D", "E"] },
  391: { text: "hello", answers: ["A", "B", "C", "D", "E"] },
  392: { text: "hello", answers: ["A", "B", "C", "D", "E"] },
  393: { text: "hello", answers: ["A", "B", "C", "D", "E"] },
  394: { text: "hello", answers: ["A", "B", "C", "D", "E"] },
  395: { text: "hello", answers: ["A", "B", "C", "D", "E"] },
  396: { text: "hello", answers: ["A", "B", "C", "D", "E"] },
  397: { text: "hello", answers: ["A", "B", "C", "D", "E"] },
  398: { text: "hello", answers: ["A", "B", "C", "D", "E"] },
  399: { text: "hello", answers: ["A", "B", "C", "D", "E"] },
  400: { text: "hello", answers: ["A", "B", "C", "D", "E"] },
};

diagnosisses = {
  1: { diagnosis: "Autism", description: "you autistic you autistic you autistic you autistic you autistic you autistic you autistic you autistic you autistic you autistic"},
  2: { diagnosis: "Bipolar", description: "two face lmao"}
};