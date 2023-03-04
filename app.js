const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bcryptjs = require('bcryptjs');
const { isValidName, isValidEmail, isValidMobile, isValidPassword, isValidObjectId, isValid, isValidNumber } = require('./validation/valid')

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


//******************Requires of the schema***** */

require('./userDetails');
//*************Model of the schema**** */
const User = mongoose.model("UserInfo");

//**************Regsitreation of the user********************* */

app.post('/register', async (req, res) => {
    try {
        const data = req.body
        const { name, email, password, phoneNo, address, userType } = data;
        if (Object.keys(data).length < 1) {
            return res.status(400).json({
                status: false, message: "Data is required to create a user"
            })
        }
        //-------------------validation for first name-----------------------
        if (!isValid(name)) { return res.status(400).json({ status: false, message: "Enter Name" }) }
        if (!isValidName(name)) { return res.status(400).json({ status: false, message: "Enter valid name" }) }

        //------------------------validation for email--------------------
        if (!isValid(email)) { return res.status(400).json({ status: false, message: "Enter Email" }) }
        if (!isValidEmail(email)) { return res.status(400).json({ status: false, message: "Enter valid email" }) }

        //-----------------validation for password and converting in encrypted form---------
        if (!isValid(password)) { return res.status(400).json({ status: false, message: " Enter Password" }) }
        if (!isValidPassword(password)) { return res.status(400).json({ status: false, message: "Enter Valid Password having 1 capital and small letter , 1 special character and 1 number and length should be between 8 to 15" }) }

        //-------------------------validation for phone--------------------
        if (!isValid(phoneNo)) { return res.status(400).json({ status: false, message: "Enter Phone Number" }) }
        if (!isValidMobile(phoneNo)) { return res.status(400).json({ status: false, message: "Enter valid indian phone number" }) }

        //-------------------------validation for Address--------------------
        if (!isValid(address)) { return res.status(400).json({ status: false, message: "Enter Address Number" }) }

        const encryptedPassword = await bcryptjs.hash(password, 10);


        const oldUser = await User.findOne({ email });

        if (oldUser) {
            return res.send({ error: "user Exist" })
        }
        await User.create({
            name: name,
            email,
            password: encryptedPassword,
            phoneNo,
            address,
            userType
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
        const token = jwt.sign({ email: user.email }, JWT_SECRET, {
            expiresIn: "10d"
        })
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
        //If successfully login then varify the data with the help of screate key and token
        const user = jwt.verify(token, JWT_SECRET, (err, res) => {
            if (err) {
                return "token expired";
            }
            return res;
        });
        if (user == "token expired") {
            res.send({ status: "error", data: "token expired" })
        }
        // access the email 
        const useremail = user.email;
        //find the email
        User.findOne({ email: useremail }).then((data) => {
            res.send({ status: "ok", data: data })
        }).catch((error) => {
            res.send({ status: "error", data: error })
        });
    } catch (error) { }
});

app.get("/getAlluser", async (req, res) => {
    try {
        const allUser = await User.find({});
        res.send({ status: "ok", data: allUser })
    } catch (error) {
        console.log(error)
    }
})




