import React, { useState } from 'react'
import { Button, Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from '@headlessui/react'
import axios from 'axios';

interface Data {
    _id: string;
    name: string;
    dob: string;
    age?: number;
  }

interface AddDataModalProps{
    isOpen: boolean;
    onClose: () => void;
    handleUpdate: (data: Data) => void;
}

const AddDataModal:React.FC<AddDataModalProps> = ({isOpen,onClose,handleUpdate}) => {
    const [loading,setLoaing] = useState<boolean>(false);
    const [data,setData] = useState({
        name:"",
        dob:""
    })

    const handleSubmit = async() => {

        try {
            setLoaing(true);
            const response = await axios.post(`/api/data`, data);
            console.log(response.data.savedData);

            handleUpdate(response.data.savedData);

            
        } catch (error) {
            console.error('Error fetching data:', error);
        }finally{
            setLoaing(false);
            setData({
                name:"",
                dob:""
            });
            onClose();
        }
        
    }

  return (
    <Transition appear show={isOpen}>
        <Dialog as="div" className="relative z-10 focus:outline-none" onClose={onClose}> 
          <div className="fixed inset-0 z-10 w-screen overflow-y-auto bg-black bg-opacity-25">
            <div className="flex min-h-full items-center justify-center p-4">
              <TransitionChild
                enter="ease-out duration-300"
                enterFrom="opacity-0 transform-[scale(95%)]"
                enterTo="opacity-100 transform-[scale(100%)]"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 transform-[scale(100%)]"
                leaveTo="opacity-0 transform-[scale(95%)]"
              >
                <DialogPanel className="w-full max-w-md rounded-xl text-black p-6 backdrop-blur-2xl bg-white">
                  <DialogTitle as="h3" className="text-base/7 font-medium ">
                    Add data
                  </DialogTitle>
                    <div className='w-full flex flex-col justify-center' >

                        <div>
                            <label htmlFor="name" className=" block mb-2 text-sm font-medium text-gray-900">Enter name</label>
                            <input
                                id="name"
                                type="text"
                                value={data.name}
                                onChange={(event)=>{setData({...data, name : event.target.value})}}
                                className=" bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                            />
                        </div>

                        <div className='flex flex-col w-full'>
                            <label className="w-full block mt-2 mb-2 text-sm font-medium text-gray-900">Date Of Birth: </label>
                            <input
                            type="date"
                            value={data.dob}
                            onChange={(event)=>{setData({...data, dob : event.target.value})}}
                            className="w-full  bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block  p-2.5"
                            />
                        </div>
                    
                        <Button className="mt-4 inline-flex items-center justify-center gap-2 rounded-md bg-gray-700 py-1.5 px-3 text-sm/6 font-semibold shadow-inner shadow-white/10 focus:outline-none data-[hover]:bg-gray-600 text-white data-[open]:bg-gray-700 data-[focus]:outline-1 data-[focus]:outline-white disabled:cursor-not-allowed" onClick={handleSubmit} disabled={!data.name || !data.dob}>
                            {
                                loading?
                                <div role="status">
                                <svg aria-hidden="true" className="inline w-6 h-6 text-gray-200 animate-spin dark:text-gray-600 fill-gray-600 dark:fill-gray-300" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                                </svg>
                                <span className="sr-only">Loading...</span>
                              </div>:"Submit"
                            }
                        </Button>

                    </div>
                </DialogPanel>
              </TransitionChild>
            </div>
          </div>
        </Dialog>
    </Transition>
  )
}

export default AddDataModal
