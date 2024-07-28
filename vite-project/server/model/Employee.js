 const mongoose = require('mongoose')

 const EmployeeSchema = new mongoose.Schema({
    userid :String,
    name:String,
    email:String,
    designation:String,
    gender :String,
    course:String,
    image :String
 })

 const EmployeeModel = mongoose.model("employees", EmployeeSchema)
 module.exports = EmployeeModel
