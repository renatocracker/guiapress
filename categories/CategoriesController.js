const express = require("express");
const Category = require("./Category");
const router = express.Router();
const slugify = require("slugify");


router.get("/admin/categories/new", (req,res) => {
    res.render("admin/categories/new");
});

router.post("/categories/save", (req, res) => {
    var title = req.body.title;

    if(title != undefined){

        Category.create({
            title: title,
            slug: slugify(title)  // "Computação e informática"  => "computacao-e-informatica"
        }).then(() => {
            res.redirect("/");
        })

    }else{
        res.redirect("/admin/categories/new")
    }
})

router.get("/admin/categoreis", (req, res) => {

    Category.findAll().then(categories => {
        res.render("admin/categories/index", {categories: categories});
    })    
});

module.exports = router;