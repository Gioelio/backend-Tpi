const express = require('express');
const bodyParser = require('body-parser');
const bearerToken = require('express-bearer-token');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();

app.use(bearerToken({
    bodyKey: 'access_token',
    queryKey: 'access_token',
    headerKey: 'Bearer',
    reqKey: 'token',
    cookie: false,
}));

const sqlite3 = require('sqlite3');//importa la libreria
var db = new sqlite3.Database('./DATABASE.sqlite3',(err) =>{
  if(err)
  console.error(err.message)
  console.log('connessione riuscita')
} );//crea la connessionea


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static('public'));

app.get('/', (req, res) => {
	res.send('Hello Express app');
});

app.route('/registration')
    .post((req, res)=>{
        //req.nome, req.cognome, req.numero, req.password
        bcrypt.genSalt(10, (err, salt)=>{
            bcrypt.hash(req.password, salt,(err, hash)=>{
                db.run('INSERT INTO Utente (?,?,?,?)', [req.nome, req.cognome, req.numero, hash], (err)=>{
                    if(err) res.staus(404).end()
                    res.status(200).send(jwt.sign({})) //inserire dati nel token jwt
                })
            })
        })
    })
    .get((req,res) =>{

    })



app.listen(3000, () => console.log('server started'));