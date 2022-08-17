const express = require("express");
const router = express.Router();
const User = require("./User");
const bcrypt = require('bcryptjs')

router.get("/admin/users",(req, res) => {
    User.findAll().then(users => {
        //res.json({users});
        res.render("admin/users/index",{users: users});
    });
});

router.get("/admin/users/create",(req, res) => {
    res.render("admin/users/create");
});

router.post("/users/create", (req, res) => {
    var email = req.body.email;
    var senha = req.body.senha;

    User.findOne({
        where:{email: email}
    }).then( user => {
        // se o email n for nulo é cadastrado
        if(user == undefined) {  
            var salt = bcrypt.genSaltSync(10);
            var hash = bcrypt.hashSync(senha, salt);

            User.create({
                email: email,
                senha: hash
            }).then(() => {
                res.redirect("/");
            }).catch((err) => {
                res.redirect("/");
            });
        // se o email for nulo redireciona   
        }else{
            res.redirect("/admin/users/create");
        }
    }); 
});

router.get("/login", (req, res) => {
    res.render("admin/users/login");
});

router.get("/logout", (req, res) => {
    req.session.user = undefined;
    res.redirect("/");
});

router.post("/authenticate", (req, res) => {
    var email = req.body.email;
    var senha = req.body.senha;

    User.findOne({
        where: {email: email}
    }).then(user => {
        if(user != undefined) { //se existe um usuario com esse mail
            //validar senha
            var correct = bcrypt.compareSync(senha, user.senha);
            if(correct) {
                req.session.user = {
                    id: user.id,
                    email: user.email
                }
                res.redirect("/admin/articles");
            }else{
                res.redirect("/login");
            }
        }else{
            res.redirect("/login");
        }
    });
});

module.exports = router;