const express = require('express');
const bodyParser = require('body-parser');
const bearerToken = require('express-bearer-token');

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



app.listen(3000, () => console.log('server started'));