"use client"
import axios, { AxiosError } from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'
import toast from 'react-hot-toast';
import { IoIosEye, IoIosEyeOff } from 'react-icons/io';

const SignUpPage = () => {
    const [visible, setVisible] = useState(false);
    const [confirmVisible, setConfirmVisible] = useState(false);
    const [p1,setP1] = useState<string>("");
    const [p2,setP2] = useState<string>("");
    const [loading,setLoading] = useState<boolean>(false);
    const [error,setError] = useState<string>('');
    const router = useRouter();
    const [userData,setUserData] = useState({
      name:'',
      email:'',
      password:'',
    })
  
    const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        if (p1 === p2) {
          const userDataWithPassword = { ...userData, password: p1 };
          setLoading(true);
          setError(""); 
          try {
            console.log(userDataWithPassword);
            const response = await axios.post("/api/signup", userDataWithPassword);
            console.log("Signup success", response.data);
            toast.success("Successfully Signed Up!")
            router.push("/login");
          } catch (error: unknown) {
            console.log("Signup failed", error);
            if (error instanceof AxiosError && error.response?.data?.error) {
                setError(error.response.data.error);
                toast.error(error.response.data.error);
            } else if (error instanceof Error) {
                setError(error.message || "Something went wrong. Please try again.");
                toast.error(error.message || "Something went wrong. Please try again.");
            } else {
                setError("An unknown error occurred.");
                toast.error("An unknown error occurred.");
            }
          }
         finally {
            setLoading(false);
          }
        } else {
          setError("Passwords don't match!");
        }
      };
      
  
    return (
      <section className="bg-gray-50 dark:bg-gray-900  max-sm:py-10 h-screen">
        <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">          
          <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
              <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                Sign Up
              </h1>
              <form className="space-y-4 md:space-y-6" onSubmit={handleSignIn}>
                <div>
                  <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your name</label>
                  <input type="text" name="name" id="name" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Your Name" required onChange={(e)=>{setUserData({...userData,name:e.target.value})}} />
                </div>
                <div>
                  <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Email</label>
                  <input type="tel" name="email" id="email" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="user@gmail.com" required onChange={(e)=>{setUserData({...userData,email:e.target.value})}} />
                </div>
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-900 dark:text-white">Password</label>
                  <div className='relative'>
                    <input type={visible ? "text" : "password"} name="password" id="password" placeholder="password" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required onChange={(e)=>{setP1(e.target.value)}} />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 flex items-center px-2 text-gray-600"
                      onClick={() => { setVisible(!visible) }}
                    >
                      {visible ? (
                        <IoIosEye size={24} />
                      ) : (
                        <IoIosEyeOff size={24} />
                      )}
                    </button>
                  </div>
                </div>
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-900 dark:text-white">Confirm Password</label>
                  <div className='relative'>
                    <input type={confirmVisible ? "text" : "password"} name="confirmPassword" id="confirmPassword" placeholder="password" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required onChange={(e)=>{setP2(e.target.value)}} />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 flex items-center px-2 text-gray-600"
                      onClick={() => { setConfirmVisible(!confirmVisible) }}
                    >
                      {confirmVisible ? (
                        <IoIosEye size={24} />
                      ) : (
                        <IoIosEyeOff size={24}/>
                      )}
                    </button>
                  </div>
                </div>
                {
                  !loading && error!==''?(<p className="text-center text-red-500"> {error}</p>):(
                    <p></p>
                  )
                }
                <button type="submit" className="w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-primary-800" >
                  {
                    loading?(
                  <svg aria-hidden="true" className="inline w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-gray-600 dark:fill-gray-300" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                      <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                  </svg>
                    ):(
                    "Sign up"
                    )
                  }
                </button>
                <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                  Already have an account? <Link href="/login" className="font-medium text-primary-600 hover:underline dark:text-primary-500">Sign in</Link>
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>
    )
}

export default SignUpPage
