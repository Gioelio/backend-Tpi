# backend-Tpi
## query calls
```
/utenti - put (registrazione)
body:{
  nome: ...,
  cognome: ...,
  email: ...,
  password: ...,(in chiaro, md5 lato  server)
}
/utenti - post (login)
body: {
  email: ...,
  password: ..., (in chiaro)
}
/prenotazione - post (aggiunge prenotazione)
authentication: 'Bearer ' + token
body: {
  dataInizio: ...,
}
/prenotazione - get
authentication: 'Bearer ' + token
```
