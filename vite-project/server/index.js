const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const LoginModel = require("./model/Login")
const EmployeeModel = require("./model/Employee")

const app = express()
app.use(express.json())
app.use(cors())

mongoose.connect("mongodb://127.0.0.1:27017/employee");

app.post("/login", (req, res) => {
    const {email, password} = req.body;
    LoginModel.findOne({email : email})
    .then(user => {
        if(user) {
            if(user.password === password){
                res.json("Success")
            }else{
                res.json("The password is incorrect")
            }
        }else{
            res.json("No record existed")
        }
    })
})

app.post("/register", (req, res) => {
    LoginModel.create(req.body)
    .then(employees => res.json(employees))
    .catch(err => res.json(err))
})

app.get("/getEmployee", (req, res) => {
    EmployeeModel.find({})
    .then(employees => res.json(employees))
    .catch(err => res.json(err))
})
//create employee
app.post("/createEmployee", (req, res) => {
    //create userid autogenerate one    
    const userid = Math.floor(Math.random() * 1000000) + 1;
    req.body.userid = userid;
    EmployeeModel.create(req.body)
    .then(employees => res.json(employees))
    .catch(err => res.json(err))
})
//get all employees
app.get("/", (req, res) => {
    EmployeeModel.find({})
    .then(employees => res.json(employees))
    .catch(err => res.json(err))
})

 //update employee
 app.put("/updateEmployee/:userid", (req, res) => {
 
    const userid = req.params.userid;
    EmployeeModel.findOneAndUpdate({userid: userid}, {
        name: req.body.name,
        email: req.body.email,
        designation: req.body.designation,
        gender: req.body.gender,
        course: req.body.course,
        image: req.body.image
    })
    .then(employees => res.json(employees))
    .catch(err => res.json(err))
})

//delete employee
app.delete("/deleteEmployee/:userid", (req, res) => {
    const userid = req.params.userid;
    EmployeeModel.findOneAndDelete({userid: userid})
    .then(employees => res.json(employees))
    .catch(err => res.json(err))
})

app.listen(3001, () => {
    console.log("server is running")
})