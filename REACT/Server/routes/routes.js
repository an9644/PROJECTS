import { Router } from "express";
import { authenticate } from "../Middleware/auth.js";
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
// models
import User from '../models/user.js';
import Admin from '../models/admin.js'
import Councillor from '../models/councillor.js'
import Job from '../models/job.js'
import Podcast from '../models/podcast.js'

dotenv.config();
const adminRoute = Router();
const secretkey = process.env.Secretkey



adminRoute.post('/signup', async (req, res) => {
    try {
        const { Name, UserName, Password  } = req.body 
        const existingUser = await User.findOne({ userName: UserName }) 
            if (existingUser) {
            res.status(400).json({ message: "User already exist!" })
        } else {
            const newPassword = await bcrypt.hash(Password, 10)  
               const  newUser = new User({
                    name: Name,
                    userName: UserName,
                    password: newPassword,
                })
                await newUser.save();
               return res.status(201).json({ message: "data Added successfully" })
            }  
    }
    catch (error) {
        res.status(500).json(error)
    }
});

//login

adminRoute.post('/login', async (req, res) => {//callbak function
    const { UserName, Password } = req.body;
    console.log(UserName)

    let result = await Admin.findOne({ userName: UserName });
    if (!result) {
        result = await User.findOne({ userName: UserName });
    }
    if (!result) {
        res.status(404).json({ message: "User does not exist" })
    } else {
        const valid = await bcrypt.compare(Password, result.password)
        console.log(valid)

        if (valid) { // toekns are created by usernameand userType
            const token = jwt.sign({ UserName: result.userName, userType: result.userType }, secretkey, { expiresIn: '1h' }) 
            res.cookie('AuthToken', token, { httpOnly: true });                                    
            console.log(result.userType);  
            return res.json(result.userType)

        } else {
            res.status(400).json({ meassage: "invalid password" })
        }
    }
})
//---------------------------------------------------------------------
adminRoute.post('/addadmin', async (req, res) => {
    try {       
            const {Name, UserName, Password } = req.body

            const existingadmin = await Admin.findOne({ userName: UserName })
            if (existingadmin) {
                console.log("Admin Already Exist!!")
                return res.status(400).json({ message: "Admin Already Exist!!" })
            }else{
                const newPassword = await bcrypt.hash(Password, 10)
                const newadmin = new Admin({
                    name: Name,
                    userName: UserName,
                    password: newPassword                    
                })
    
                //save course  to mongo
                await newadmin.save()
                console.log("Admin Addedd Successfully!!")
                return res.status(201).json({ message: "Admin Addedd Successfully!!" })
            }          
       
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: "Internal Server Error" })
    }
})



//-----------------------------------------------------------------------

adminRoute.get('/getuser', async (req, res) => {
    try {
        
        const result = await User.find();
        if (result) {
            res.status(200).send(result)
        }
        else {
            res.status(400).json({ message: 'there is no user ' })
            // console.log("No such course")
        }

    } catch (error) {
        res.status(500).json({ message: 'Internal server error' })
    }
})


//---------------------------------------------------------------------------
//adding councillor
adminRoute.post('/addcouncillor', async (req, res) => {

    try {
       
            const { CouncilName, CouncilId, Occupation, Description, Rating } = req.body

            const existingCouncil = await Councillor.findOne({ councilId: CouncilId })
            if (existingCouncil) {
                console.log("Councillor Already Exist!!")
                return res.status(400).json({ message: "Councillor Already Exist!!" })
            }

            //creating new course
            const newcouncillor = new Councillor({
                councilName: CouncilName,
                councilId: CouncilId,
                occupation: Occupation,
                description: Description,
                rating: Rating
            })

            //save course  to mongo
            await newcouncillor.save()
            console.log("Councillor Addedd Successfully!!")
            return res.status(201).json({ message: "Councillor Addedd Successfully!!" })
       
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: "Internal Server Error" })
    }
})
//--------------------------------------------------------------------------
//adding jobs

