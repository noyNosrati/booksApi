const express = require("express");
const { BookModel, validateBook } = require("../models/bookModel")
const { auth } = require("../middlewears/auth");
const router = express.Router();

router.get("/", async (req, res) => {
    try {
        let data = await BookModel.find({});
        res.status(201).json(data);
    }
    catch (err) {
        console.log(err);
        res.status(502).json({ err });
    }
})


router.get("/search", async(req, res) => {
    let s = req.query.s;
    let perPage = req.query.perPage ? Math.min(req.query.perPage, 10) : 10;
    let page = req.query.page ? req.query.page - 1 : 0;
    let myFilter = {};
    if (s) {
        let searchExp = new RegExp(s, "i");
        myFilter = { $or:[{ name: searchExp },{ info: searchExp }]};
    }
    try {
        let data = await BookModel
            .find(myFilter)
            .limit(perPage)
            .skip(perPage * page);
        res.status(201).json(data);
    }

    catch (err) {
        console.log(err);
        res.status(502).json({ err });
    }
})

router.get("/category/:catName", async (req, res) => {
    let perPage = req.query.perPage ? Math.min(req.query.perPage, 10) : 10;
    let page = req.query.page ? req.query.page - 1 : 0;
    let cat = req.params.catName;
    try {
        let data = await BookModel
            .find({ category: cat })
            .limit(perPage)
            .skip(perPage * page);
        res.status(201).json(data);
    }
    catch (err) {
        console.log(err);
        res.status(502).json({ err });
    }
})


router.get("/prices", async (req, res) => {
    let perPage = req.query.perPage ? Math.min(req.query.perPage, 10) : 10;
    let page = req.query.page ? req.query.page - 1 : 0;
    let min = req.query.min || 0;
    let max = req.query.max || 99999;
    try {
        let data = await BookModel
            .find({ price: { $gte: min, $lte: max } })
            .limit(perPage)
            .skip(perPage * page);
        res.status(201).json(data);
    }
    catch (err) {
        console.log(err);
        res.status(502).json({ err });
    }
})


router.get("/single/:id", async (req, res) => {
    let id = req.params.id;
    try {
        let data = await BookModel.find({ _id: id });
        res.status(201).json(data);
    }
    catch (err) {
        console.log(err);
        res.status(502).json({ err });
    }
})

router.post("/", auth, async (req, res) => {
    let validBody = validateBook(req.body);
    if (validBody.error) {
        return res.status(400).json(validBody.error.details);
    }
    try {
        let book = new BookModel(req.body);
        book.user_id = req.tokenData._id;
        await book.save();
        res.status(201).json(book)
    }
    catch (err) {
        console.log(err);
        res.status(502).json({ err })
    }
})

router.put("/:editId", auth, async (req, res) => {
    let validBody = validateBook(req.body);
    if (validBody.error) {
        return res.status(400).json(validBody.error.details);
    }
    try {
        let editId = req.params.editId;
        let data;
        if(req.tokenData.role == "ADMIN"){
         data = await BookModel.updateOne({ _id: editId}, req.body);
        }
        else{
         data = await BookModel.updateOne({ _id: editId, user_id: req.tokenData._id }, req.body);
        }

        res.status(201).json(data);
    }
    catch (err) {
        console.log(err);
        res.status(502).json({ err })
    }

})
router.delete("/:delId", auth, async (req, res) => {
    try {
        let delId = req.params.delId;
        let data;
        if(req.tokenData.role == "ADMIN"){
            data = await BookModel.deleteOne({_id:delId});
        }
        else{
            data = await BookModel.deleteOne({_id:delId , user_id:req.tokenData._id});
        }
        res.status(201).json({data});
    }
    catch(err){
        res.status(502).json({err});
    }
  })


module.exports = router;