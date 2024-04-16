const express = require("express")
const server = express()
const bodyParser = require("body-parser")
const mongodb = require("mongodb")
const dotenv = require("dotenv")
dotenv.config()
const cookieParser = require("cookie-parser")
const cors = require("cors")
const jwt = require('jsonwebtoken')
const bcrypt = require("bcrypt")
const multer = require("multer")
const _conn = new mongodb.MongoClient(process.env.DB_URL)
const path = require("path")
const { log } = require("console")
// const nodemailer = require('nodemailer')
server.use(express.static(path.join(__dirname, "public")))
server.use(bodyParser.urlencoded({extended:false}))
server.use(cookieParser())
server.use(cors())
// set engine
server.set("view engine", "ejs")
const dbname = process.env.DB_NAME
const tbname = process.env.TABLE

const authuser = function(req, res, next){
    const bearer_token = req.headers['authorization']
    if(bearer_token == null || type(bearer_token =="undefined")){
        res.status(401).send({
            message:"invalid user data",

        })
    }else{
        const bearer_token_box = bearer_token
        const token = bearer_token_box[1].split(" ")
        req.bearer_token = token
        next()
    }
}

server.get("/", (req, res)=>{
    res.send({
        message:"welcome to the home page"
    })
})

server.get("/register", function(req, res){
    res.render("form")
})

server.post("/register", async function(req, res){
    const firstname = req.body.username.trim()
    const username = req.body.username.trim()
    const email = req.body.email.trim()
    const password = req.body.password.trim()
    const cpwd = req.body.cpwd.trim()
    if(firstname.length>=0 || username.length>=0 || email.length>=0 || password.length>=0 || cpwd.length>=0){
        if(password === cpwd){
            bcrypt.hash(password, 10).then(async(hash)=>{
                const user_data = {
                    firstname:firstname,
                    username:username,
                    email:email,
                    password:hash,
                    cpwd:cpwd
                }
                let feedback = await _conn.db(dbname).collection(tbname).insertOne(user_data)
                if(feedback){
                    const maxAge = 3*60*60;
                    const token = jwt.sign(user_data, "signin", {expiresIn:maxAge});
                    res.cookie("jwt", token, {
                        httpOnly:true,
                        maxAge:maxAge*1000
                    });
                   res.render('login')
                }
            })
        }else{
            res.send({
                message:"password mismatched"
            })
        }
    }else{
        res.status(401).send({
            message:"all field are required"
        })
    }
})

server.post("/login", async function(req, res){
    const email = req.body.email.trim()
    const password = req.body.password.trim()
    if(email.length>=0 || password.length>=0){
       let pass = await _conn.db(dbname).collection(tbname).findOne({email:email})
        const usercred = req.cookies.jwt
        if(pass){
            res.render("dashboard")
        }
        console.log(pass.password);
        // const ismatch = await bcrypt.compare(password, usercred)
        // if(ismatch){

        //   res.render("dashboard")
        // }else{
        //     res.status(401).send({
        //         message:"invalid password"
        //     })
        // }
    }else{
        res.send({
            message:"fill the required field"
        })
    }
})

// log out route
server.get("/admin/logout", function(req, res){
    console.log(req.cookies);
    res.clearCookie("reg_user")
    // res.send({
    //     message:"this is the logout session of admin"
    // })
})
// end logout route
server.get("/dash", function(req, res){
    res.render("dashboard")
})
// upload image middleware
const storage = multer.diskStorage({
    destination:function(req, file, cb){
        cb(null, "public/uploads")
    },
    filename:function(req, file, cb){
        cb(null, file.originalname)
    }
})
var uploads = multer({storage:storage})

// create a route that does the upload process
server.post("/profile-upload-single", uploads.single('profile-file'), async function(req, res, next){
    console.log(req.file.size);
    var response = "profile pics uploaded"
    const img_name = req.file.filename.trim()
    const pdtname = req.body.pdtname.trim()
    const pdtdesc = req.body.pdtdesc.trim()
    const pdtprice = req.body.pdtprice.trim()
    const products = {
        img_name:img_name,
        pdtname:pdtname,
        pdtdesc:pdtdesc,
        pdtprice:pdtprice
    }
    const feed = await _conn.db(process.env.DB_NAME).collection("products").insertOne(products) 
    if(feed){
        res.status(200).send({
            message:"product uploaded successfully",
            type:"success"
        })
    }else{
        res.send({
            message:"unable to upload image"
        })
    }
})
// display product route
server.get("/all-products", async function(req, res){
    const products = await _conn.db(process.env.DB_NAME).collection("products").find().toArray()
    if(products){
        res.status(200).send({
            message:"all products fetched",
            type:"success",
            products:products
        })
    }else{
        res.status(401).send({
            message:"no products available"
        })
    }
})
// delete product by id
server.get("/product/delete", function(req, res){
    res.render("modal")
})
server.post("/product/delete", function(req, res){
    const id = res.body
    console.log(id);
})
// display all registered user
server.get("/view/register", async function(req, res){
    const feedback = await _conn.db(dbname).collection(tbname).find().toArray()
    if(feedback){
        res.status(200).send({
            message: "users registered",
            type:"success",
            feedback:feedback
        })
    }else{
        res.status(401).send({
            message:"user not found"
        })
    }
})

// delete all user
server.get("/delete-user", async function(req, res){
    const feedback = await _conn.db(dbname).collection(tbname).deleteMany()
    if(feedback.deletedCount>0){
        res.status(200).send({
            message:"user data deleted successfully",
            feedback:feedback
        })
    }else{
        res.status(301).send({
            message:"unable to delete"
        })
    }
})
// jquery teaching route
server.get("/jq/teachings", function(req, res){
    res.render("jqdemo")
})

// create server
server.listen(process.env.PORT, function(error){
    if(error){
        console.log("unable to connect");
    }else{
        console.log(`server is live on ${process.env.PORT}`);
    }
})