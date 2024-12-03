import mongoose from "mongoose";

const infoSchema=new mongoose.Schema({
    name: String,
    userName: { type: String, unique: true },
    password: String,
    userType: String,
    email: String,
    phoneNumber: String,
    address: {
        address:String,
        city: String,
        state: String,
        pincode: String,
        country: String,
             },
    degree:String,
    fieldstudy:String,
    university:String,
    graduationYear:String,

    certification:String,
    skills:String,
    language:String,
    other:String
})
const User = mongoose.model('More User Details', infoSchema);

export default User;  