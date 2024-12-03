import { Router } from "express";
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
// models
import Admin from './models/admin.js'
dotenv.config();
const adminRoute = Router();


adminRoute.post('/signup', async (req, res) => {
    try {
        const { Name, UserName, Password,userType  } = req.body 

        const existingUser = await Admin.findOne({ userName: UserName }) 
            if (existingUser) {
            res.status(400).json({ message: "Admin already exist!" })
        } else {
            const newPassword = await bcrypt.hash(Password, 10)  
               const  newUser = new Admin({
                    name: Name,
                    userName: UserName,
                    password: newPassword,
                    userType:userType
                })
                await newUser.save();
               return res.status(201).json({ message: "data Added successfully" })
            }  
    }
    catch (error) {
        res.status(500).json(error)
    }

});
export default adminRoute;  