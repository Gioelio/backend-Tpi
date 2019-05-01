const express = require('express');
const bodyParser = require('body-parser');
const bearerToken = require('express-bearer-token');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('asymmetric-crypto');
const keyPair = crypto.keyPair();
const cors = require('cors');
const jsonParser = bodyParser.json();

const app = express();

app.use(cors());
app.use(bodyParser.json({ type: 'application/*+json' }))
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

app.route('/utenti')
    .put(jsonParser,(req, res)=>{
        console.log(req.body);
        var email = req.body.email;
        bcrypt.genSalt(10, (err, salt)=>{
            bcrypt.hash(req.body.password, salt,(err, hash)=>{
                db.run('INSERT INTO Utente VALUES (?,?,?,?)', [req.body.nome, req.body.email, hash, req.body.cognome], (err)=>{
                    if(err) {res.json({'error': 'errore nella registrazione'})}
                    res.status(200).json({'token': jwt.sign({'email': email}, keyPair.secretKey)}) //inserire dati nel token jwt
                })
            })
        })
    })
    .post(jsonParser, (req,res) =>{

        db.all('SELECT * FROM Utente WHERE email = ?', [req.body.email], (err, result) =>{
            if(err) throw err;
            var email = req.body.email;
            if(result.length === 0)
                res.json({error: 'Non esiste nessun utente registrato con questa email'});
            else
                bcrypt.compare(req.body.password, result[0].password, (err, resCompare)=>{
                    if(resCompare){
                        console.log('le password corrispondono')
                        res.json({'token': jwt.sign({'email': email}, keyPair.secretKey)})
                    }
                    else res.json({'error': 'le password non corrispondono'})
                })
        })
    })



app.listen(3000, () => console.log('server started'));