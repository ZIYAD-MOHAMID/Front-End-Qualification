'use client'
import { Fragment } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store/store";
import Image from 'next/image'
import { closeView } from '@/store/slices/ModalSlice';

type Props= {
    title: string
    description: string
    priority: string
    viewImageUel?: string | null
    stats: string
}

export default function Moddal({title, description, priority, viewImageUel, stats}:Props) {    

    const isViewOpen = useSelector((state: RootState) => state.module.isViewOpen);
    const dispatch = useDispatch()

    return (
        // Use the `Transition` component at the root level
        <Transition appear show={isViewOpen} as={Fragment}>
            <div className='flex justify-center z-10 absolute top-2/4 left-2/4 w-full h-full -translate-x-2/4 -translate-y-2/4'>
                <Dialog as='form' className='flex justify-center z-10 absolute top-2/4 left-2/4 w-full h-full -translate-x-2/4 -translate-y-2/4'
                    onClose={() => dispatch(closeView())}
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
                                    <Dialog.Title as='h2'
                                        className='text-lg font-medium leading-4 text-gray-900 pb-2'>
                                            <div className="flex justify-between p-1  leading-5 font-serif w-full flex-nowrap">
                                                Title:         
                                                <span className=''>
                                                    {title}
                                                </span>   
                                            </div>
                                        </Dialog.Title>
                                    <Dialog.Description as='h3'
                                        className='text-lg font-medium leading-4 text-gray-900 pb-2'>
                                                <div className="p-1 flex justify-between leading-5 font-serif w-full flex-nowrap">
                                                    Description:
                                                <span className=''>
                                                    {description}
                                                </span>   
                                            </div>
                                        </Dialog.Description>
                                    <Dialog.Description as='h3'
                                        className='text-lg font-medium leading-4 text-gray-900 pb-2'>
                                                <div className="p-1 flex justify-between leading-5 font-serif w-full flex-nowrap">
                                                    Priority:
                                                <span className='font-mono ml-2 p-2 bg-gray-300 w-fit rounded-md '>
                                                    {priority}
                                                </span>   
                                            </div>
                                        </Dialog.Description>
                                    <Dialog.Description as='h3'
                                        className='text-lg font-medium leading-4 text-gray-900 pb-2'>
                                                <div className="p-1 flex justify-between leading-5 font-serif w-full flex-nowrap">
                                                    Priority:
                                                <span className='font-mono ml-2 p-2 bg-gray-300 w-fit rounded-md '>
                                                    {stats}
                                                </span>   
                                            </div>
                                        </Dialog.Description>
                                    {viewImageUel && (
                                        <div className="relative h-full w-full rounded-b-md">
                                            <Image
                                                src={viewImageUel}
                                                alt="task image"
                                                width={400}
                                                height={200}
                                                className=" w-full object-contain rounded-b-md"
                                            />
                                        </div>             
                                    )}
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
            </div>
        </Transition>
    )
}
