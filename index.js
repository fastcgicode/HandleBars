const express = require('express');
const handlebars = require('express-handlebars');
const app = express();
app.engine('handlebars', handlebars.engine({
    defaultLayout: 'main'
}));
app.use(express.urlencoded({ extended: true }));
const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require('./config/connection');

sequelize.authenticate().then(() => {
    console.log('Connection has been established successfully.');
}).catch((error) => {
    console.error('Unable to connect to the database: ', error);
});

const blogPosts = sequelize.define("BlogPosts", {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    author_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    blog_post: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 10
    }
});

sequelize.sync().then(() => {
    console.log('BlogPosts table created successfully!');
    blogPosts.create({
        author_name: "Guest",
        blog_post: "Hello Blog"
    }).then(res => {
        console.log('Blog post added')
    }).catch((error) => {
        console.error('Failed to create a new record : ', error);
    });
}).catch((error) => {
    console.error('Unable to create table : ', error);
});

app.set('view engine', 'handlebars');
app.get('/', (req, res) => {
    sequelize.sync().then(() => {
        blogPosts.findAll().then(results => {
            const resultDocuments = results.map(result => ({ createdAt: result.createdAt, author_name: result.author_name, blog_post: result.blog_post }))
            res.render('home', { layout: 'main', results: resultDocuments });
        }).catch((error) => {
            console.error('Failed to retrieve data : ', error);
        });
    }).catch((error) => {
        console.error('Unable to create table : ', error);
    });
});
app.get('/dashboard', (req, res) => {
    res.render('dashboard');
});
app.post('/post', (req, res) => {
    if (req.body.author_name && req.body.blog_post) {
        blogPosts.create({
            author_name: req.body.author_name,
            blog_post: req.body.blog_post
        }).then(res => {
            console.log('Blog post added')
        }).catch((error) => {
            console.error('Failed to create a new record : ', error);
        });
    }
    res.redirect('/');
});
app.get('/login', (req, res) => {
    res.render('login');
});
app.get('/logout', (req, res) => {
    res.redirect('/login');
});
app.listen(3000, () => {
    console.log('The web server has started on port 3000');
});