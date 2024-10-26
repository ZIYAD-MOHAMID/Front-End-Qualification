'use client'
import { setNewTaskPriority }  from "@/store/slices/BordSlice"
import { RootState } from "@/store/store"
import { PriorityColum } from "@/tyoing"
import { RadioGroup } from "@headlessui/react"
import { CheckCircleIcon } from "@heroicons/react/24/solid"
import { useDispatch, useSelector } from "react-redux"


const priority  = [
    {
        id: 'low',
        name: 'Low',
        description: 'a New Task With Low Priority',
        color: 'bg-green-500'
    },
    {
        id: 'medium',
        name: 'Medium',
        description: 'a New Task With Low Priority',
        color: 'bg-yellow-500'
    },
    {
        id: 'high',
        name: 'High',
        description: 'a New Task With High Priority',
        color: 'bg-red-500'
    },
]

function TaskTypeRadioGroup() {
    const dispatch = useDispatch()
    const newTaskPriority : PriorityColum = useSelector((state: RootState) => state.bord.newTaskPriority)

    return (
        <div className="w-fit py-5">
            <div className="mx-auto w-full ">
                <RadioGroup value={newTaskPriority} onChange={(e) => dispatch(setNewTaskPriority(e)) }>
                    
                    <div className="space-y-2 w-fit">
                        {priority.map((p) => (
                            <RadioGroup.Option value={p.id} key={p.id} className={({ active, checked }) =>
                                `${active ? "ring-2 ring-white ring-opacity-60 ring-offset-2 ring-offset-sky-300" : ''}
                                ${checked ? `${p.color} bg-opacity-75 text-white` : 'bg-white'}
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
                                                        {p.name}
                                                    </RadioGroup.Label>
                                                    <RadioGroup.Description
                                                        as="p"
                                                        className={`inline ${checked ? 'text-white':'text-gray-500'}`}
                                                    >
                                                        { p.description }
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