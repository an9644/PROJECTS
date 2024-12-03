import { Router } from "express";
import { authenticate } from "../Middleware/auth.js";
import dotenv from 'dotenv';
import mongoose from 'mongoose'


dotenv.config()
const userRoute=Router();

const bookSchema= new mongoose.Schema({
    bkname:String,
    bookid: {type:String,unique:true},
    email:String,
    phn:String,
    mplan:String,
    payment:String,
    description:String,
})
const Booking =mongoose.model('Booking Details',bookSchema)

 const infoSchema=new mongoose.Schema({
    name: String,
    userName: { type: String, unique: true },
    password: String,
    role: String,
    email: String,
    phoneNumber: String,
    address: {
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
const info = mongoose.model('More User Details', infoSchema);

mongoose.connect("mongodb://localhost:27017/Career-Guidence-App")

  //--------------------------------------------------------------
  //booking live section
  userRoute.post('/booksession',authenticate,async(req,res)=>{    

    try{
        if(req.Role=='user'){      
            console.log("User login success")   

         const {BkName,BookId,Email,Phn,Mplan,Payment,Description}=req.body                     

        const existingbook= await Booking.findOne({bookid : BookId})                        
        if(existingbook){
            console.log("Booking incomplete!!")
            return res.status(400).json({message:"  Booking incomplete!!"})
         }                         
        
            //creating new course
            const newbooking=new Booking({
                bkname:BkName,
                bookId: BookId,
                email:Email,
                phn:Phn,
                mplan:Mplan,
                payment:Payment,
                description:Description,
            })

            //save course  to mongo
            await newbooking.save()
            console.log("Booking  Successfull !! Our Employee Contact You Shortly ")
             return res.status(201).json({message:"Booking  Successfull !! Our Employee Contact You Shortly"})
            // alert("Course Addedd Successfully!!")
        }else{
        console.log("Invalid Credentail")
        return res.status(403).json({ message: "Invalid Credentail" });
        }
    }catch(error){
        console.error(error.message);
        res.status(500).json({message: "Internal Server Error" })
    }
})
//------------------------------------------------------------------------
//user profile 
userRoute.post('/userinfo',authenticate,async(req,res)=>{    
    try{
        if(req.Role=='user'){      
            console.log("User login success")   
        }
         const {Name,UserName,Password,Role,Email,Phn,Address:{ City, State, PinCode, Country }}=req.body                     

        const existinginfo= await info.findOne({userName : UserName})                        
        if(existinginfo){
            console.log("User Details Already Exist!!")
            return res.status(400).json({message:"User Details Already Exist!!"})
         }                                 
            //creating new course
            const newinfo=new info({
                name:Name,
                userName: UserName,
                password:Password,
                role:Role,
                email:Email,
                phoneNumber: Phn,
                address:{
                    city: City,
                    state: State,
                    pincode: PinCode,
                    country: Country,                    
                }
            })

            //save course  to mongo
            await newinfo.save()
            console.log("User details Addedd Successfully!!")
             return res.status(201).json({message:"User Details Addedd Successfully!!"})
            // alert("Course Addedd Successfully!!")
        // }else{
        // console.log("Invalid Credentail")
        // return res.status(403).json({ message: "Invalid Credentail" });
        // }
    }catch(error){
        console.error(error.message);
        res.status(500).json({message: "Internal Server Error" })
    }
})
//-----------------------------------------------------------------------------
//education
userRoute.post('/useredu',authenticate,async(req,res)=>{    
    try{
        if(req.Role=='user'){      
            console.log("User login success")   
        }
         const {Degree,FieldStudy,University,GraduationYear}=req.body 
         
         console.log('req.userName:', req.UserName);   
         const existingUser = await info.findOne( {userName:req.UserName} );
        if(!existingUser){
            console.log("User not found!!")
            return res.status(400).json({message:"User not found!!"})
         }                  
            existingUser.degree=Degree,
            existingUser.fieldstudy= FieldStudy,
            existingUser.university=University,
            existingUser.graduationYear=GraduationYear
      
            await existingUser.save()
            console.log("User details Addedd Successfully!!")
             return res.status(201).json({message:"User Details Addedd Successfully!!"})
            // alert("Course Addedd Successfully!!")
        
    }catch(error){
        console.error(error.message);
        res.status(500).json({message: "Internal Server Error" })
    }
})
//---------------------------------------------------------------------------
//qualification
userRoute.post('/userqualification',authenticate,async(req,res)=>{    
    try{
        if(req.Role=='user'){      
            console.log("User login success")   
        }
         const {Certification,Skills,Language,Other}=req.body
         
         console.log('req.userName:', req.UserName);   
         const existingUser=await info.findOne({userName:req.UserName})
        if(!existingUser){
            console.log("User not found!!")
            return res.status(400).json({message:"User not found!!"})
         }                       
         existingUser.certification=Certification,
         existingUser.skills=Skills,
         existingUser.language=Language,
         existingUser.other=Other

            //save course  to mongo
            await existingUser.save()
            console.log("User details Addedd Successfully!!")
             return res.status(201).json({message:"User Details Addedd Successfully!!"})
            // alert("Course Addedd Successfully!!")
        
    }catch(error){
        console.error(error.message);
        res.status(500).json({message: "Internal Server Error" })
    }
})
userRoute.get('/logout', authenticate, (req, res) => {
    try {
        if (req.Role) {
            res.clearCookie('authToken');
            res.status(200).json({ message: "Logout successfull" });
        } else {
            res.status(404).json({ message: "No user found!" })
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" })
    }

});



// module.exports = { userSchema };
export{userRoute}