const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bcryptjs = require('bcryptjs');

//This is the crete key to create a token
const jwt = require("jsonwebtoken")
const JWT_SECRET = "abcdefghijklmnopqrstuvwxyz"

const app = express();

app.use(express.json());
app.use(express.urlencoded());
app.use(cors());
 
//*************Connect to the nodejs to mongoDb************** */

mongoose.set('strictQuery', false)
mongoose.connect("mongodb+srv://LalitaMahule:lali123456789@cluster0.ypjvt.mongodb.net/Assignment-stackLab?retryWrites=true&w=majority", {
    useNewUrlParser: true
})
    .then(() => console.log("MongoDB is connected"))
    .catch((err => console.log(err)))


//**************Listen the server on 5000 port************ */
app.listen(5000, () => {
    console.log("server Started");
})


// app.post("/post", async (req, res) => {
//     console.log(req.body);
//     const { data } = req.body;
//     try {
//         if (data == "abc") {
//             res.send({ status: "ok" })
//         } else {
//             res.send({ status: "user not found" })
//         }
//     } catch (error) {
//         res.send({ status: "Somthing went wrong try again" })
//     }

// })

//******************Requires of the schema***** */

require('./userDetails');
 //*************Model of the schema**** */
const User = mongoose.model("UserInfo");

//**************Regsitreation of the user********************* */

app.post('/register', async (req, res) => {
    const { name, email, password, phoneNo, address } = req.body;
    const encryptedPassword = await bcryptjs.hash(password, 10);

    try {
        const oldUser = await User.findOne({ email });

        if (oldUser) {
            return res.send({ error: "user Exist" })
        }
        await User.create({
            name: name,
            email,
            password: encryptedPassword,
            phoneNo,
            address
        });
        res.send({ status: "ok" })
    } catch (error) {
        res.send({ status: "error" })
    }
})

//****************Login of the user******************* */

app.post("/login-user", async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
        return res.json({ error: "User Not found" });
    }
    if (await bcryptjs.compare(password, user.password)) {
        const token = jwt.sign({ email: user.email }, JWT_SECRET)
        if (res.status(201)) {
            return res.json({ status: "ok", data: token });
        } else {
            return res.json({ error: "error" });
        }
    }
    res.json({ status: "error", error: "InvAlid Password" });
});

//**************Show the user data in dashboard************Name and email only */
app.post("/userData", async (req, res) => {
    const { token } = req.body;
    try {
        const user = jwt.verify(token,JWT_SECRET);
        const useremail = user.email;
        User.findOne({email:useremail}).then((data) =>{
            res.send({status:"ok", data:data})
        }).catch((error) =>{
            res.send({status:"error", data:error})
        });
    } catch (error) { }
});

app.get("/getAlluser", async(req,res)=>{
    try{
        const allUser = await User.find({});
        res.send({status:"ok", data: allUser})
    }catch(error){
        console.log(error)
    }
})




