const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
// const bcrypt = require("bcryptjs");
require("../db/conn");

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

var cors = require("cors");
router.use(cors());

const User = require("../model/userSchema");
const Product = require("../model/userProduct");
const Message = require("../model/userMessage");

//Routes
router.post("/login", (req, res) => {
    console.log(req.body);
    const { username, password } = req.body
   User.findOne({ username: username }, (err, user) => {
        if (user) {
            // const isMatch =  bcrypt.compare(password, user.password)
            if (password === user.password) {

                res.send({ message: "Login Successful", user: user })
            } else {
                res.send({ message: "Password didn't match" })
            }
        } else {
            res.send({ message: "User not registered" })
        }
    })
})
router.post("/getSingleProduct", (req, res) => {
    console.log(req.body, 'hello');
    const { pid } = req.body
    console.log(req.body);
    // console.log(username);
    Product.findOne({ pid: pid }, (err, data) => {
        if (data) {
            res.send({message: "Product", data});
        } else {
            res.send({ message: "Product not found." })
        }
    })
})

router.post("/contact", (req, res) => {
    const { name, username, message } = req.body
    // console.log(username);
    // console.log(message);
    const user = new Message({
        name,
        username,
        message
    })

    user.save(err => {
        if (err) {
            res.send(err)
        } else {
            res.send({ message: "Message deleivered successfully. Thank you!" })
        }
    })
})

router.post("/register", (req, res) => {
    const { name, email, phone, address, username, password } = req.body
    User.findOne({ username: username }, (err, user) => {
        if (user) {
            res.send({ message: "User already registerd" })
        } else {
            const user = new User({
                name,
                email,
                phone,
                address,
                username,
                password
            })
            //user.password = bcrypt.hash(user.password,10);
            user.save(err => {
                if (err) {
                    res.send(err)
                } else {
                    res.send({ message: "Successfully Registered, Please login now." })
                }
            })
        }
    })

})

router.post("/addproduct", (req, res) => {
    const { pid,name,
        username,
        company,
        category,
        color,
        address,
        mfg,
        expiry } = req.body
    
    // console.log(expiry);
    const user = new Product({
        pid,
        name,
        username,
        company,
        category,
        color,
        address,
        mfg,
        expiry
    })
    user.save(err => {
        if (err) {
            res.send(err)
        } else {
            res.send({ message: "Successfully Added" })
        }
    })

})


router.post("/fetchproducts", (req, res) => {
    const { username } = req.body
    // console.log(req.body);
    // console.log(username);
    Product.find({ username: username }, (err, user) => {
        if (user) {
            res.send(user);
        } else {
            res.send({ message: "No products added" })
        }
    })
})



//update product data
router.put("/update", (req, res) => {
    const {id, name,username,company, category, color, mfg,expiry } = req.body
    //cors.log(id);
    try {
         Product.findById(id, (err, item) => {
            item.name = name
            item.category = category
            item.color = color
            item.mfg = mfg
            item.expiry = expiry
            item.save(err => {
                if (err) {
                    res.send(err)
                } else {
                    res.send({ message: "Successfully updated" })
                }
            })
        })
    } catch (err) {
        console.log(err);
    }
});

router.delete("/delete/(:id)", (req, res) => {
    const id = req.params.id;
    console.log(id);
    try{
    Product.findOneAndDelete({pid: req.params.id}).exec();
    res.send({ message: "Item sold" })
    }catch(err){
        console.log(err);
    }
})
module.exports = router;