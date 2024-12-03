import { Router } from "express";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { authenticate } from "../Middleware/auth.js";
import dotenv from 'dotenv';
import mongoose from 'mongoose'

dotenv.config();
const adminRoute = Router();

const secretkey = process.env.Secretkey

//define user schema(designing) for signin  and login
const adminSchema = new mongoose.Schema({
    name: String,
    userName: { type: String, unique: true },
    password: String,
    role: String
})
const Admin = mongoose.model('Admin Details', adminSchema)

const userSchema = new mongoose.Schema({
    name: String,
    userName: { type: String, unique: true },
    password: String,
    role: String
})
const User = mongoose.model('User Details', userSchema)

// create model for addcourse
const consilSchema = new mongoose.Schema({
    councilName: String,
    councilId: { type: String, unique: true },
    occupation: String,
    description: String,
    rating: String
})
const Councillor = mongoose.model('Councillor Details', consilSchema)

// create model for addjob
const jobSchema = new mongoose.Schema({
    jobName: String,
    jobId: { type: String, unique: true },
    description: String,
    rating: String
})
const Job = mongoose.model('Job Details', jobSchema)

// create model for addcourse
const courseSchema = new mongoose.Schema({
    courseName: String,
    courseId: { type: String, unique: true },
    description: String,
    rating: String
})
const Course = mongoose.model('course details', courseSchema)

// create model for addcourse
const podcastSchema = new mongoose.Schema({
    podcastName: String,
    councilName: String,
    podcastId: { type: String, unique: true },
    description: String,
    rating: String
})
const Podcast = mongoose.model('Podcast details', podcastSchema)

mongoose.connect("mongodb://localhost:27017/Career-Guidence-App")

adminRoute.get('/', (req, res) => { //callbk func // eth index page venditt matgarm 
    res.send("Hello World")
})

//signup

adminRoute.post('/signup', async (req, res) => {
    try {
        //storing individually
        const data = req.body
        const { Name, UserName, Password, Role } = data //mapp method of storing 
        console.log(data)
        const newPassword = await bcrypt.hash(Password, 10) //used for security of password they show the exact password 
        //map start    
        const existingUser = await User.findOne({ userName: UserName }) || await Admin.findOne({ userName: UserName })
        if (existingUser) {
            res.status(400).json({ message: "User already exist!" })
        } else {
            //creating new user
            let newUser;
            if (Role == 'admin') {
                newUser = new Admin({
                    name: Name,
                    userName: UserName,
                    password: newPassword,
                    role: Role
                })
            } else if (Role == 'user') {
                newUser = new User({
                    name: Name,
                    userName: UserName,
                    password: newPassword,
                    role: Role
                })
            } else {
                res.status(400).json({ message: "Invalid role!" });
                return;
            }
            await newUser.save();
            res.status(201).json({ message: "data Added successfully" })
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
    // cheching if the password is corect 
    if (!result) {
        res.status(404).json({ message: "User does not exist" })
    } else {
        const valid = await bcrypt.compare(Password, result.password)
        console.log(valid)

        if (valid) { // toekns are created by usernameand role
            const token = jwt.sign({ UserName: result.userName, Role: result.role }, secretkey, { expiresIn: '1h' }) //function({para1 : athokke venm token genarate chyn,seceretkey kodukkumbol anu eth work aunne}, 1 houe time ulle ath kazhinja veendum login cheyynm)
            res.cookie('authToken', token, { httpOnly: true });                                     // eth store avunnath browser cookie
            console.log(token)
            return res.status(200).json({ token })

        } else {
            res.status(400).json({ meassage: "invalid password" })
        }
    }
})
//---------------------------------------------------------------------------
//adding councillor
adminRoute.post('/addcouncillor', authenticate, async (req, res) => {

    try {
        if (req.Role == 'admin') {
            console.log("Admin login success")

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
            // alert("Course Addedd Successfully!!")
        } else {
            console.log("You dont have permission to add Course ")
            return res.status(403).json({ message: "You don't have permission to add Course" });
        }
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: "Internal Server Error" })
    }
})
//--------------------------------------------------------------------------
//adding jobs

adminRoute.post('/addjob', authenticate, async (req, res) => {
    try {
        if (req.Role == 'admin') {
            console.log("Admin login success")

            const { JobName, JobId, Description, Rating } = req.body

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
                rating: Rating
            })

            //save course  to mongo
            await newjob.save()
            console.log("Job Addedd Successfully!!")
            return res.status(201).json({ message: "Job Addedd Successfully!!" })
            // alert("Course Addedd Successfully!!")
        } else {
            console.log("You dont have permission to add job ")
            return res.status(403).json({ message: "You don't have permission to add job" });
        }
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: "Internal Server Error" })
    }
})
//---------------------------------------------------------------------------
//add Poscast
adminRoute.post('/addpodcast', authenticate, async (req, res) => {
    try {
        if (req.Role == 'admin') {
            console.log("Admin login success")

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
            // alert("Course Addedd Successfully!!")
        } else {
            console.log("You dont have permission to add Podcast ")
            return res.status(403).json({ message: "You don't have permission to add Post" });
        }
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: "Internal Server Error" })
    }
})
//-----------------------------------------------------------------------
//removing councillor
adminRoute.delete('/deletecouncillor', authenticate, async (req, res) => {
    try {
        if (req.Role == 'admin') {
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
        if (req.Role == 'admin') {
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

        if (req.Role == 'admin') {
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
//-----------------------------------------------------------------------
adminRoute.get('/getuser', async (req, res) => {
    // console.log(req.query.Courseid) //maping method

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






//-------------------------------------------------------------------------
adminRoute.get('/getcouncil', async (req, res) => {
    // console.log(req.query.Courseid) //maping method

    try {
        const search = req.query.councilId
        console.log(search);
        const result = await Councillor.findOne({ councilId: search });
        if (result) {
            res.status(200).send(result)
        }
        else {
            res.status(400).json({ message: 'No such councillor' })
            // console.log("No such course")
        }

    } catch (error) {
        res.status(500).json({ message: 'Internal server error' })
    }
})
//-------------------------------------------------------------------------
adminRoute.get('/getjob', async (req, res) => {
    // console.log(req.query.Courseid) //maping method

    try {
        const search = req.query.jobId
        console.log(search);
        const result = await Job.findOne({ jobId: search });
        if (result) {
            res.status(200).send(result)
        }
        else {
            res.status(400).json({ message: 'No such Job' })
            // console.log("No such course")
        }

    } catch (error) {
        res.status(500).json({ message: 'Internal server error' })
    }
})
//--------------------------------------------------------------------
adminRoute.get('/getpodcast', async (req, res) => {
    // console.log(req.query.Courseid) //maping method

    try {
        const search = req.query.podcastId
        console.log(search);
        const result = await Podcast.findOne({ podcastId: search });
        if (result) {
            res.status(200).send(result)
        }
        else {
            res.status(400).json({ message: 'No such Podcast' })
            // console.log("No such course")
        }

    } catch (error) {
        res.status(500).json({ message: 'Internal server error' })
    }
})
//-----------------------------------------------------------------------

//logout

adminRoute.get('/logout', authenticate, (req, res) => {
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


export { adminRoute }
export { userSchema }