'use client'
import React, { useEffect, useState } from 'react'
import Image from 'next/image';
import { DraggableProvidedDragHandleProps, DraggableProvidedDraggableProps } from 'react-beautiful-dnd';
import { PencilSquareIcon, XCircleIcon } from '@heroicons/react/24/solid';

import { Todo, TypeColum } from '@/tyoing';
import getUrl from '@/lib/getUrl';
import ViewTask from './ViewTask';
import { useDispatch } from 'react-redux';
import { deleteTask } from '@/store/slices/BordSlice';
import { openView } from '@/store/slices/ModalSlice';

type Props = {
    todo: Todo;
    index: number;
    id: TypeColum
    innerRef: (element: HTMLElement | null) => void;
    dragHandleProps: DraggableProvidedDragHandleProps | null | undefined;
    draggableProps: DraggableProvidedDraggableProps;
}

function TodoCard({
    todo,
    index,
    id,
    innerRef,
    dragHandleProps,
    draggableProps,
}: Props) {
    const [ImageUrl, setImageUrl] = useState<string | null>(null)
    const dispatch = useDispatch()

    useEffect(() => {
        if (todo.image) {
            const fetchImage = async () => {
                const url = await getUrl(todo.image!)
                if (url) {
                    setImageUrl(url.toString())
                }
            }
            fetchImage()
        }
    }, [todo])
    

    const handelOpenView = () => {
       dispatch(openView())
    }

  return (
    <div
        {...draggableProps}
        {...dragHandleProps}
        ref={innerRef}
        className='bg-white rounded-md space-y-2 drop-shadow-md'
    >
          <div className="flex justify-between  items-center p-5">
              <div className="cursor-pointer" onClick={handelOpenView}>
                    <p className='mb-6 p-1 text-blue-500 text-lg font-bold' >{todo.title}</p>
                    <p className='p-1  mb-3 leading-5 font-mono'>{todo.description}</p>
                    <p className='p-1  leading-5 font-serif w-full flex-nowrap'>
                        Priority:
                        <span className='font-mono ml-2 p-2 bg-gray-300 w-fit rounded-md '>
                            {todo.priority}
                        </span>
                    </p>
              </div>
              <div className="flex flex-col items-center justify-center">
                  <button
                      className='text-red-500 hover:text-red-600 mb-4'
                      onClick={() => dispatch(deleteTask(index, todo, id))}
                  >
                    <XCircleIcon className="ml-5 h-8 w-8 "/>
                </button>
                <button className='text-green-500 hover:text-green-600' >
                    <PencilSquareIcon className="ml-5 h-8 w-8 "/>
                </button>
              </div>
        </div>

        {ImageUrl && (
            <div className="relative h-full w-full rounded-b-md">
                <Image
                    src={ImageUrl}
                    alt="task image"
                    width={400}
                    height={200}
                    className=" w-full object-contain rounded-b-md"
                />
            </div>             
          )}
          <ViewTask
              title={todo.title}
              stats={todo.status}
              description={todo.description}
              priority={todo.priority}
              viewImageUel={ImageUrl}
          />
    </div>
  )
}

export default TodoCard
