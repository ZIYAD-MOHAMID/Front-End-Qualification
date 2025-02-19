"use client"

import React from 'react'
import {Draggable, Droppable} from 'react-beautiful-dnd'
import { PlusCircleIcon } from '@heroicons/react/24/solid'

import { Todo, TypeColum } from '@/tyoing'

import TodoCard from './TodoCard'
import { useDispatch, useSelector } from 'react-redux'
import { bordActions } from '@/store/slices/BordSlice'
import { modalActions } from '@/store/slices/ModalSlice'
import { RootState } from '@/store/store'

type Props = {
    id: TypeColum,
    todos: Todo[],
    index: number
}

const isToColumnText: {
    [key in TypeColum]: string
} = {
    todo: 'To Do',
    inprogress: "In Progress",
    done: "Done",
}

function Column({ id, todos, index }: Props) {
    const serchString: string = useSelector((state: RootState) => state.bord.serchString)
    const dispatch = useDispatch()

    const handelAddTodo = () => {
        dispatch(bordActions.setNewTaskType(id))
        dispatch(modalActions.openModals())
    }
    
  return (
    <Draggable draggableId={id} index={index}>
        {(provided) => (
            <div
                {...provided.draggableProps}
                {...provided.dragHandleProps}
                ref={provided.innerRef}
            >
                
                <Droppable droppableId={index.toString()} type="card">
                    {(provided, snapshot) => (
                        <div
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                            className={`pd-2 p-2 rounded-2xl shadow-sm 
                                ${snapshot.isDraggingOver ? " bg-green-200": "bg-white/50"}
                            `}
                        >
                            <h2 className='flex justify-between font-bold text-xl p-2'>
                                {isToColumnText[id]}
                                <span className='text-gray-500 bg-gray-200 rounded-full font-normal px-2 py-1 text-sm'>
                                    {!serchString ? todos.length : todos.filter(todo =>
                                    todo.title.toLowerCase().includes(serchString.toLowerCase())).length}
                                </span>
                            </h2>
                            <div className="space-y-2">
                                {todos.map((todo, index) => {
                                    if(serchString && !todo.title.toLowerCase().includes(serchString.toLowerCase()))return null 
                                    return (
                                        <Draggable 
                                            key={todo.$id}
                                            draggableId={todo.$id}
                                            index={index}
                                        >
                                            {(provided) => (
                                                <TodoCard 
                                                    todo={todo}
                                                    index={index}
                                                    id={id}
                                                    innerRef={provided.innerRef}
                                                    draggableProps={provided.draggableProps}
                                                    dragHandleProps={provided.dragHandleProps}
                                                />
                                            )} 
                                        </Draggable>
                                    );
                                })}
                                {provided.placeholder}
                                <div className='flex items-end justify-end p-2'>
                                    <button onClick={handelAddTodo} className='text-green-500 hover:text-green-600'>
                                        <PlusCircleIcon className="h-10 w-10"/>
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </Droppable>
            </div>
        )}
    </Draggable>
  )
}

export default Column