adminRoute.post('/addjob', async (req, res) => {
    try {
        

            const { JobName, JobId, Description, Rating,SalaryRange } = req.body

            const existingjob = await Job.findOne({ jobId: JobId })
            if (existingjob) {
                console.log("Job Already Exist!!")
                return res.status(400).json({ message: "Job Already Exist!!" })
            }
            //creating new course
            const newjob = new Job({
                jobName: JobName,
                jobId: JobId,
                description: Description,
                rating: Rating,
                salarayrange:SalaryRange
            })

            //save course  to mongo
            await newjob.save()
            console.log("Job Addedd Successfully!!")
            return res.status(201).json({ message: "Job Addedd Successfully!!" })
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: "Internal Server Error" })
    }
})
//---------------------------------------------------------------------------
//add Poscast
adminRoute.post('/addpodcast',async (req, res) => {
    try {
        

            const { PodcastName, CounciltName, PodcastId, Description, Rating } = req.body

            const existingpodcast = await Podcast.findOne({ podcastId: PodcastId })
            if (existingpodcast) {
                console.log("Podcast Already Exist!!")
                return res.status(400).json({ message: "Podcast Already Exist!!" })
            }

            //creating new course
            const newPodcast = new Podcast({
                podcastName: PodcastName,
                councilName: CounciltName,
                podcastId: PodcastId,
                description: Description,
                rating: Rating
            })

            //save course  to mongo
            await newPodcast.save()
            console.log("Podcast Addedd Successfully!!")
            return res.status(201).json({ message: "Podcast Addedd Successfully!!" })
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: "Internal Server Error" })
    }
})
//-----------------------------------------------------------------------
//removing councillor
adminRoute.delete('/deletecouncillor', async (req, res) => {
    try {
        if (req.userType == 'admin') {
            console.log("Admin login success")
            const result = req.query.councilId
            const councillor = await Councillor.deleteOne(result)

            if (councillor) {
                console.log("Councillor removed")
                return res.status(200).json({ meassage: "Councillor removed" })
            } else {
                console.log("no item found");
                return res.status(200).json({ meassage: "no item found" })
            }
        } else {
            console.log("You dont have permission to add Podcast ")
            return res.status(403).json({ message: "You don't have permission to add Post" });
        }
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ meassage: "Internal server Error" })
    }
})
//removing podcast
adminRoute.delete('/deletepodcast', authenticate, async (req, res) => {
    try {
        if (req.userType == 'admin') {
            console.log("Admin login success")
            const result = req.query.podcastId
            const podcast = await Podcast.deleteOne(result)

            if (podcast) {
                console.log("Podcast removed")
                return res.status(200).json({ meassage: "Podcast removed" })
            } else {
                console.log("no item found");
                return res.status(200).json({ meassage: "no item found" })
            }
        } else {
            console.log("You dont have permission to add Podcast ")
            return res.status(403).json({ message: "You don't have permission to add Post" });
        }
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ meassage: "Internal server Error" })
    }
})
//removing job
adminRoute.delete('/deletejob', authenticate, async (req, res) => {
    try {

        if (req.userType == 'admin') {
            console.log("Admin login success")
            const result = req.query.jobIdId
            const job = await Job.deleteOne(result)

            if (job) {
                console.log("Job removed")
                return res.status(200).json({ meassage: "Job removed" })
            } else {
                console.log("no item found");
                return res.status(200).json({ meassage: "no item found" })
            }

        } else {
            console.log("You dont have permission to add Podcast ")
            return res.status(403).json({ message: "You don't have permission to add Post" });
        }

    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ meassage: "Internal server Error" })
    }
})
//-------------------------------------------------------------------------
adminRoute.get('/getcouncil', async (req, res) => {

    try {
        const search = req.query.councilId
        console.log(search);
        const result = await Councillor.findOne({ councilId: search });
        if (result) {
            res.status(200).send(result)
        }
        else {
            res.status(400).json({ message: 'No such councillor' })
        }

    } catch (error) {
        res.status(500).json({ message: 'Internal server error' })
    }
})
//-------------------------------------------------------------------------
adminRoute.get('/getjob', async (req, res) => {

    try {
        const search = req.query.jobId
        console.log(search);
        const result = await Job.findOne({ jobId: search });
        if (result) {
            res.status(200).send(result)
        }
        else {
            res.status(400).json({ message: 'No such Job' })
        }

    } catch (error) {
        res.status(500).json({ message: 'Internal server error' })
    }
})
//--------------------------------------------------------------------
adminRoute.get('/getpodcast', async (req, res) => {

    try {
        const search = req.query.podcastId
        console.log(search);
        const result = await Podcast.findOne({ podcastId: search });
        if (result) {
            res.status(200).send(result)
        }
        else {
            res.status(400).json({ message: 'No such Podcast' })
        }

    } catch (error) {
        res.status(500).json({ message: 'Internal server error' })
    }
})
//-------------------------------------------------------------------
adminRoute.get('/getallpodcast', async (req, res) => {
    try {
        const result = await Podcast.find()
        if (result) {
            res.status(200).json(result);
          } else {
            res.status(404).json({ message: 'No podcasts found' }); 
            console.log(error);            
          }

    } catch (error) {
        res.status(500).json({ message: 'Internal server error' })
    }
})
//--------------------------------------------------------------------------
adminRoute.get('/getallcouncillors', async (req, res) => {
    try {
        const result = await Councillor.find()
        if (result) {
            res.status(200).json(result);
          } else {
            res.status(404).json({ message: 'No councillors found' }); 
            console.log(error);            
          }

    } catch (error) {
        res.status(500).json({ message: 'Internal server error' })
    }
})
//------------------------------------------------------------------------
adminRoute.get('/getalljobs', async (req, res) => {
    try {
        const result = await Job.find()
        if (result) {
            res.status(200).json(result);
          } else {
            res.status(404).json({ message: 'No podcasts found' }); 
            console.log(error);            
          }

    } catch (error) {
        res.status(500).json({ message: 'Internal server error' })
    }
})
//------------------------------------------------------------
adminRoute.get('/getallusers', async (req, res) => {
    try {
        const result = await User.find()
        if (result) {
            res.status(200).json(result);
          } else {
            res.status(404).json({ message: 'No User found' }); 
            console.log(error);            
          }

    } catch (error) {
        res.status(500).json({ message: 'Internal server error' })
    }
})
//-----------------------------------------------------------
adminRoute.get('/getalladmin', async (req, res) => {
    try {
        const result = await Admin.find()
        if (result) {
            res.status(200).json(result);
          } else {
            res.status(404).json({ message: 'No Admin found' }); 
            console.log(error);            
          }

    } catch (error) {
        res.status(500).json({ message: 'Internal server error' })
    }
})
//------------------------------------------------------------
//delete user
adminRoute.delete('/deleteuser', async (req, res) => {
    try {
        const { name } = req.query;

        const deletedName = await User.deleteOne({ name });
        if (!deletedName) {
            return res.status(404).send("User not found.");
        }

        console.log(`User deleted successfully`);
        res.status(200).send(`User  deleted successfully`);
    } catch (error) {
        console.error("Error deleting Admin:", error);
        res.status(500).send("Server error. Please try again later.");
    }
});
//-----------------------------------------------------------------------
adminRoute.delete('/deleteadmin', async (req, res) => {
    try {
        const search = req.query.id;
        const deletedName = await Admin.deleteOne({ _id:search });
        if (deletedName) {
            console.log(`Admin deleted successfully`);
           return res.status(200).send(`Admin  deleted successfully`);
        }else{
            return res.status(404).send("admin not found.");
        }

     
    } catch (error) {
        console.error("Error deleting Admin:", error);
        res.status(500).send("Server error. Please try again later.");
    }
});
//-----------------------------------------------------------------
adminRoute.get('/logout', authenticate, (req, res) => {
    try {
        if (req.userType) {
            res.clearCookie('AuthToken');
            res.status(200).json({ message: "Logout successfull" });
        } else {
            res.status(404).json({ message: "No user found!" })
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" })
    }

});
//-----------------------------------------------------------------
adminRoute.patch('/admininfo',async(req,res)=>{    
    try{
        
            
        const {Name,UserName,Email,Phn,Address}=req.body                     

        const existingUser= await Admin.findOne({userName : UserName})                        
        if(!existingUser){
            console.log("Admin not found!!")
            return res.status(400).json({message:"Admin not found!!"})
         }else{
            existingUser.name = Name;
            existingUser.userName =UserName;
            existingUser.email = Email;
            existingUser.phoneNumber = Phn;

            existingUser.address = {
                address: Address.address,
                city: Address.City,
                state: Address.State,
                pincode: Address.Pincode,
                country: Address.Country
            }
            
            await existingUser.save()
            console.log("User details Addedd Successfully!!")
             return res.status(201).json({message:"User Details Addedd Successfully!!"})         }                                
    }catch(error){
        console.error(error.message);
        res.status(500).json({message: "Internal Server Error" })
    }
})
export default adminRoute;