import React,{useState} from 'react'
import { useNavigate  } from 'react-router-dom'
import Mainlayout from '../layouts/Mainlayout'
import ML2 from '../layouts/ML2'
import Settingicons from '../components/User/Settingicons'


const Settings = () => { 
    const [Name,setName]=useState('')
    const [UserName,setUserName]=useState('')
    const [Email,setEmail]=useState('')
    const [Phn,setPhn]=useState('')
    const [Address,setAddress]=useState('')
    const [City,setCity]=useState('')
    const [State,setState]=useState('')
    const [Pincode,setPincode]=useState('')
    const [Country,setCountry]=useState('')
    const navigate =useNavigate()

    const submitForm=async (e)=>{
        e.preventDefault()
    
        const newBooking ={
          Name, Email,Phn, UserName,
          Address:{Address:Address,City,State,Pincode,Country}
        }
        try {
          const res= await fetch('http://localhost:8080/userinfo',{
            method:'PATCH',
            headers:{'Content-Type': 'application/json'} ,
            body:JSON.stringify(newBooking),
            credentials:'include'
          })
          if(res.ok){
            navigate('/qualification')            
          }else{
            console.log(' Data Adding  failed')
            navigate('/home')
          }
        } catch (error) {
          console.log('Error : faild');
          
        }
      }


  return (
    <>
    <Mainlayout>
    <div className="bg-transparent fixed  backdrop-blur-sm h-screen w-44 ml-28 rounded-xl m-2 ">
    <Settingicons />     </div>
    <div className="bg-transparent fixed ml-80  backdrop-blur-sm h-screen w-[1450px] mt-2 rounded-xl">
            <ML2>
            <div  className="bg-teal-100 ml-72 w-[680px] h-auto mt-4 rounded-xl shadow-lg">
                <form onSubmit={submitForm}>
                <div className="text-2xl ml-64 text-fuchsia-800 pt-4 font-bold "> My Profile </div>
                <div className=" ml-4">
                <div className="ml-9">
                    <label className="text-fuchsia-800" htmlFor=""> Name :</label> <br/>
                    <input type="text" className="mt-2 bg-gray-100 w-[565px] border-2 p-2 rounded-xl" name="" id="username" required placeholder="Enter Name " 
                    value={Name} onChange={(e)=>setName(e.target.value)} />
                </div>
                <div className="ml-9">
                    <label className="text-fuchsia-800" htmlFor="">UserName :</label> <br/>
                    <input type="text" className="mt-2 bg-gray-100 w-[565px] border-2 p-2 rounded-xl" name="" id="username" required placeholder="Enter Name " 
                    value={UserName} onChange={(e)=>setUserName(e.target.value)} />
                </div>
                

                <div className="mb-4 ml-9 mt-3">
                    <label className="block text-fuchsia-800" htmlFor="email" >Email:</label>
                    <input type="email" id="email"  className="mt-2 bg-gray-100 w-[565px] border-2 p-2 rounded-xl" placeholder="Enter your email..." required
                    value={Email} onChange={(e)=>setEmail(e.target.value)} />
                </div>
                <div className="mb-4 ml-9 mt-3">
                    <label className="block text-fuchsia-800" htmlFor="contno" > Contact No:</label>
                    <input type="number" id="contno" placeholder="Enetr your Contact no...." className="mt-2 bg-gray-100 w-[565px] p-2 border-2 rounded-xl" required
                    value={Phn}  onChange={(e)=>setPhn(e.target.value)}/>
                </div>
                <div className="mb-4 ml-9 mt-3">
                    <label className="block text-fuchsia-800" htmlFor="address" > Address:</label>
                    <textarea className="w-[565px] h-32 bg-gray-100 border-2 mt-2  p-2 rounded-xl"  id="address" placeholder="Enter your address..."
                    value={Address} onChange={(e)=>setAddress(e.target.value)}></textarea>   
                </div>
                <div className="grid grid-cols-2 gap-2  mt-2">
                    <div className="ml-9">
                    <label  className="text-fuchsia-800"  htmlFor="">City :</label> <br/>
                    <input type="text" className="mt-2 bg-gray-100 w-64 border-2 p-2 rounded-xl" name="" id="fname" required 
                    value={City} onChange={(e)=>setCity(e.target.value)} />
                    </div>
                    <div>
                    <label className="text-fuchsia-800"  htmlFor="">State :</label> <br/>
                    <input type="text" className="mt-2 bg-gray-100 w-64 border-2 p-2 rounded-xl" name="" id="lname" required 
                    value={State} onChange={(e)=>setState(e.target.value)} />
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-2  mt-2">
                    <div className="ml-9">
                    <label  className="text-fuchsia-800"  htmlFor="">Pin Code</label> <br />
                    <input type="text" className="mt-2 bg-gray-100 w-64 border-2 p-2 rounded-xl" name="" id="fname" required
                    value={Pincode} onChange={(e)=>setPincode(e.target.value)} /> 
                    </div>
                    <div className="mb-4">
                    <label className="text-fuchsia-800"  htmlFor="">Contry:</label> <br />
                    <input type="text" className="mt-2 bg-gray-100 w-64 border-2 p-2 rounded-xl" name="" id="lname" required 
                    value={Country} onChange={(e)=>setCountry(e.target.value)} />
                    </div>
                </div>
                <div className="flex justify-cente ml-64 mt-6">
                    <button type="submit" className="inline-flex items-center px-4 py-2  text-lg font-medium rounded-xl shadow-xl text-black hover:text-white bg-fuchsia-500 hover:bg-fuchsia-800 ">Submit</button>
                </div>

                </div>
                </form></div>

            </ML2>
            </div>
    </Mainlayout>
    
    </>
  )
}

export default Settings