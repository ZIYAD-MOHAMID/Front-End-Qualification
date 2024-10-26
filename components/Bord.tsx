'use client'
import React, { useEffect } from 'react'
import { DragDropContext, Droppable } from 'react-beautiful-dnd'
import { Column as Columna ,Board} from '../tyoing'
import Column from './Column'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/store/store'
import { getBord, setBoardState, updateTodoInDB } from '@/store/slices/BordSlice'

function Bord() {

    const dispatch = useDispatch()
    const bord: Board = useSelector((state: RootState) => state.bord)
    
  useEffect(() => {
    dispatch(getBord())
  }, [dispatch(getBord())])

  const handleOnDragEnd = (result: any) => {
    const { destination, source, type } = result;
    if(!destination) return
    
    if (type === 'column') {
      const entries = Array.from(bord.columns.entries())
      const [removed] = entries.splice(source.index, 1)
      entries.splice(destination.index, 0, removed)
      const rearrangedColumns = new Map(entries)
      dispatch(setBoardState({
        ...bord,
        columns: rearrangedColumns
      }))
    }
    const columns = Array.from(bord.columns)
    const startColIndex = columns[Number(source.droppableId)]
    const finishColIndex = columns[Number(destination.droppableId)]
    
    const startCol: Columna = {
      id: startColIndex[0],
      todos: startColIndex[1].todos,
    }
    const finishCol: Columna = {
      id: finishColIndex[0],
      todos: finishColIndex[1].todos,
    }

    if(!finishCol || !startCol) return

    if (source.index === destination.index && startCol === finishCol) return
    
    const newTodos = startCol.todos
    const [todoMoved] = newTodos.splice(source.index, 1)

    if (startCol.id === finishCol.id) {
      newTodos.splice(destination.index, 0, todoMoved)
      const newCol: Columna = {
        id: startCol.id,
        todos: newTodos,
      }
      const newColums = new Map(bord.columns)
      newColums.set(startCol.id, newCol)

      dispatch(setBoardState({
        ...bord, columns: newColums
      }))
    } else {
      const finishTodos = Array.from(finishCol.todos)
      finishTodos.splice(destination.index, 0, todoMoved)
       
      const newColums = new Map(bord.columns)
      const newCol: Columna = {
        id: startCol.id,
        todos: newTodos,
      }

      newColums.set(startCol.id, newCol)
      newColums.set(finishCol.id, {
        id: finishCol.id,
        todos: finishTodos,
      })
      
      dispatch(updateTodoInDB(todoMoved ,finishCol.id ))

      dispatch(setBoardState({
        ...bord, columns: newColums
      }))
    }
  }
  
  return (
    <>
      <DragDropContext onDragEnd={handleOnDragEnd}>
        <Droppable droppableId='board' direction="horizontal" type="column">
          {(provided) =>
            <div
              className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-7xl mx-auto"
              {...provided.droppableProps}
              ref={provided.innerRef}
            >{
              Array.from(bord.columns.entries()).map(([id, column], index) => (
                <Column
                  key={id}
                  id = {id}
                  todos = { column.todos }
                  index = {index}
                />
              ))
            }</div>
          }
        </Droppable>
      </DragDropContext>
    </>
  )
}
export default Bord
