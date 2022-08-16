const express =  require("express");
const app = express();
const bodyParser = require("body-parser");
const session = require("express-session");
const connection = require("./database/database");

const categoriesController = require("./categories/CategoriesController");
const articlesController = require("./articles/ArticlesController");
const usersController = require("./users/UsersController");

const Article = require("./articles/Article");
const Category = require("./categories/Category");
const User = require("./users/User");

//view engine
app.set('view engine','ejs');

//Sessions
app.use(session({
    secret: "qualquercoisa", cookie: {maxAge: 3000000}
}))

//body parser
app.use(bodyParser.urlencoded({extend: false}));
app.use(bodyParser.json());

//estatic
app.use(express.static('public'));

//Database
connection
    .authenticate()
    .then(() => {
        console.log("Conexão com o Banco de Dados executada com sucesso!");
    }).catch((error) => {
        console.log(error);
    });


app.use("/", categoriesController);
app.use("/", articlesController);
app.use("/", usersController);

app.get("/session", (req, res) => {
    req.session.treinamento = "formação node.js"
    req.session.ano = 2019
    req.session.email = "victor@email.com"
    req.session.user = {
        username: "victorlima",
        email: "email@teste.com",
        id: 10
    }
    res.send("sessão gerada")
});

app.get("/leitura", (req, res) => {
    res.json({
        treinamento: req.session.treinamento,
        ano: req.session.ano,
        email: req.session.email,
        user: req.session.user
    })
});

app.get("/", (req, res) => {
    Article.findAll({
        order: [['id','DESC']], limit: 4
    }).then(articles => {
        Category.findAll().then(categories => {
            res.render("index", {articles: articles, categories: categories}) 
        })
    });
})

app.get("/:slug", (req, res) => {
    var slug = req.params.slug;
    Article.findOne({
        where: {
            slug: slug
        }
    }).then(article => {
        if(article != undefined) {
            Category.findAll().then(categories => {
                res.render("articles", {article: article, categories: categories}) 
            })
        }else{
            res.redirect("/")
        }
    }).catch( err => {
        res.redirect("/")
    })
})

app.get("/category/:slug",(req, res) => {
    var slug = req.params.slug;

    Category.findOne({

        where: {slug: slug}, 
        include: [{model: Article}]

    }).then(category => {

        if(category != undefined) {

            Category.findAll().then(categories => {
                res.render("index",{articles: category.articles, 
                                    categories: categories});
            })    

        }else{
            res.redirect("/")
        }

    }).catch( err => {
        res.redirect("/")
    })
})

app.listen(8080, () => {
    console.log("O servidor está rodando!")
})