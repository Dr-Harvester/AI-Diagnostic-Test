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
  diagnosisINT = Math.floor((Math.random() * ((32 - 1) + 1)) + 2);
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
      const src = questions[questionid]?.answers[0];
      Imageone.src = src;
      console.log("Image 1:", src);
    }
    if (Imagetwo) {
      const src = questions[questionid]?.answers[1];
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
  1: { text: "When talking with other people, how do you usually know what they are feeling?", answers: ["I can usually tell from facial expressions and tone of voice.", "I notice some clues, but I sometimes miss them.", "I often need people to tell me directly.", "I rarely know unless they explicitly explain it."] },
  2: { text: "Have there been times when you suddenly became much more energetic and active than usual for several days?", answers: ["Never.", "Occasionally, but not very noticeable.", "Often enough that others notice.", "Frequently and it significantly affects my behavior."] },
  3: { text: "When given a task that requires concentration for a long period, what usually happens?", answers: ["I stay focused until it is finished.", "I get distracted occasionally.", "I frequently lose focus and have to redirect myself.", "I struggle to stay focused for more than a few minutes."] },
  4: { text: "When something reminds you of a difficult experience, what usually happens?", answers: ["It does not affect me much.", "I briefly think about it and move on.", "It can upset me for a while.", "I feel overwhelmed or react strongly."] },
  5: { text: "How often do you find yourself worrying about several different things at once?", answers: ["Rarely.", "Sometimes.", "Often.", "Almost constantly."] },
  6: { text: "Have you ever been convinced something was happening even when other people strongly disagreed?", answers: ["Never.", "Rarely.", "Sometimes.", "Frequently."] },
  7: { text: "How often do you repeat actions (checking, cleaning, counting, etc.) because stopping feels uncomfortable?", answers: ["Never.", "Occasionally.", "Often.", "Very frequently."] },
  8: { text: "Before meeting unfamiliar people, how do you usually feel?", answers: ["Comfortable.", "Slightly nervous.", "Very nervous.", "So anxious I may avoid the situation."] },
  9: { text: "Have you ever experienced a sudden rush of intense fear that seemed to come out of nowhere?", answers: ["Never.", "Once or twice.", "Occasionally.", "Frequently."] },
  10: { text: "How comfortable are you being in crowded places where leaving quickly might be difficult?", answers: ["Completely comfortable.", "Slightly uncomfortable.", "Often uncomfortable.", "I avoid such situations whenever possible."] },
  11: { text: "How often do activities you usually enjoy stop feeling enjoyable?", answers: ["Almost never.", "Occasionally.", "Often.", "Most of the time."] },
  12: { text: "How long do low moods typically stay with you?", answers: ["Only briefly.", "A few days at a time.", "Several weeks at a time.", "For months or longer."] },
  13: { text: "How often do you question whether your experiences match what others around you are experiencing?", answers: ["Never.", "Rarely.", "Sometimes.", "Frequently."] },
  14: { text: "How much time do you spend thinking about physical discomforts or symptoms?", answers: ["Very little.", "Some.", "A lot.", "Most of my day."] },
  15: { text: "Have you ever experienced physical difficulties that appeared suddenly during times of stress?", answers: ["Never.", "Rarely.", "Sometimes.", "Frequently."] },
  16: { text: "When you notice a new physical sensation, what is your usual reaction?", answers: ["I ignore it unless it becomes serious.", "I pay attention but do not worry much.", "I become concerned about what it might mean.", "I immediately fear it could be a serious illness."] },
  17: { text: "Do you ever feel detached from your surroundings, as if things are unreal?", answers: ["Never.", "Rarely.", "Sometimes.", "Frequently."] },
  18: { text: "How often do you discover you cannot remember important events that others say happened?", answers: ["Never.", "Rarely.", "Sometimes.", "Frequently."] },
  19: { text: "Have you ever found evidence that you did something but do not remember doing it?", answers: ["Never.", "Rarely.", "Sometimes.", "Frequently."] },
  20: { text: "How likely are you to avoid activities where you might be criticized?", answers: ["Not likely.", "Slightly likely.", "Quite likely.", "Very likely."] },
  21: { text: "How often do other people describe your ideas or beliefs as unusual?", answers: ["Never.", "Rarely.", "Sometimes.", "Frequently."] },
  22: { text: "How quickly do your feelings about people change?", answers: ["They remain fairly stable.", "They change occasionally.", "They change often.", "They can change dramatically within a short time."] },
  23: { text: "How important is recognition from others to your sense of self-worth?", answers: ["Not very important.", "Somewhat important.", "Very important.", "Extremely important."] },
  24: { text: "When rules interfere with what you want, what do you usually do?", answers: ["Follow the rules.", "Consider bending them.", "Ignore them if necessary.", "Regularly disregard them."] },
  25: { text: "How do you feel when your weight increases?", answers: ["Neutral.", "Slightly concerned.", "Very concerned.", "Extremely distressed."] },
  26: { text: "After eating more than intended, how do you usually feel?", answers: ["It does not bother me.", "Slightly guilty.", "Very guilty.", "Driven to undo the effects somehow."] },
  27: { text: "How often do you continue eating even after feeling physically full?", answers: ["Never.", "Occasionally.", "Often.", "Very frequently."] },
  28: { text: "When faced with a specific thing you fear, what is your usual reaction?", answers: ["Mild discomfort.", "Noticeable nervousness.", "Intense fear.", "Immediate avoidance."] },
  29: { text: "When feeling stressed or bored, how often do you pull at your hair?", answers: ["Never.", "Occasionally.", "Often.", "Very frequently."] },
  30: { text: "When deciding whether to throw away an item you rarely use, how do you feel?", answers: ["Comfortable discarding it.", "Slightly hesitant.", "Very reluctant.", "Unable to part with it."] },
  31: { text: "How much time do you spend thinking about flaws in your appearance?", answers: ["Almost none.", "Less than an hour a day.", "Several hours a day.", "Most of the day."] },
  32: { text: "At the end of a typical day, how would you describe your energy level?", answers: ["Normal.", "Slightly lower than normal.", "Much lower than normal.", "Extremely drained."] },
  33: { text: "How often do you find yourself becoming intensely focused on a specific interest or hobby for long periods of time?", answers: ["Rarely or never", "Sometimes", "Often", "Almost all of the time"] },
  34: { text: "When plans change unexpectedly, how do you usually react?", answers: ["I adapt easily", "I am slightly bothered", "I become noticeably upset", "I find it very difficult to adjust"] },
  35: { text: "How often do you start tasks but struggle to finish them because your attention shifts elsewhere?", answers: ["Rarely or never", "Sometimes", "Often", "Very frequently"] },
  36: { text: "After a stressful event, how often do you avoid people, places, or activities that remind you of it?", answers: ["Never", "Occasionally", "Often", "Whenever possible"] },
  37: { text: "How often do you seek reassurance from others about worries that keep returning?", answers: ["Rarely or never", "Sometimes", "Often", "Very frequently"] },
  38: { text: "How often do you feel the need to double-check something even after confirming it is correct?", answers: ["Never", "Occasionally", "Often", "Almost every time"] },
  39: { text: "When speaking in front of a group, how uncomfortable do you feel?", answers: ["Comfortable", "Slightly uncomfortable", "Very uncomfortable", "Extremely anxious"] },
  40: { text: "How often do you avoid social events because of nervousness about interacting with others?", answers: ["Never", "Occasionally", "Often", "Almost always"] },
  41: { text: "When you experience physical sensations such as a rapid heartbeat or dizziness, how likely are you to believe something is seriously wrong?", answers: ["Very unlikely", "Somewhat unlikely", "Somewhat likely", "Very likely"] },
  42: { text: "How often do you find yourself feeling detached from your own thoughts, emotions, or actions?", answers: ["Never", "Rarely", "Sometimes", "Frequently"] },
  43: { text: "How sensitive are you to criticism from other people?", answers: ["Not very sensitive", "Somewhat sensitive", "Very sensitive", "Extremely sensitive"] },
  44: { text: "How often do you feel empty or unsure of who you are as a person?", answers: ["Rarely or never", "Sometimes", "Often", "Most of the time"] },
  45: { text: "How often do you believe you deserve special treatment compared to others?", answers: ["Rarely or never", "Sometimes", "Often", "Very frequently"] },
  46: { text: "When your actions negatively affect someone else, how much guilt do you usually feel?", answers: ["A great deal", "Some", "Very little", "None"] },
  47: { text: "How often do concerns about your body shape or weight influence your eating habits?", answers: ["Rarely or never", "Sometimes", "Often", "Almost constantly"] },
  48: { text: "How difficult is it for you to resist eating when feeling stressed, sad, or overwhelmed?", answers: ["Not difficult", "Slightly difficult", "Very difficult", "Extremely difficult"] },
  49: { text: "How much distress do you feel when looking at a part of your appearance that you dislike?", answers: ["Very little", "Some", "A lot", "An extreme amount"] },
  50: { text: "How often do feelings of sadness or hopelessness make it difficult to complete everyday responsibilities?", answers: ["Rarely or never", "Sometimes", "Often", "Most days"] },
  51: { text: "How often do you notice difficulty understanding what someone means unless they say it directly?", answers: ["Never", "Rarely", "Often", "Almost always"] },
  52: { text: "How often do your energy levels shift dramatically over a short period of time?", answers: ["Never", "Rarely", "Often", "Very frequently"] },
  53: { text: "How often do you struggle to stay focused on tasks that require sustained attention?", answers: ["Never", "Sometimes", "Often", "Almost always"] },
  54: { text: "How often do unwanted memories of stressful or frightening experiences appear suddenly?", answers: ["Never", "Rarely", "Often", "Very frequently"] },
  55: { text: "How often do you worry about multiple areas of life even when nothing is wrong?", answers: ["Rarely or never", "Sometimes", "Often", "Almost constantly"] },
  56: { text: "How often do you notice things others do not seem to perceive or experience?", answers: ["Never", "Rarely", "Sometimes", "Often"] },
  57: { text: "How often do repeated thoughts or urges interfere with your ability to relax?", answers: ["Never", "Occasionally", "Often", "Very frequently"] },
  58: { text: "How often do you feel nervous in situations where you might be judged by others?", answers: ["Never", "Sometimes", "Often", "Almost always"] },
  59: { text: "How often do sudden episodes of intense fear or discomfort occur without warning?", answers: ["Never", "Once or twice", "Occasionally", "Frequently"] },
  60: { text: "How often do you avoid places where leaving quickly might feel difficult?", answers: ["Never", "Rarely", "Often", "Almost always"] },
  61: { text: "How often do you lose interest in activities you normally enjoy?", answers: ["Never", "Sometimes", "Often", "Almost always"] },
  62: { text: "How often do you experience low mood lasting for long periods of time?", answers: ["Never", "Sometimes", "Often", "Most of the time"] },
  63: { text: "How often do you question whether what you are experiencing is real?", answers: ["Never", "Rarely", "Sometimes", "Often"] },
  64: { text: "How often do physical symptoms take up a large part of your attention?", answers: ["Never", "Sometimes", "Often", "Almost constantly"] },
  65: { text: "How often do physical symptoms appear during times of stress without a clear medical cause?", answers: ["Never", "Rarely", "Sometimes", "Often"] },
  66: { text: "How often do you worry that normal body sensations may indicate serious illness?", answers: ["Never", "Sometimes", "Often", "Almost always"] },
  67: { text: "How often do you feel detached from yourself or your surroundings?", answers: ["Never", "Rarely", "Sometimes", "Frequently"] },
  68: { text: "How often do you discover gaps in your memory for important events?", answers: ["Never", "Rarely", "Sometimes", "Often"] },
  69: { text: "How often do you find evidence of actions you do not remember performing?", answers: ["Never", "Rarely", "Sometimes", "Often"] },
  70: { text: "How often do you avoid situations where you might be criticized or rejected?", answers: ["Never", "Sometimes", "Often", "Almost always"] },
  71: { text: "How often do others describe your thoughts or beliefs as unusual or odd?", answers: ["Never", "Rarely", "Sometimes", "Often"] },
  72: { text: "How often do your feelings about people shift quickly from positive to negative?", answers: ["Never", "Sometimes", "Often", "Very frequently"] },
  73: { text: "How important is recognition or admiration from others to you?", answers: ["Not important", "Somewhat important", "Very important", "Extremely important"] },
  74: { text: "How often do you ignore rules if they get in the way of what you want?", answers: ["Never", "Rarely", "Sometimes", "Often"] },
  75: { text: "How often do you feel intense fear of gaining weight or becoming heavier?", answers: ["Never", "Sometimes", "Often", "Almost always"] },
  76: { text: "After eating more than intended, how often do you feel strong regret or urge to compensate?", answers: ["Never", "Sometimes", "Often", "Almost always"] },
  77: { text: "How often do you eat large amounts of food even when you are not hungry?", answers: ["Never", "Sometimes", "Often", "Very frequently"] },
  78: { text: "How often do you experience intense fear of a specific object or situation?", answers: ["Never", "Sometimes", "Often", "Almost always"] },
  79: { text: "How often do you feel an urge to pull out your hair?", answers: ["Never", "Rarely", "Often", "Very frequently"] },
  80: { text: "How difficult is it for you to throw away items you no longer need?", answers: ["Very easy", "Slightly difficult", "Very difficult", "Nearly impossible"] },
  81: { text: "How much time do you spend worrying about perceived flaws in your appearance?", answers: ["Almost none", "A little", "A lot", "Most of the time"] },
  82: { text: "How often do feelings of sadness or hopelessness interfere with daily life?", answers: ["Never", "Sometimes", "Often", "Almost always"] },
  83: { text: "How often do you feel overwhelmed when multiple things demand your attention at once?", answers: ["Never", "Sometimes", "Often", "Almost always"] },
  84: { text: "How often do you replay conversations in your head long after they happen?", answers: ["Never", "Sometimes", "Often", "Very frequently"] },
  85: { text: "How often do you feel uncomfortable in crowded or noisy environments?", answers: ["Never", "Sometimes", "Often", "Almost always"] },
  86: { text: "How often do you struggle to control impulsive decisions in the moment?", answers: ["Never", "Rarely", "Often", "Very frequently"] },
  87: { text: "How often do you feel emotionally numb or disconnected during stressful times?", answers: ["Never", "Sometimes", "Often", "Almost always"] },
  88: { text: "How often do you feel that your self-image changes depending on who you're with?", answers: ["Never", "Sometimes", "Often", "Very frequently"] },
  89: { text: "How often do you find it difficult to trust other people's intentions?", answers: ["Never", "Rarely", "Often", "Almost always"] },
  90: { text: "How often do you feel physically restless even when trying to relax?", answers: ["Never", "Sometimes", "Often", "Very frequently"] },
  91: { text: "How often do you avoid trying new things due to fear of embarrassment?", answers: ["Never", "Sometimes", "Often", "Almost always"] },
  92: { text: "How often do you experience sudden mood changes without a clear reason?", answers: ["Never", "Sometimes", "Often", "Very frequently"] },
  93: { text: "How often do you feel like your thoughts are moving too fast to keep up with?", answers: ["Never", "Rarely", "Often", "Very frequently"] },
  94: { text: "How often do you feel exhausted even after a full night's sleep?", answers: ["Never", "Sometimes", "Often", "Almost always"] },
  95: { text: "How often do you find yourself avoiding responsibilities even when you know they are important?", answers: ["Never", "Sometimes", "Often", "Very frequently"] },
  96: { text: "How often do you feel irritated by small things that normally wouldn't bother you?", answers: ["Never", "Sometimes", "Often", "Very frequently"] },
  97: { text: "How often do you feel like you need to repeat actions until they feel 'right'?", answers: ["Never", "Sometimes", "Often", "Almost always"] },
  98: { text: "How often do you feel disconnected from your emotions as if they are muted?", answers: ["Never", "Sometimes", "Often", "Very frequently"] },
  99: { text: "How often do you find yourself seeking reassurance from others about your decisions?", answers: ["Never", "Sometimes", "Often", "Very frequently"] },
  100: { text: "How often do you feel that your reactions are stronger than the situation calls for?", answers: ["Never", "Sometimes", "Often", "Very frequently"] },
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
  151: { text: "Do you often miss subtle social cues such as tone of voice or facial expression?", answers: ["Yes", "No"] },
  152: { text: "Do you experience noticeable shifts in energy or activity levels over short periods of time?", answers: ["Yes", "No"] },
  153: { text: "Do you frequently lose focus during tasks that require sustained attention?", answers: ["Yes", "No"] },
  154: { text: "Do unwanted memories of stressful experiences sometimes enter your mind unexpectedly?", answers: ["Yes", "No"] },
  155: { text: "Do you often worry about multiple things even when there is no immediate problem?", answers: ["Yes", "No"] },
  156: { text: "Do you sometimes notice things others say they do not perceive?", answers: ["Yes", "No"] },
  157: { text: "Do repetitive thoughts or urges interfere with your ability to relax?", answers: ["Yes", "No"] },
  158: { text: "Do you feel nervous in situations where you may be judged by others?", answers: ["Yes", "No"] },
  159: { text: "Do you ever experience sudden episodes of intense fear without warning?", answers: ["Yes", "No"] },
  160: { text: "Do you avoid places where leaving quickly would feel difficult or uncomfortable?", answers: ["Yes", "No"] },
  161: { text: "Do you often lose interest in activities you normally enjoy?", answers: ["Yes", "No"] },
  162: { text: "Do you experience long periods of low mood or discouragement?", answers: ["Yes", "No"] },
  163: { text: "Do you sometimes question whether your experiences are real?", answers: ["Yes", "No"] },
  164: { text: "Do physical symptoms often take up a large amount of your attention?", answers: ["Yes", "No"] },
  165: { text: "Do physical symptoms sometimes appear during stressful situations without clear medical explanation?", answers: ["Yes", "No"] },
  166: { text: "Do you worry that normal bodily sensations may indicate serious illness?", answers: ["Yes", "No"] },
  167: { text: "Do you sometimes feel detached from yourself or your surroundings?", answers: ["Yes", "No"] },
  168: { text: "Do you experience gaps in your memory for important events?", answers: ["Yes", "No"] },
  169: { text: "Do you ever find evidence that you did something you cannot remember doing?", answers: ["Yes", "No"] },
  170: { text: "Do you avoid situations where criticism or rejection is possible?", answers: ["Yes", "No"] },
  171: { text: "Do others often describe your thoughts or beliefs as unusual?", answers: ["Yes", "No"] },
  172: { text: "Do your feelings about people sometimes change quickly?", answers: ["Yes", "No"] },
  173: { text: "Do you feel a strong need for recognition or admiration from others?", answers: ["Yes", "No"] },
  174: { text: "Do you sometimes ignore rules when they interfere with what you want?", answers: ["Yes", "No"] },
  175: { text: "Do you feel strong fear about gaining weight or becoming heavier?", answers: ["Yes", "No"] },
  176: { text: "After overeating, do you feel strong guilt or urge to compensate?", answers: ["Yes", "No"] },
  177: { text: "Do you sometimes eat large amounts of food even when not hungry?", answers: ["Yes", "No"] },
  178: { text: "Do you experience intense fear toward specific objects or situations?", answers: ["Yes", "No"] },
  179: { text: "Do you feel urges to pull out your hair?", answers: ["Yes", "No"] },
  180: { text: "Do you find it difficult to throw away items you no longer need?", answers: ["Yes", "No"] },
  181: { text: "Do you spend a lot of time worrying about perceived flaws in your appearance?", answers: ["Yes", "No"] },
  182: { text: "Do feelings of sadness or hopelessness interfere with your daily life?", answers: ["Yes", "No"] },
  183: { text: "Do you often feel overwhelmed when many things demand your attention at once?", answers: ["Yes", "No"] },
  184: { text: "Do you replay conversations in your mind long after they happen?", answers: ["Yes", "No"] },
  185: { text: "Do crowded or noisy environments make you uncomfortable?", answers: ["Yes", "No"] },
  186: { text: "Do you act on impulse even when you later regret it?", answers: ["Yes", "No"] },
  187: { text: "Do you sometimes feel emotionally numb during stressful situations?", answers: ["Yes", "No"] },
  188: { text: "Does your self-image feel different depending on who you are with?", answers: ["Yes", "No"] },
  189: { text: "Do you often find it difficult to trust other people's intentions?", answers: ["Yes", "No"] },
  190: { text: "Do you feel restless even when trying to relax?", answers: ["Yes", "No"] },
  191: { text: "Do you avoid new situations due to fear of embarrassment?", answers: ["Yes", "No"] },
  192: { text: "Do your moods sometimes change suddenly without a clear reason?", answers: ["Yes", "No"] },
  193: { text: "Do your thoughts sometimes feel too fast to keep up with?", answers: ["Yes", "No"] },
  194: { text: "Do you often feel tired even after sleeping enough?", answers: ["Yes", "No"] },
  195: { text: "Do you avoid responsibilities even when you know they are important?", answers: ["Yes", "No"] },
  196: { text: "Do small things often irritate you more than they seem to irritate others?", answers: ["Yes", "No"] },
  197: { text: "Do you feel the need to repeat actions until they feel 'just right'?", answers: ["Yes", "No"] },
  198: { text: "Do you feel disconnected from your emotions at times?", answers: ["Yes", "No"] },
  199: { text: "Do you often seek reassurance from others about your decisions?", answers: ["Yes", "No"] },
  200: { text: "Do you feel your emotional reactions are sometimes stronger than the situation warrants?", answers: ["Yes", "No"] },
  201: { text: "Which image feels more active or dynamic?", answers: ["1-1.avif", "1-2.avif"] },
  202: { text: "Which image appears more calm or peaceful?", answers: ["2-1.avif", "2-2.avif"] },
  203: { text: "Which image do you think tells a clearer story?", answers: ["3-1.avif", "3-2.avif"] },
  204: { text: "Which image feels more emotionally intense?", answers: ["4-1.avif", "4-2.avif"] },
  205: { text: "Which image seems more visually organized?", answers: ["5-1.avif", "5-2.avif"] },
  206: { text: "Which image draws your attention first?", answers: ["6-1.avif", "6-2.avif"] },
  207: { text: "Which image feels more realistic?", answers: ["7-1.avif", "7-2.avif"] },
  208: { text: "Which image seems more confusing or harder to interpret?", answers: ["8-1.avif", "8-2.avif"] },
  209: { text: "Which image looks more natural or unposed?", answers: ["9-1.avif", "9-2.avif"] },
  210: { text: "Which image feels more emotionally positive?", answers: ["10-1.avif", "10-2.avif"] },
  211: { text: "Which image feels more unsettling or unusual?", answers: ["11-1.avif", "11-2.avif"] },
  212: { text: "Which image seems more structured or balanced?", answers: ["12-1.avif", "12-2.avif"] },
  213: { text: "Which image has more noticeable details?", answers: ["13-1.avif", "13-2.avif"] },
  214: { text: "Which image feels more expressive?", answers: ["14-1.avif", "14-2.avif"] },
  215: { text: "Which image seems more static or still?", answers: ["15-1.avif", "15-2.avif"] },
  216: { text: "Which image feels more meaningful or symbolic?", answers: ["16-1.avif", "16-2.avif"] },
  217: { text: "Which image appears brighter or more visually striking?", answers: ["17-1.avif", "17-2.avif"] },
  218: { text: "Which image feels more chaotic or disorganized?", answers: ["18-1.avif", "18-2.avif"] },
  219: { text: "Which image seems easier to understand at first glance?", answers: ["19-1.avif", "19-2.avif"] },
  220: { text: "Which image feels more emotionally neutral?", answers: ["20-1.avif", "20-2.avif"] },
  221: { text: "Which image appears more complex?", answers: ["21-1.avif", "21-2.avif"] },
  222: { text: "Which image feels more familiar or relatable?", answers: ["22-1.avif", "22-2.avif"] },
  223: { text: "Which image seems more distant or detached?", answers: ["23-1.avif", "23-2.avif"] },
  224: { text: "Which image feels more intentional or staged?", answers: ["24-1.avif", "24-2.avif"] },
  225: { text: "Which image feels more spontaneous?", answers: ["25-1.avif", "25-2.avif"] },
  226: { text: "Which image has stronger contrast or visual impact?", answers: ["26-1.avif", "26-2.avif"] },
  227: { text: "Which image feels more crowded or busy?", answers: ["27-1.avif", "27-2.avif"] },
  228: { text: "Which image feels more open or spacious?", answers: ["28-1.avif", "28-2.avif"] },
  229: { text: "Which image seems more focused on a central subject?", answers: ["29-1.avif", "29-2.avif"] },
  230: { text: "Which image feels more emotionally warm?", answers: ["30-1.avif", "30-2.avif"] },
  231: { text: "Which image feels more emotionally cold or distant?", answers: ["31-1.avif", "31-2.avif"] },
  232: { text: "Which image looks more modern?", answers: ["32-1.avif", "32-2.avif"] },
  233: { text: "Which image looks more traditional or old-fashioned?", answers: ["33-1.avif", "33-2.avif"] },
  234: { text: "Which image feels more balanced in composition?", answers: ["34-1.avif", "34-2.avif"] },
  235: { text: "Which image feels more unbalanced or asymmetrical?", answers: ["35-1.avif", "35-2.avif"] },
  236: { text: "Which image feels more emotionally expressive in people or subjects?", answers: ["36-1.avif", "36-2.avif"] },
  237: { text: "Which image feels more abstract or unclear?", answers: ["37-1.avif", "37-2.avif"] },
  238: { text: "Which image feels more detailed in texture or surface?", answers: ["38-1.avif", "38-2.avif"] },
  239: { text: "Which image feels more energetic in composition?", answers: ["39-1.avif", "39-2.avif"] },
  240: { text: "Which image feels more relaxed or passive?", answers: ["40-1.avif", "40-2.avif"] },
  241: { text: "Which image feels more emotionally engaging?", answers: ["41-1.avif", "41-2.avif"] },
  242: { text: "Which image feels more emotionally distant?", answers: ["42-1.avif", "42-2.avif"] },
  243: { text: "Which image seems more visually stable?", answers: ["43-1.avif", "43-2.avif"] },
  244: { text: "Which image feels more visually unpredictable?", answers: ["44-1.avif", "44-2.avif"] },
  245: { text: "Which image feels more attention-grabbing?", answers: ["45-1.avif", "45-2.avif"] },
  246: { text: "Which image feels more subtle or understated?", answers: ["46-1.avif", "46-2.avif"] },
  247: { text: "Which image feels more emotionally heavy?", answers: ["47-1.avif", "47-2.avif"] },
  248: { text: "Which image feels more emotionally light?", answers: ["48-1.avif", "48-2.avif"] },
  249: { text: "Which image feels more narrative or story-like?", answers: ["49-1.avif", "49-2.avif"] },
  250: { text: "Which image feels more abstract or interpretive?", answers: ["50-1.avif", "50-2.avif"] },
  251: { text: "What is the main action happening in the image you are viewing?", answers: ["I1.avif"] },
  252: { text: "What is the first detail you notice in the image?", answers: ["I2.avif"] },
  253: { text: "What do you think is happening right before this moment in the image?", answers: ["I3.avif"] },
  254: { text: "What do you think will happen next after this image?", answers: ["I4.avif"] },
  255: { text: "How would you describe the overall mood or tone of the image?", answers: ["I5.avif"] },
  256: { text: "What objects or people stand out the most in the image?", answers: ["I6.avif"] },
  257: { text: "What do you think the setting or location of the image is?", answers: ["I7.avif"] },
  258: { text: "What time of day or time period do you think this image represents?", answers: ["I8.avif"] },
  259: { text: "What emotions do you think the people in the image might be feeling?", answers: ["I9.avif"] },
  260: { text: "What makes you think those emotions are present?", answers: ["I10.avif"] },
  261: { text: "What details in the image seem most important to the story?", answers: ["I11.avif"] },
  262: { text: "What do you think is the relationship between the people (if any) in the image?", answers: ["I12.avif"] },
  263: { text: "What do you think the purpose or goal of the scene in the image is?", answers: ["I13.avif"] },
  264: { text: "What is something in the image that might be easy to miss at first glance?", answers: ["I14.avif"] },
  265: { text: "How would you summarize the image in one sentence?", answers: ["I15.avif"] },
  266: { text: "What questions would you ask about what is happening in the image?", answers: ["I16.avif"] },
  267: { text: "What part of the image feels most important or meaningful to you?", answers: ["I17.avif"] },
  268: { text: "What clues in the image help you understand the situation?", answers: ["I18.avif"] },
  269: { text: "What do you think the people in the image are thinking about?", answers: ["I19.avif"] },
  270: { text: "What might have led to the situation shown in the image?", answers: ["I20.avif"] },
  271: { text: "What details suggest the environment or setting of the image?", answers: ["I21.avif"] },
  272: { text: "What do you think is the central focus of the image?", answers: ["I22.avif"] },
  273: { text: "What background details help explain what is happening?", answers: ["I23.avif"] },
  274: { text: "What do you think the photographer or creator wanted to show?", answers: ["I24.avif"] },
  275: { text: "What would you title this image if you had to name it?", answers: ["I25.avif"] },
  276: { text: "What emotions does this image evoke in you personally?", answers: ["I26.avif"] },
  277: { text: "What story do you think this image is telling?", answers: ["I27.avif"] },
  278: { text: "What is unusual or interesting about this image?", answers: ["I28.avif"] },
  279: { text: "What do you think is the most important object in the image and why?", answers: ["I29.avif"] },
  280: { text: "How would the meaning of the image change if one detail were removed?", answers: ["I30.avif"] },
  281: { text: "What do you think is happening outside the frame of the image?", answers: ["I31.avif"] },
  282: { text: "What cultural or social context might be relevant to this image?", answers: ["I32.avif"] },
  283: { text: "What do you think the lighting or colors in the image contribute to its meaning?", answers: ["I33.avif"] },
  284: { text: "What does the body language of any people in the image suggest?", answers: ["I34.avif"] },
  285: { text: "What do you think the main message of this image is?", answers: ["I35.avif"] },
  286: { text: "What details suggest whether this is a real or staged moment?", answers: ["I36.avif"] },
  287: { text: "What assumptions might someone make after seeing this image?", answers: ["I37.avif"] },
  288: { text: "What do you think the emotions of the scene would be if you were inside it?", answers: ["I38.avif"] },
  289: { text: "What details in the image seem most symbolic or meaningful?", answers: ["I39.avif"] },
  290: { text: "What would you change in the image to make its meaning clearer?", answers: ["I40.avif"] },
  291: { text: "What do you think the smallest detail in the image contributes to the overall scene?", answers: ["I41.avif"] },
  292: { text: "What does the composition (layout of objects/people) suggest?", answers: ["I42.avif"] },
  293: { text: "What do you think is happening just outside the visible area of the image?", answers: ["I43.avif"] },
  294: { text: "What emotions do the colors or tones in the image suggest?", answers: ["I44.avif"] },
  295: { text: "What do you think is the most surprising detail in the image?", answers: ["I45.avif"] },
  296: { text: "What does this image make you wonder about?", answers: ["I46.avif"] },
  297: { text: "What would someone who disagrees with your interpretation say?", answers: ["I47.avif"] },
  298: { text: "What details support your interpretation of the image?", answers: ["I48.avif"] },
  299: { text: "What do you think is the least important detail in the image and why?", answers: ["I49.avif"] },
  300: { text: "If this image were part of a larger story, what do you think comes before it?", answers: ["I50.avif"] },
  301: { text: "Can you describe how you usually interpret other people's tone, facial expressions, or body language?", answers: [] },
  302: { text: "Have you ever experienced periods of unusually high energy or activity? What were they like?", answers: [] },
  303: { text: "What is it like for you to maintain focus on tasks that take a long time?", answers: [] },
  304: { text: "Can you describe any memories or experiences that suddenly come back to you in stressful moments?", answers: [] },
  305: { text: "What kinds of worries tend to show up most often in your daily thinking?", answers: [] },
  306: { text: "Have you ever experienced things others did not seem to notice? If so, how did you interpret them?", answers: [] },
  307: { text: "Can you describe any thoughts or urges that repeat and feel hard to ignore?", answers: [] },
  308: { text: "What situations tend to make you feel socially uncomfortable or self-conscious?", answers: [] },
  309: { text: "Have you ever experienced sudden fear or panic? What was it like?", answers: [] },
  310: { text: "Are there places or situations you tend to avoid because they feel overwhelming? Why?", answers: [] },
  311: { text: "Can you describe how your interest or motivation in activities changes over time?", answers: [] },
  312: { text: "What has your mood been like over long periods of your life?", answers: [] },
  313: { text: "Have you ever felt unsure whether something you experienced was real or not? Describe it.", answers: [] },
  314: { text: "Do you often notice and focus on physical symptoms in your body? What is that like?", answers: [] },
  315: { text: "Can you describe any physical symptoms that appear during stress?", answers: [] },
  316: { text: "How do you react when you notice changes or sensations in your body?", answers: [] },
  317: { text: "Have you ever felt disconnected from yourself or reality? What did that feel like?", answers: [] },
  318: { text: "Have you experienced gaps in your memory? What do you remember about them?", answers: [] },
  319: { text: "Have you ever noticed differences in your behavior that you could not fully explain?", answers: [] },
  320: { text: "What situations make you avoid interacting with other people?", answers: [] },
  321: { text: "Have others ever described your thinking or beliefs as unusual? How do you respond to that?", answers: [] },
  322: { text: "How stable or changeable are your feelings toward other people?", answers: [] },
  323: { text: "How important is recognition or praise from others in your life?", answers: [] },
  324: { text: "Can you describe how you think about rules or expectations in daily life?", answers: [] },
  325: { text: "How do thoughts about your body or weight affect you?", answers: [] },
  326: { text: "What emotions do you experience after eating more than you intended?", answers: [] },
  327: { text: "Can you describe your eating patterns during times of stress or emotional discomfort?", answers: [] },
  328: { text: "What situations or objects cause you strong fear or avoidance?", answers: [] },
  329: { text: "Can you describe any habits involving pulling or touching your hair?", answers: [] },
  330: { text: "How do you decide whether to keep or discard possessions?", answers: [] },
  331: { text: "How do concerns about your appearance affect your daily thoughts or behavior?", answers: [] },
  332: { text: "Can you describe how sadness or hopelessness affects your daily functioning?", answers: [] },
  333: { text: "What helps you feel calm when you are overwhelmed?", answers: [] },
  334: { text: "How do you usually react when plans change suddenly?", answers: [] },
  335: { text: "Can you describe your sleep patterns and how they affect your day?", answers: [] },
  336: { text: "What is your usual response when you feel criticized or judged?", answers: [] },
  337: { text: "How do you handle situations where you feel out of control?", answers: [] },
  338: { text: "What thoughts tend to repeat when you are alone?", answers: [] },
  339: { text: "How do you usually make important decisions?", answers: [] },
  340: { text: "Can you describe your energy levels throughout a typical day?", answers: [] },
  341: { text: "What situations make you feel most confident?", answers: [] },
  342: { text: "What situations make you feel most insecure?", answers: [] },
  343: { text: "How do you usually respond to conflict with other people?", answers: [] },
  344: { text: "What do you do when you feel emotionally overwhelmed?", answers: [] },
  345: { text: "How would you describe your attention span in daily life?", answers: [] },
  346: { text: "What habits do you notice yourself repeating often?", answers: [] },
  347: { text: "How do you typically cope with stress?", answers: [] },
  348: { text: "Can you describe a time you felt disconnected from your emotions?", answers: [] },
  349: { text: "What does a 'good day' usually look like for you?", answers: [] },
  350: { text: "What do you think influences your mood the most?", answers: [] },
  351: { text: "Rank how often these experiences apply to you from most to least:", answers: ["Feeling overwhelmed", "Losing focus", "Feeling anxious", "Feeling detached", "Feeling motivated"] },
  352: { text: "Rank these emotional states from most frequent to least frequent:", answers: ["Sadness", "Anger", "Anxiety", "Emptiness", "Calmness"] },
  353: { text: "Rank these thought patterns from most to least present in your life:", answers: ["Worry", "Self-doubt", "Intrusive thoughts", "Optimism", "Indifference"] },
  354: { text: "Rank these behaviors from most to least common:", answers: ["Avoidance", "Impulsivity", "Organization", "Procrastination", "Consistency"] },
  355: { text: "Rank these reactions from strongest to weakest in your experience:", answers: ["Fear", "Frustration", "Excitement", "Confusion", "Calmness"] },
  356: { text: "Rank these attention patterns from most to least common:", answers: ["Distraction", "Hyperfocus", "Forgetfulness", "Alertness", "Disorganization"] },
  357: { text: "Rank these social experiences from most to least present:", answers: ["Social anxiety", "Comfort in groups", "Fear of judgment", "Enjoyment of interaction", "Avoidance"] },
  358: { text: "Rank these physical experiences from most to least frequent:", answers: ["Fatigue", "Restlessness", "Tension", "Pain awareness", "Comfort"] },
  359: { text: "Rank these memory experiences from most to least common:", answers: ["Forgetting events", "Confusion about time", "Clear memory", "Memory gaps", "Strong recall"] },
  360: { text: "Rank these coping strategies from most to least used:", answers: ["Reassurance seeking", "Avoidance", "Problem solving", "Denial", "Emotional expression"] },
  361: { text: "Rank these identity-related experiences from most to least present:", answers: ["Unstable self-image", "Strong identity", "Confusion about self", "Role-shifting", "Confidence"] },
  362: { text: "Rank these habits from most to least frequent:", answers: ["Checking", "Cleaning", "Organizing", "Ignoring tasks", "Repeating actions"] },
  363: { text: "Rank these fears from most to least impactful:", answers: ["Rejection", "Failure", "Embarrassment", "Danger", "Loss of control"] },
  364: { text: "Rank these motivation states from most to least present:", answers: ["Low motivation", "High drive", "Exhaustion", "Restlessness", "Consistency"] },
  365: { text: "Rank these perception experiences from most to least common:", answers: ["Misinterpretation", "Clarity", "Unusual perceptions", "Confusion", "Grounded thinking"] },
  366: { text: "Rank these eating-related behaviors from most to least frequent:", answers: ["Restriction", "Overeating", "Guilt", "Normal eating", "Loss of control"] },
  367: { text: "Rank these emotional regulation patterns from most to least present:", answers: ["Mood swings", "Stability", "Intense reactions", "Numbness", "Calm control"] },
  368: { text: "Rank these compulsive tendencies from most to least common:", answers: ["Urges", "Resistance", "Repetition", "Control", "Relief after action"] },
  369: { text: "Rank these stress responses from most to least frequent:", answers: ["Panic", "Shutdown", "Fight response", "Avoidance", "Calm response"] },
  370: { text: "Rank these thinking patterns from most to least present:", answers: ["Intrusive thoughts", "Logical thinking", "Overthinking", "Mental clarity", "Confusion"] },
  371: { text: "Rank these social behaviors from most to least common:", answers: ["Withdrawal", "Engagement", "Avoidance", "Confidence", "Discomfort"] },
  372: { text: "Rank these emotional states from most to least frequent:", answers: ["Hopelessness", "Irritability", "Joy", "Sadness", "Neutrality"] },
  373: { text: "Rank these self-perception traits from most to least present:", answers: ["Self-criticism", "Self-confidence", "Insecurity", "Self-focus", "Self-acceptance"] },
  374: { text: "Rank these behavioral tendencies from most to least common:", answers: ["Impulsivity", "Planning", "Avoidance", "Discipline", "Inconsistency"] },
  375: { text: "Rank these sensory experiences from most to least frequent:", answers: ["Overstimulation", "Calmness", "Sensitivity", "Numbness", "Balance"] },
  376: { text: "Rank these fear responses from most to least common:", answers: ["Panic", "Mild fear", "Avoidance", "Curiosity", "Indifference"] },
  377: { text: "Rank these cognitive experiences from most to least present:", answers: ["Overthinking", "Clear thinking", "Confusion", "Rapid thoughts", "Mental slowing"] },
  378: { text: "Rank these behavioral reactions from most to least common:", answers: ["Avoidance", "Confrontation", "Compliance", "Resistance", "Neutrality"] },
  379: { text: "Rank these emotional states from most to least frequent:", answers: ["Anxiety", "Calmness", "Stress", "Excitement", "Emptiness"] },
  380: { text: "Rank these daily functioning patterns from most to least present:", answers: ["Difficulty completing tasks", "Productivity", "Distraction", "Focus", "Inconsistency"] },
  381: { text: "Rank these internal states from most to least frequent:", answers: ["Emotional numbness", "Emotional intensity", "Stability", "Overwhelm", "Clarity"] },
  382: { text: "Rank these decision-making styles from most to least common:", answers: ["Impulsive choices", "Careful planning", "Hesitation", "Confidence", "Indecision"] },
  383: { text: "Rank these interpersonal patterns from most to least present:", answers: ["Trust issues", "Closeness", "Isolation", "Dependence", "Independence"] },
  384: { text: "Rank these emotional reactions from most to least frequent:", answers: ["Irritation", "Calm response", "Anger", "Patience", "Frustration"] },
  385: { text: "Rank these behavioral habits from most to least common:", answers: ["Repetition", "Organization", "Avoidance", "Task completion", "Inconsistency"] },
  386: { text: "Rank these identity-related experiences from most to least present:", answers: ["Identity confusion", "Stable identity", "Shifting self-image", "Confidence", "Uncertainty"] },
  387: { text: "Rank these coping responses from most to least common:", answers: ["Withdrawal", "Problem solving", "Avoidance", "Emotional expression", "Denial"] },
  388: { text: "Rank these mental states from most to least frequent:", answers: ["Focus", "Distraction", "Confusion", "Clarity", "Overload"] },
  389: { text: "Rank these emotional experiences from most to least present:", answers: ["Sadness", "Happiness", "Neutrality", "Anxiety", "Excitement"] },
  390: { text: "Rank these behavioral responses from most to least common:", answers: ["Avoidance", "Engagement", "Hesitation", "Action", "Inaction"] },
  391: { text: "Rank these cognitive patterns from most to least frequent:", answers: ["Intrusive thoughts", "Clarity", "Overthinking", "Confusion", "Focus"] },
  392: { text: "Rank these emotional regulation states from most to least present:", answers: ["Control", "Overwhelm", "Instability", "Calmness", "Intensity"] },
  393: { text: "Rank these motivation states from most to least common:", answers: ["Exhaustion", "Drive", "Procrastination", "Consistency", "Lack of motivation"] },
  394: { text: "Rank these behavioral habits from most to least frequent:", answers: ["Checking behaviors", "Avoidance", "Organization", "Repetition", "Completion"] },
  395: { text: "Rank these emotional experiences from most to least present:", answers: ["Emotional numbness", "Emotional intensity", "Stability", "Confusion", "Clarity"] },
  396: { text: "Rank these cognitive states from most to least frequent:", answers: ["Overthinking", "Focus", "Confusion", "Mental clarity", "Mental overload"] },
  397: { text: "Rank these emotional reactions from most to least common:", answers: ["Anxiety", "Calmness", "Irritability", "Excitement", "Sadness"] },
  398: { text: "Rank these behavioral tendencies from most to least present:", answers: ["Avoidance", "Engagement", "Discipline", "Impulsivity", "Inconsistency"] },
  399: { text: "Rank these internal experiences from most to least frequent:", answers: ["Emotional numbness", "Emotional intensity", "Stability", "Overwhelm", "Clarity"] },
  400: { text: "Rank these decision-making patterns from most to least common:", answers: ["Impulsivity", "Planning", "Hesitation", "Confidence", "Indecision"] },
};

