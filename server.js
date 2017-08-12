/**
 * Created by blackmamba on 07/08/17.
 */

var express = require('express');
var app = express();
var path = require('path');
var db = require('./db_functions.js')

var connect = require('connect');

var bodyParser = require('body-parser');

app.set('views', './views')
app.set('view engine', 'jade')

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

app.use(express.static(path.join(__dirname, 'client')));
var html_dir = __dirname+'/client/'

app.get('/', function(req, res){
    res.sendFile(html_dir+'index.html');
});

app.get('/query', function (req, res) {
    console.log(req.query.value)

    if(req.query.value.agenzia == 'Hintown'){
        if(req.query.value.data.indexOf('-')>-1){
            db.queryDayMonthYearHintownDb(res, req.query.value.data)
        }
        else{
            db.queryMonthYearHintownDb(res, req.query.value.data)
        }
    }
    else {
        if(req.query.value.data.indexOf('-')>-1)
            db.queryDayMonthYearBacciniDb(res, req.query.value.data)
        else
            db.queryMonthYearBacciniDb(res, req.query.value.data)
    }
    //res.render('query', { title: 'Hey', message: 'Hello there!'});
});

app.get('/hintown', function(req, res){
    res.send('http://localhost:3000/hintown.html')
})

app.get('/baccini', function(req, res){
    res.send('http://localhost:3000/baccini.html')
})

app.get('/pageQuery', function(req, res){
    res.send('http://localhost:3000/queryAgenzia.html')
})

app.get('/pageAgenzia', function(req, res){
    res.send('http://localhost:3000/agenzieInserimentoDati.html')
})

app.get('/agenzieVisualizzaDati', function(req, res){
    res.send('http://localhost:3000/agenzieVisualizzaDati.html')
})

app.post('/updateValuesHintown', function (req, res) {
    db.persistenceValuesHintown(req.body, res)
})

app.post('/updateValuesBaccini', function (req, res) {
    db.persistenceValuesBaccini(req.body, res)
})

app.get('/queryRegistro', function (req, res) {
    console.log(req.query.value)

    if(req.query.value.data.indexOf('-')>-1){
        console.log('ciao')
        db.queryRegistroDayMonthYear(res, req.query.value)
    }
    else{
        db.queryRegistroMonthYear(res,req.query.value)
    }
})

app.post('/updateRegistro', function (req, res) {
    db.persistenceRegistro(res,req.body)
})

app.get('/getApartamenti', function (req, res) {
    console.log(req.query.id)
    db.queryGetApartaments(res, req.query.id)
})

app.listen(3000, function () {
    console.log('App listening on port 3000!')
});