'use client'
import { setNewTaskType } from "@/store/slices/BordSlice"
import { RootState } from "@/store/store"
import { TypeColum } from "@/tyoing"
import { RadioGroup } from "@headlessui/react"
import { CheckCircleIcon } from "@heroicons/react/24/solid"
import { useDispatch, useSelector } from "react-redux"

const types = [
    {
        id: 'todo',
        name: 'Todo',
        description: 'a New Task to be completed',
        color: 'bg-red-500'
    },
    {
        id: 'inprogress',
        name: 'In Progress',
        description: 'a Task that is curently being worked on',
        color: 'bg-yellow-500'
    },
    {
        id: 'done',
        name: 'Done',
        description: 'a Task that has been completed',
        color: 'bg-green-500'
    },
]

function TaskTypeRadioGroup() {

    const dispatch = useDispatch()
    const newTaskType : TypeColum = useSelector((state: RootState) => state.bord.newTaskType)

    return (
        <div className="w-full py-5">
            <div className=" w-full  ">
                <RadioGroup value={newTaskType} onChange={(e) =>  dispatch(setNewTaskType(e)) }>
                    
                    <div className="space-y-2">
                        {types.map((type) => (
                            <RadioGroup.Option value={type.id} key={type.id} className={({ active, checked }) =>
                                `${active ? "ring-2 ring-white ring-opacity-60 ring-offset-2 ring-offset-sky-300" : ''}
                                ${checked ? `${type.color} bg-opacity-75 text-white` : 'bg-white'}
                                relative flex cursor-pointer rounded-lg px-5 py-4 shadow-md focus:outline-none` 
                            }>
                                {({ active, checked }) => (
                                    <>
                                        <div className="flex w-full items-center justify-between">
                                            <div className="flex items-center">
                                                <div className="text-sm">
                                                    <RadioGroup.Label
                                                        as='p'
                                                        className={`font-medium ${checked ? 'text-white':'text-gray-900'}`}
                                                    >
                                                        {type.name}
                                                    </RadioGroup.Label>
                                                    <RadioGroup.Description
                                                        as="p"
                                                        className={`inline ${checked ? 'text-white':'text-gray-500'}`}
                                                    >
                                                        { type.description }
                                                    </RadioGroup.Description>
                                                </div>
                                            </div>
                                            {checked && (
                                                <div className="shrink-0 text-white">
                                                    <CheckCircleIcon className="h-6 w-6"/>
                                                </div>
                                            )}
                                        </div>
                                    </>
                                )}
                            </RadioGroup.Option>
                        ))}
                    </div>
                
                </RadioGroup>
            </div>
        </div>  
    )
}

export default TaskTypeRadioGroup