'use client'
import { Fragment, useRef, FormEvent, Provider } from 'react'
import Image from 'next/image'
import { Dialog, Transition } from '@headlessui/react'

import { PhotoIcon } from '@heroicons/react/24/solid'
import  modalActions, { closeModal }  from '@/store/slices/ModalSlice';
import { AppDispatch, RootState } from "../store/store";


import TaskTypeRadioGroup from './TaskTypeRadioGroup'
import TaskPriorityRadioGroup from './TaskPriorityRadioGroup'
import { useSelector,useDispatch, ProviderProps } from 'react-redux'
import  bordActions, { addTask, setImage, setNewDescriptionInput, setNewTitleInput }  from '@/store/slices/BordSlice'
import { PriorityColum, TypeColum } from '@/tyoing'


export default function Moddal() {
    const imagePickerRef = useRef<HTMLInputElement>(null)
    const dispatch = useDispatch()
    const isOpen = useSelector((state: RootState) => state.module.isOpen);
    
    const newTaskPriority : PriorityColum = useSelector((state: RootState) => state.bord.newTaskPriority)
    const newTaskType : TypeColum = useSelector((state: RootState) => state.bord.newTaskType)
    const newTitleInput : string= useSelector((state: RootState) => state.bord.newTitleInput)
    const newDescriptionInput : string = useSelector((state: RootState) => state.bord.newDescriptionInput)
    const image: File | null= useSelector((state: RootState) => state.bord.image)
    
    const handlarSubmit = (e:FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (!newTitleInput || !newDescriptionInput) return
    
        dispatch(addTask({
            newTitleInput, newDescriptionInput, newTaskType, newTaskPriority, image
        }))
        dispatch(setImage(null))
        dispatch(closeModal())
    }

    return (
        // Use the `Transition` component at the root level
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as='form' onSubmit={handlarSubmit} className='flex justify-center z-10 absolute top-2/4 left-2/4 w-full h-full -translate-x-2/4 -translate-y-2/4'
                onClose={() => dispatch(closeModal())}
            >
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black/25" />
                </Transition.Child>
                
                <div className="flex inset-0 overflow-y-auto min-w-fit">
                    <div className="flex min-h-full items-center  p-4 text-center justify-center">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0"
                            enterTo="opacity-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                        >
                            <Dialog.Panel className="w-full max-w-lg transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all ">
                                <Dialog.Title as='h3' className='text-lg font-medium leading-4 text-gray-900 pb-2'>
                                    Add a Title
                                </Dialog.Title>
                                <div className="mt-2 mb-5">
                                    <input
                                        type='text'
                                        value={newTitleInput}
                                        onChange={(e) => dispatch(setNewTitleInput(e.target.value))}
                                        placeholder='Enter a task here...'
                                        className='w-full border border-gray-300 rounded-md outline-none p-5'
                                    />
                                </div>
                                <Dialog.Title as='h3' className='text-lg font-medium leading-4 text-gray-900 pb-2'>
                                    Add a Description
                                </Dialog.Title>
                                <div className="mt-2">
                                    <input
                                        type='text'
                                        value={newDescriptionInput}
                                        onChange={(e) => dispatch(setNewDescriptionInput(e.target.value))}
                                        placeholder='Enter a task here...'
                                        className='w-full border border-gray-300 rounded-md outline-none p-5'
                                    />
                                </div>
                                <div className="flex items-center justify-between m-auto ">
                                    <div className="m-2">
                                        <TaskPriorityRadioGroup />
                                    </div>
                                    <div className="m-2">
                                        <TaskTypeRadioGroup />
                                    </div>
                                </div>
                                
                                <div>
                                    <button type='button' onClick={() => {imagePickerRef.current?.click()}} className='w-full border border-gray-300 rounded-md outline-none p-5 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2'>
                                        <PhotoIcon className="h-6 w-6 mr-2 inline-block"/> Upload Image
                                    </button>
                                    {image && (
                                        <Image
                                            src={URL.createObjectURL(image)}
                                            alt="UPloaded Image"
                                            width={200}
                                            height={200}
                                            onClick={() => {
                                                dispatch(setImage(null))
                                            }}
                                            className='w-full h-44 object-cover mt-2 filter hover:grayscale transition-all duration-150 cursor-not-allowed'
                                        />
                                    )}
                                    <input type="file" ref={imagePickerRef} hidden onChange={(e) => {
                                        if (!e.target.files![0].type.startsWith('image/')) return
                                        dispatch(setImage(e.target.files![0]))
                                    }} />
                                </div>
                                <div>
                                    <button disabled={!newTitleInput} type='submit' className='inline-flex justify-center round-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:bg-gray-100 disabled:text-gray-300 disabled:cursor-not-allowed translate-x-full mt-5'>
                                        Add Task
                                    </button>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    )
}
