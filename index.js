const express = require('express');
const handlebars = require('express-handlebars');
const app = express();
app.engine('handlebars', handlebars.engine({
    defaultLayout: 'main'
}));

app.set('view engine', 'handlebars');
app.get('/', (req, res) => {
    res.render('home');
});
app.get('/dashboard', (req, res) => {
    res.render('dashboard');
});
app.get('/login', (req, res) => {
    res.render('login');
});
app.get('/logout', (req, res) => {
    res.render('login');
});
app.listen(3000, () => {
    console.log('The web server has started on port 3000');
});