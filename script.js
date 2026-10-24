// ВСТАВЬТЕ ССЫЛКУ ИЗ GOOGLE APPS SCRIPT (заканчивается на /exec)
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzR-Y1yXIENYjiOyE_3w6ScEZrDTNQdGXFLRKHxMKIClP_iTrhYK1YfVq_644pBDq-CDw/exec";

const questions = [
    { q: "Someone who is lazy and spends a lot of time watching TV is a...", options: ["Bookworm", "Couch Potato", "Night Owl", "Big Cheese"], answer: 1 },
    { q: "Someone who wakes up early and is most active in the morning is an...", options: ["Early Bird", "Night Owl", "Cold Fish", "Smart Cookie"], answer: 0 },
    { q: "Someone who stays up late and is active at night is a...", options: ["Early Bird", "Couch Potato", "Night Owl", "Big Mouth"], answer: 2 },
    { q: "A clever and intelligent person is a...", options: ["Big Mouth", "Smart Cookie", "Bookworm", "Cold Fish"], answer: 1 },
    { q: "An important or influential person in a group is a...", options: ["Big Cheese", "Bookworm", "Big Mouth", "Night Owl"], answer: 0 },
    { q: "A person who loves reading and spends a lot of time with books is a...", options: ["Smart Cookie", "Bookworm", "Cold Fish", "Couch Potato"], answer: 1 },
    { q: "What does the idiom 'Break the ice' mean?", options: ["To break something cold", "To start a conversation", "To make someone angry", "To tell a secret"], answer: 1 },
    { q: "If a task is 'a piece of cake', it is...", options: ["Very difficult", "Very sweet", "Very easy", "Very expensive"], answer: 2 },
    { q: "What does 'Hit the hay' mean?", options: ["To work hard", "To go to sleep", "To eat something", "To hit someone"], answer: 1 },
    { q: "If someone says 'Break a leg!' before a performance, they wish you...", options: ["To get injured", "To fail", "Good luck", "To be late"], answer: 2 }
];

let currentQuestion = 0;
let score = 0;
let userAnswersText = []; // Храним тексты выбранных ответов
let selectedOption = null;

function startTest() {
    document.getElementById('start-screen').style.display = 'none';
    document.getElementById('quiz-screen').style.display = 'block';
    loadQuestion();
}

function loadQuestion() {
    selectedOption = null;
    const q = questions[currentQuestion];
    document.getElementById('question-text').innerText = `Вопрос ${currentQuestion + 1} из 10: ${q.q}`;
    const optionsContainer = document.getElementById('options-container');
    optionsContainer.innerHTML = '';
    
    q.options.forEach((option, index) => {
        const div = document.createElement('div');
        div.className = 'option';
        div.innerText = option;
        div.onclick = () => selectOption(index, div);
        optionsContainer.appendChild(div);
    });
    document.getElementById('next-btn').style.display = 'none';
}

function selectOption(index, element) {
    const options = document.querySelectorAll('.option');
    options.forEach(opt => opt.classList.remove('selected'));
    element.classList.add('selected');
    selectedOption = index;
    document.getElementById('next-btn').style.display = 'inline-block';
}

function nextQuestion() {
    if (selectedOption === null) return;
    
    // Сохраняем текст выбранного ответа
    const selectedText = questions[currentQuestion].options[selectedOption];
    userAnswersText.push(selectedText);
    
    // Проверяем правильность
    if (selectedOption === questions[currentQuestion].answer) {
        score++;
    }
    
    currentQuestion++;
    
    if (currentQuestion < questions.length) {
        loadQuestion();
    } else {
        finishTest();
    }
}

function finishTest() {
    document.getElementById('quiz-screen').style.display = 'none';
    document.getElementById('result-screen').style.display = 'block';
    
    const percentage = Math.round((score / questions.length) * 100);
    document.getElementById('result-text').innerText = `Вы ответили правильно на ${score} из ${questions.length} вопросов (${percentage}%).`;

    if (SCRIPT_URL && SCRIPT_URL !== "ВАША_ССЫЛКА_ИЗ_APPS_SCRIPT") {
        
        // Создаем невидимый iframe (чтобы страница не перезагружалась)
        const iframe = document.createElement('iframe');
        iframe.name = 'hidden_iframe';
        iframe.style.display = 'none';
        document.body.appendChild(iframe);

        // Создаем скрытую форму для отправки данных в Google Script
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = SCRIPT_URL;
        form.target = 'hidden_iframe'; 

        // Функция добавления полей
        const appendData = (name, value) => {
            const input = document.createElement('input');
            input.type = 'hidden';
            input.name = name;
            input.value = value;
            form.appendChild(input);
        };

        // Заполняем данные (отправляем ТЕКСТЫ ответов)
        appendData('score', score);
        appendData('total', questions.length);
        appendData('q1', userAnswersText[0] || '');
        appendData('q2', userAnswersText[1] || '');
        appendData('q3', userAnswersText[2] || '');
        appendData('q4', userAnswersText[3] || '');
        appendData('q5', userAnswersText[4] || '');
        appendData('q6', userAnswersText[5] || '');
        appendData('q7', userAnswersText[6] || '');
        appendData('q8', userAnswersText[7] || '');
        appendData('q9', userAnswersText[8] || '');
        appendData('q10', userAnswersText[9] || '');

        document.body.appendChild(form);
        
        // Отправляем форму
        form.submit();

        // Показываем сообщение об успехе
        document.getElementById('saving-status').innerText = "✅ Результаты отправлены в таблицу!";
        document.getElementById('saving-status').style.color = "green";

    } else {
        document.getElementById('saving-status').innerText = "⚠️ Вы не указали ссылку на Google Script.";
        document.getElementById('saving-status').style.color = "red";
    }
}