diagnosisses = {
  1: { diagnosis: "Autism Spectrum Disorder", description: "A neurological and developmental difference in how the brain processes information. It affects how an individual communicates, interacts with others, learns, and perceives the world."},
  2: { diagnosis: "Bipolar Disorder", description: "A chronic mental health condition characterized by severe, recurring shifts in mood, energy, and activity levels. It causes individuals to cycle between extreme emotional “highs” (mania) and extreme “lows” (depression), disrupting sleep, behavior, and daily functioning."},
  3: { diagnosis: "Attention-deficit/hyperactivity disorder (ADHD)", description: "A neurodevelopmental disorder affecting the brain's ability to regulate attention, impulse control, and activity levels."},
  4: { diagnosis: "Posttraumatic stress disorder (PTSD)", description: "A psychiatric condition that develops in some individuals after experiencing or witnessing a life-threatening or deeply traumatic event. Biologically, it is characterized by a 'stuck' survival mechanism, where the brain overproduces stress chemicals and struggles to process the trauma memory, leaving the nervous system chronically trapped in fight-or-flight mode."},
  5: { diagnosis: "Generalized Anxiety Disorder", description: "A mental health condition defined by chronic, excessive, and uncontrollable worry about everyday occurrences. Rather than reacting to an immediate threat, the brain misfires its 'fight or flight' response, keeping the nervous system on high alert."},
  6: { diagnosis: "Schizophrenia", description: "A complex, chronic brain disorder that disrupts how a person thinks, feels, and perceives reality. It is characterized by three primary categories of symptoms: psychotic (added behaviors, such as hallucinations or delusions), negative (reduced motivation or emotional expression), and cognitive (poor memory and focus)."},
  7: { diagnosis: "Obsessive-compulsize Disorder", description: "A mental health condition characterized by a distressing, recurring cycle. It involves uncontrollable, intrusive thoughts, urges, or images (obsessions) paired with repetitive behaviors or mental acts (compulsions) the brain feels forced to preform to alleviate anxiety."},
  8: { diagnosis: "Social Anxiety Disorder", description: "A mental health condition characterized by an intense, persistent fear of being watched, judged, or humiliated in social or performance situations. This fear triggers a severe physiological stress response that significantly interferes with a person's daily life, personal relationships, or career."},
  9: { diagnosis: "Panic Disorder", description: "An anxiety disorder characterized by recurrent, unexpected panic attacks—sudden surges of intense fear.  These attacks trigger the body's 'fight-or-flight' response without an actual threat, causing severe physical symptoms that often mimic medical emergencies like a heart attack."},
  10: { diagnosis: "Agoraphobia", description: "A complex anxiety disorder characterized by an intense, irrational fear of situations where escape might be difficult or help unavailable. It primarily drives avoidance of public or enclosed spaces, crowds, or being outside the home alone, out of fear of experiencing a panic attack."},
  11: { diagnosis: "Major Depressive Disorder", description: "A serious biological and psychological mood disorder. It causes a persistent, profound feeling of sadness, emptiness, or irritability, along with a complete loss of interest in activities. It affects how you think, feel, and behave, significantly disrupting daily life and physical health."},
  12: { diagnosis: "Persistent Depressive Disorder", description: "A chronic, low-grade mood disorder. It is characterized by a continuous, low-level depressed or irritable mood that persists for most of the day, more days than not, for at least two years in adults (or one year in children)."},
  13: { diagnosis: "Psychotic Disorder", description: "A severe mental health condition that fundamentally disrupts a person's perception of reality. Individuals with these disorders struggle to distinguish between what is real and what is imagined, which significantly impairs their thoughts, emotions, and everyday functioning."},
  14: { diagnosis: "Somatic Symptom Disorder", description: "A mental health condition where a person experiences intense, distressing physical symptoms—such as pain, fatigue, or shortness of breath—coupled with excessive, debilitating anxiety about those symptoms."},
  15: { diagnosis: "Conversion Disorder", description: "A condition where a person experiences genuine physical or neurological symptoms (like paralysis, seizures, or vision loss) with no structural brain damage or underlying medical disease. It is caused by a disruption in how the brain communicates with the body."},
  16: { diagnosis: "Illness Anxiety Disorder", description: "A psychiatric condition characterized by an intense, persistent, and irrational fear of having or developing a serious undiagnosed medical illness."},
  17: { diagnosis: "Dissociative Disorder", description: "Mental health conditions involving involuntary breakdowns in the normal integration of consciousness, memory, identity, and perception. Functioning as an unconscious defense mechanism, it disconnects overwhelming thoughts or memories from conscious awareness. This typically develops as a psychological adaptation to severe or prolonged trauma."},
  18: { diagnosis: "Amnesia", description: "A cognitive disorder characterized by the profound, abnormal loss of memories, such as facts, information, and experiences. It occurs when the brain's memory-processing regions—most notably the hippocampus and medial temporal lobes—are damaged by physical injury, disease, or psychological trauma."},
  19: { diagnosis: "Dissociative Identity Disorder (DID)", description: "A complex psychiatric condition where a single individual experiences two or more distinct personality states (often called 'alters'). It is primarily a survival adaptation to severe, repeated childhood trauma that permanently disrupts the normal integration of consciousness, memory, and sense of self."},
  20: { diagnosis: "Avoidant Personality Disorder", description: "A psychiatric condition characterized by a lifelong, pervasive pattern of extreme social inhibition, hypersensitivity to criticism, and chronic feelings of inadequacy. Despite a deep desire for intimacy, individuals isolate themselves to avoid the intense fear of rejection, ridicule, or disapproval."},
  21: { diagnosis: "Schizotypal Personality Disorder", description: "A Cluster A mental health condition characterized by a pervasive pattern of social isolation, eccentric behavior, and distorted thinking or perception. People with STPD desire social connections but struggle to form them due to intense, persistent anxiety and paranoia."},
  22: { diagnosis: "Borderline Personality Disorder", description: "A mental health condition characterized by profound emotional instability, impulsivity, and difficulties in regulating behavior. People with BPD experience intense mood swings, a distorted self-image, and chronic struggles with maintaining stable relationships."},
  23: { diagnosis: "Narcissistic Personality Disorder", description: "A mental health condition characterized by a pervasive pattern of grandiosity, an excessive need for admiration, and a fundamental lack of empathy. Individuals with this disorder harbor an inflated sense of self-importance and often exploit others to validate their fragile self-esteem."},
  24: { diagnosis: "Antisocial Personality Disorder", description: "A chronic mental health condition characterized by a pervasive pattern of disregarding, exploiting, and violating the rights of others. Individuals with ASPD typically exhibit a profound lack of empathy, a lack of remorse, and chronic impulsivity."},
  25: { diagnosis: "Anorexia Nervosa", description: "A serious psychiatric disorder characterized by an intense fear of gaining weight, leading to severe calorie restriction, malnutrition, and a distorted body image. Despite being dangerously underweight, individuals with this condition perceive themselves as overweight and obsessively control their food intake."},
  26: { diagnosis: "Bulimia Nervosa", description: "A serious eating disorder characterized by recurrent cycles of uncontrolled binge eating—consuming unusually large amounts of food in a short time—followed by compensatory behaviors to prevent weight gain."},
  27: { diagnosis: "Binge-eating Disorder", description: "A recognized mental health condition characterized by recurring episodes of consuming unusually large amounts of food in a short period, accompanied by a profound feeling of a lack of control."},
  28: { diagnosis: "Phobia", description: "An anxiety disorder characterized by an intense, irrational, and persistent fear of a specific object, situation, or activity. This fear is severely disproportionate to the actual danger posed and causes individuals to go to extreme lengths to avoid the trigger."},
  29: { diagnosis: "Trichotillomania", description: "A psychological and neuropsychiatric disorder characterized by an irresistible, repetitive urge to pull out one's own hair. It is classified as a Body-Focused Repetitive Behavior (BFRB). The act of pulling hair typically serves as an unconscious coping mechanism to manage stress, anxiety, or internal tension."},
  30: { diagnosis: "Hoarding Disorder", description: "A severe inability to discard possessions—regardless of their actual value—driven by an intense emotional attachment to items and distress over parting with them. This behavior leads to extreme clutter that makes living spaces unusable and threatens safety."},
  31: { diagnosis: "Body Dysmorphic Disorder", description: "A psychiatric condition where a person is obsessively preoccupied with one or more perceived flaws in their physical appearance that are either minor or entirely unnoticeable to others. It is a brain-based disorder characterized by severe distress and time-consuming, repetitive behaviors."},
  32: { diagnosis: "Depression", description: "A medical mood disorder characterized by a persistent feeling of sadness, emptiness, or loss of interest in daily life that lasts for at least two weeks. It is a complex condition involving biological, psychological, and social factors rather than a simple sign of personal weakness."}
};
