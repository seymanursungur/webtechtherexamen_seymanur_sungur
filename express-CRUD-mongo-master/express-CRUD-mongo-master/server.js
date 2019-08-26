const express = require('express');
const bodyParser= require('body-parser');
const app = express();
const MongoClient = require('mongodb').MongoClient;
var db;
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'));
app.use(bodyParser.json());

const fs = require('fs')
let jsonData = JSON.parse(fs.readFileSync('overtreidingen.json', 'utf-8'));

MongoClient.connect('mongodb://localhost:27017/examen', (err, client) => {
    if (err) return console.log(err);
    db = client.db('examen');

    app.listen(3000, () => {console.log('listening on 3000')
    })
});

app.get('/', (req, res) => {
    res.redirect('/list')
});

app.get('/list', (req, res) => {
    db.collection('overtredingen').find().toArray((err, result) => {
        if (err) return console.log(err);
        res.render('list.ejs', { people: result })
    })
});


app.get('/search', (req, res) => {
    res.render('search.ejs', { product: '' })
});

app.post('/search', (req, res) => {
    var query = { firstname: req.body.firstname }
    db.collection('person').find(query).toArray(function(err, result) {
        if (err) return console.log(err);
        if (result == '')
            res.render('search_not_found.ejs', {});
        else
            res.render('search_result.ejs', { person: result[0] })
        var searchname=function(x, opnameplaats_straat){
            var result=[];
            for(var i = 0; i < x.length; i++) {
                if (x[i]['name'].indexOf(opnameplaats_straat)>-1){
                    result.push(x[i]['name']);
                }
            }
            return result;
        }
    });

    app.get('/searchopnameplaats', (req, res) => {
        res.render('search-opnameplaats.ejs', { product: '' })
    });

    app.post('/searchopnameplaats', (req, res) => {
        var query = { firstname: req.body.firstname }
        db.collection('person').find(query).toArray(function(err, result) {
            if (err) return console.log(err);
            if (result == '')
                res.render('search_not_found.ejs', {});
            else
                res.render('search_result.ejs', { person: result[0] })
            var searchname=function(x, opnameplaats_straat){
                var result=[];
                for(var i = 0; i < x.length; i++) {
                    if (x[i]['name'].indexOf(opnameplaats_straat)>-1){
                        result.push(x[i]['name']);
                    }
                }
                return result;
            }
        });

    });

});
