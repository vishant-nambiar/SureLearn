const express = require("express");
const app = express();
const path = require('path');
app.use(express.static(path.join(__dirname, 'public')));
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.set('view engine', 'ejs');
const upload = require('express-fileupload');
const { readdirSync, readFileSync } = require("fs");
app.use(upload());




app.get('/', (req, res, next) => {
    res.render('landing');
});






let object;

app.post('/text', (req,res,next) => {
    let text = req.body.passage;
    object = 0;
    const spawn = require("child_process").spawn;
        const process = spawn('python', ["text.py", text]);
        process.stdout.on('data', function(data) {
            object = JSON.parse(data);
            object.title = req.body.title;
            console.log(object);
        });
    function wait(){
        if(object == 0){
            setTimeout(wait, 100);
        } else {
            res.redirect('/summary');
        }
    }
    wait();
});


app.post('/audio', (req,res,next) => {
    let file = req.files.audio;
    let filename = file.name;
    file.mv('./uploads/'+filename);

    object = 0;
    const spawn = require("child_process").spawn;
        let audio = "uploads/" + filename;
        const process = spawn('python', ["audio.py", audio]);
        process.stdout.on('data', function(data) {
            object = JSON.parse(data);
            object.title = req.body.title;
            console.log(object);
        });  
        function wait(){
            if(object == 0){
                setTimeout(wait, 100);
            } else {
                res.redirect('/summary');
            }
        }
        wait();
});


app.post('/video', (req,res,next) => {
    let file = req.files.video;
    let filename = file.name;
    file.mv('./uploads/'+filename);

    object = 0;
    const spawn = require("child_process").spawn;
        let video = "uploads/" + filename;
        const process = spawn('python', ["video.py", video]);
        process.stdout.on('data', function(data) {
            object = JSON.parse(data);
            object.title = req.body.title;
            console.log(object);
        
        });
        function wait(){
            if(object == 0){
                setTimeout(wait, 100);
            } else {
                res.redirect('/summary');
            }
        }
        wait();

});









app.get('/summary', (req, res, next)=>{
    questionIndex = -1;
    checkIndex = -1;
    tempArray = []
    res.render('summary', { object: object } );
});








app.post('/checkYK-start', (req, res, next) => {
    res.render('checkYK-start');
});


let checkIndex = -1;
let checkQuestions = ['1q', '2q'];
app.post('/checkYK', (req, res, next) =>{
    checkQuestions = object.checkYK;
    checkIndex += 1;
    let length2 = checkQuestions.length;
    if(checkIndex >= length2){
        checkIndex = -1;
        res.render('checkYK-over');
    }
    let question = checkQuestions[ checkIndex ];
    res.render('checkYK', {question: question});
});









//object2 is mcq questions
let rawdata = readFileSync('questions.json');
let object2 = JSON.parse(rawdata);
let questions = object2.questions.slice(0,6);
let questionIndex = -1;
let tempArray;
//start the quiz

app.post('/quiz-start', (req, res, next) => {
    res.render('quiz-start');
    tempArray = [];
    questionIndex = -1;
});


app.post('/quiz', (req, res, next) => {
    if(questionIndex != -1){
        let correct = req.body.userCorrect;
        if(correct == 0){
            tempArray.push( questions[ questionIndex ] );
        }
    }
    questionIndex += 1;
    let length = questions.length;
    if(questionIndex >= length){
        questionIndex = -1;
        if( tempArray.length > 0){
            questions = tempArray;
            questionIndex = 0;
            tempArray = []
        } else {
            res.render('quiz-over');
        }
    }
    let question = questions[ questionIndex ];
    res.render('quiz', {question});
});













app.listen(3000);