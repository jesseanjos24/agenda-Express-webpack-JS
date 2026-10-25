require('dotenv').config();
require('dotenv').config({ path: 'atlas-credentials.env' });

const express = require('express');
const app = express();
const mongoose = require('mongoose');

// Evita erro de resolução DNS SRV (querySrv ECONNREFUSED) comum no Windows
const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);

const connectionString = process.env.CONNECTIONSTRING || process.env.MONGODB_URI;

mongoose.connect(connectionString)
    .then(() => {
        console.log('Conectado ao MongoDB com sucesso!');
        app.emit('pronto');
    })
    .catch(e => console.log('Erro ao conectar ao MongoDB:', e));

const session = require('express-session');
const MongoStore = require('connect-mongo').default || require('connect-mongo');
const flash = require('connect-flash');

const routes = require('./routes');
const path = require('path');
const { middlewareGlobal, checkCsrfError, csrfMiddleware } = require('./src/middleware/middleware');

const helmet = require('helmet');
const csurf = require('csurf');

let porta = 3001;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Arquivos estaticos
app.use(express.static(path.resolve(__dirname, 'public')));

const sessionOptions = session({
    secret: 'oijksdtrhmcnkfhgjHelojsd@s6¨$4335723`v)_',
    store: MongoStore.create({ mongoUrl: process.env.CONNECTIONSTRING || process.env.MONGODB_URI }),
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7,
        httpOnly: true
    }
});
app.use(sessionOptions);
app.use(flash());

app.use(helmet({
    contentSecurityPolicy: false,
}));

app.set('views', path.resolve(__dirname, 'src', 'views'));
app.set('view engine', 'ejs');

// Nossos Próprios middlewares
app.use(csurf());

app.use(middlewareGlobal);
app.use(checkCsrfError); 
app.use(csrfMiddleware);
app.use(routes);

// O servidor só escuta depois que o MongoDB estiver conectado
app.on('pronto', () => {
    app.listen(porta, () => {
        console.log(`Acesse http://localhost:${porta}`);
        console.log(`Rodando o servidor na Porta ${porta}`);
    });
});
