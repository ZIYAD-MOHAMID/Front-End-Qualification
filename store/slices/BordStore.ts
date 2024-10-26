'use client'

import { create } from 'zustand'

import { ID, databases, storage } from '@/appwrith';

import { Column, TypeColum, PriorityColum ,Board, Todo, Image } from "@/tyoing"

import { getTodosGroupedbyColumn } from '@/lib/getTOdosGroupedByColumn';
import uploadImge from '@/lib/uploadImge';

interface BoardState {
    board: Board;
    getBoard: () => void
    
    setBoardState: (board: Board) => void
    updateTodoInDB: (todo: Todo, columnId: TypeColum) => void
    deleteTask: (taskIndex: number, todo: Todo, id: TypeColum) => Promise<void>
    
    serchString: string
    setSerchString: (serchString: string) => void
    
    newTitleInput: string
    setNewTitleInput: (input: string) => void

    newDescriptionInput: string
    setNewDescriptionInput: (input: string) => void
    
    newTaskType: TypeColum
    setNewTaskType: (columnId: TypeColum)=> void
    newTaskPriority : PriorityColum
    setNewTaskPriority : (columnId: PriorityColum)=> void

    image: File | null
    setImage: (image: File | null) => void

    addTask: (todoTitle:string,todoDescription:string, columnId: TypeColum,priorityColum:PriorityColum, Image?:File|null) => void
}

export const useBoardStore = create<BoardState>((set, get) => ({
    board: {
        columns: new Map<TypeColum, Column>(),
    },
    getBoard: async () => {
        const board = await getTodosGroupedbyColumn();
        set({ board })
    },
    setBoardState: (board => set({ board })),
    updateTodoInDB: async (todo, columnId) => {
        await databases.updateDocument(
            process.env.NEXT_PUBLIC_DATABASE_ID!,
            process.env.NEXT_PUBLIC_TODOS_COLLECTION_ID!,
            todo.$id,
            {
                title: todo.title,
                status: columnId,
            }
        )
    },
    serchString: '',
    setSerchString: (serchString) => set({ serchString }),
    
    deleteTask: async (taskIndex: number, todo: Todo, id: TypeColum) => {

        const newColumns = new Map(get().board.columns);
        
        newColumns.get(id)?.todos.splice(taskIndex, 1);
        
        set({ board: { columns: newColumns } });
        
        if (todo.image) {
            await storage.deleteFile(todo.image.bucketId, todo.image.fileId);
        }

        await databases.deleteDocument(
            process.env.NEXT_PUBLIC_DATABASE_ID!,
            process.env.NEXT_PUBLIC_TODOS_COLLECTION_ID!,
            todo.$id
        );
    },
    
    newTitleInput: "",
    setNewTitleInput: (input: string) => set({ newTitleInput: input }),
    
    newDescriptionInput: "",
    setNewDescriptionInput: (input: string) => set({ newDescriptionInput: input }),
    
    newTaskType: "todo",
    setNewTaskType: (columnId: TypeColum) => set({ newTaskType: columnId }),    
    newTaskPriority : "medium",
    setNewTaskPriority : (columnId: PriorityColum) => set({ newTaskPriority : columnId }),
    
    image: null,
    setImage: (image: File | null) => set({ image }),
    
    addTask: async (todoTitle: string, todoDescription: string,
        columnId: TypeColum, priorityColum: PriorityColum, image?: File | null) =>
    {
        let file: Image | undefined 
        if (image) {
            const fileUploaded = await uploadImge(image)
            if (fileUploaded) {
                file = {
                    bucketId: fileUploaded.bucketId,
                    fileId: fileUploaded.$id,
                }
            }
        }
        const { $id } = await databases.createDocument(
            process.env.NEXT_PUBLIC_DATABASE_ID!,
            process.env.NEXT_PUBLIC_TODOS_COLLECTION_ID!,
            ID.unique(),
            {
                title: todoTitle,
                description: todoDescription,
                status: columnId,
                priority : priorityColum,
                ...(file && { image: JSON.stringify(file)})
            }
        )
        set({ newTitleInput: "" })
        set({ newDescriptionInput: "" })
        set((state) => {
            const newColumns = new Map(state.board.columns)
            const newTodo: Todo = {
                $id,
                $createdAt: new Date().toISOString(),
                title: todoTitle,
                description: todoDescription,
                status: columnId,
                priority: priorityColum,
                ...(file && {image: file})
            }
            const column = newColumns.get(columnId)

            if (!column) {
                newColumns.set(columnId, {
                    id: columnId,
                    todos: [newTodo],
                })
            } else {
                newColumns.get(columnId)?.todos.push(newTodo)
            }
            return {
                board: {
                    columns: newColumns,
                }
            }
        })
    }
}))