// mail system set up
const transporter = nodemailer.createTransport({
    host:"smtp.gmail.com",
    port:587,
    secure:false,
    Auth:{
      user: "abiodunonaolapi@gmail.com",
      pass: "#",
    },
});
// create a function for that
async function main(email){
    const info = await transporter.sendMail({
        from:'"admin"<abiodunonaolapi@gmail.com>',
        to:email,
        subject:"register successfully",
        html:"<h3>registration in progress</h3>"
    })
    console.log("message sent:", info.messageId);
}

<!-- login cred -->
if(feedback){
                const reguser = await _conn.db(process.env.DB_NAME).collection(tbname).insertOne(user_data)
                if(reguser){
                    jwt.sign(user_data, "reguser", async(error, token)=>{
                        if(error){
                            res.status(401).send({
                                message:"unauthorize user"
                            })
                        }else{
                            const krypt = await bcrypt.hash(password, 10)
                           res.cookie("user", krypt, {secure:true, httpOnly:true})
                            // res.send({
                            //     message:"encrypted",
                            //     mapper:krypt
                            // })
                            res.render("login")
                        }
                    })
                }else{
                    res.status(401).send({
                        message:"user unable to register"
                    })
                }  
            }else{
                res.status(401).send({
                    message:"unable to connect to database"
                })
            }   

<!--  -->
// create admin route
server.get("/admin-dash", async function(req, res){
    res.render("dashboard")
})
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'public/uploads')
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname)
    }
})
var upload = multer({ storage: storage })
server.post('/profile-upload-single', upload.single('profile-file'), function (req, res, next) {
    // req.file is the `profile-file` file
    // req.body will hold the text fields, if there were any
    // console.log(JSON.stringify(req.file.filename))
    var response = '<a href="/">Home</a><br>'
    response += "Files uploaded successfully.<br>"
    response += `<img src="/uploads/${req.file.filename}" /><br>`
    // return res.send(response)
  })

  <!-- frontend -->
<!-- <form action="/profile-upload-single" method="post" enctype="multipart/form-data">
            <div>
                <label>Upload profile picture</label>
                <input type="file" name="profile-file" required/>
            </div>
            <div>
                <input type="submit" value="Upload" />
            </div>
        </form> -->
