const express = require("express");
const app = express();
const path = require('path');
app.use(express.static(path.join(__dirname, 'public')));
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.set('view engine', 'ejs');
const upload = require('express-fileupload');
const { readdirSync } = require("fs");
app.use(upload());




app.get('/', (req, res, next) => {
    res.render('landing');
});





app.post('/text', (req,res,next) => {
    let text = req.body.passage;
    console.log(text);
});



app.post('/audio', (req,res,next) => {
    let file = req.files.audio;
    let filename = file.name;
    file.mv('./uploads/'+filename);
});



app.post('/video', (req,res,next) => {
    let file = req.files.video;
    let filename = file.name;
    file.mv('./uploads/'+filename);
});



// call python here and get summary, points, and questions

app.post('/summary', (req, res, next)=>{
    questionIndex = -1;
    res.render('summary', { passage: {title: req.body.title, passage: req.body.passage} } );
});




let questions = [ {number: 1, question: 'the question 1'}, {number: 2, question: 'the question 2'}, {number: 3, question: 'the question 3'} ];
let questionIndex = -1;
//start the quiz

app.post('/quiz', (req, res, next) => {
    questionIndex += 1;
    let length = questions.length;
    if(questionIndex >= length){
        questionIndex = -1;
        res.redirect('/quiz-over');
    }
    let question = questions[ questionIndex ];
    res.render('quiz', {question});
});













app.listen(3000);