"use client"

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Board, Column, Image, PriorityColum, Todo, TypeColum } from "@/tyoing";
import { getTodosGroupedbyColumn } from "@/lib/getTOdosGroupedByColumn";
import { databases, ID, storage } from "@/appwrith";
import uploadImge from "@/lib/uploadImge";

interface ModalSliceState {
    bord: {
        columns: Map<TypeColum, Column>;
    };
    serchString: string
    newTitleInput: string
    newDescriptionInput: string
    newTaskType: TypeColum
    newTaskPriority : PriorityColum
    image: File | null
}
const initialState: ModalSliceState = {
    bord: {
        columns: new Map<TypeColum, Column>(),
    },
    serchString: "",
    newTitleInput: "",
    newDescriptionInput: "",
    newTaskType: "todo",
    newTaskPriority: "medium",
    image: null
};

interface UpdateTodoInDB {
  todo: Todo;
  columnId: TypeColum;
}
interface DeleteTask {
    taskIndex: number;
    todo: Todo;
    id: TypeColum;
}
interface AddTask {
    newTitleInput: string;
    newDescriptionInput: string;
    newTaskType: TypeColum;
    newTaskPriority: PriorityColum;
    image?: File | null;
}

const bordSlice = createSlice({
  name: "bord",
  initialState,
    reducers: {
        getBord: (state) => {
            async () => state.bord  = await getTodosGroupedbyColumn();
        },
        setBoardState: ((state, action: PayloadAction<Board>) => {
            state.bord = action.payload
        }),
        updateTodoInDB: (_, action: PayloadAction<{todo: Todo, columnId: TypeColum} >) => {
            async() => {
                await databases.updateDocument(
                    process.env.NEXT_PUBLIC_DATABASE_ID!,
                    process.env.NEXT_PUBLIC_TODOS_COLLECTION_ID!,
                    action.payload.todo.$id,
                    {
                        title: action.payload.todo.title,
                        status: action.payload.columnId,
                        description: action.payload.todo.description,
                        priority: action.payload.todo.priority,
                    }
                )
            }
        },
        setSerchString: ((state, action: PayloadAction<string>) => {
            state.serchString = action.payload
        }),
        deleteTask: (state, action: PayloadAction<DeleteTask>) => { 
            async () => {
                const newColumns = new Map(state.bord.columns);
                newColumns.get(action.payload.id)?.todos.splice(action.payload.taskIndex, 1);
                state.bord =  { columns: newColumns } 
                
                if (action.payload.todo.image) {
                    await storage.deleteFile(
                        action.payload.todo.image.bucketId,
                        action.payload.todo.image.fileId
                    );
                }
                await databases.deleteDocument(
                    process.env.NEXT_PUBLIC_DATABASE_ID!,
                    process.env.NEXT_PUBLIC_TODOS_COLLECTION_ID!,
                    action.payload.todo.$id
                );
            }
        },
        setNewTitleInput: ((state, action: PayloadAction<any>) => {
            state.newTitleInput = action.payload.input
        }),
        setNewDescriptionInput: ((state, action: PayloadAction<any>) => {
            state.newDescriptionInput = action.payload.input
        }),
        setNewTaskType: ((state, action: PayloadAction<any>) => {
            state.newTaskType = action.payload.columnId
        }),
        setNewTaskPriority: ((state, action: PayloadAction<any>) => {
            state.newTaskPriority = action.payload.columnId
        }),
        setImage: ((state, action: PayloadAction<File | null>) => {
            state.image = action.payload
        }),
        addTask: ((state, action) => { 
            async () => {
                let file: Image | undefined 
                if (action.payload?.image){
                    const fileUploaded = await uploadImge(action.payload.image)
                    if (fileUploaded) {
                        file = {
                            bucketId: fileUploaded.bucketId,
                            fileId: fileUploaded.$id,
                        }
                    }
                    const { $id } = await databases.createDocument(
                        process.env.NEXT_PUBLIC_DATABASE_ID!,
                        process.env.NEXT_PUBLIC_TODOS_COLLECTION_ID!,
                        ID.unique(),
                        {
                            title: action.payload.newTitleInput,
                            description: action.payload.newDescriptionInput,
                            status: action.payload.newTaskType,
                            priority: action.payload.newTaskPriority,
                            ...(file && { image: JSON.stringify(file) })
                        }
                    )
                    state.newTitleInput = ""
                    state.newDescriptionInput = ""
                    
                    const newColumns = new Map(state.bord.columns)
                    const newTodo: Todo = {
                        $id,
                        $createdAt: new Date().toISOString(),
                        title: action.payload.newTitleInput,
                        description: action.payload.newDescriptionInput,
                        status: action.payload.newTaskType,
                        priority: action.payload.newTaskPriority,
                        ...(file && { image: file })
                    }
                    const column = newColumns.get(action.payload.newTaskType)
                    if (!column) {
                        newColumns.set(action.payload.newTaskType, {
                            id: action.payload.newTaskType,
                            todos: [newTodo],
                        })
                    } else {
                        newColumns.get(action.payload.newTaskType)?.todos.push(newTodo)
                    }
                    state.bord.columns = newColumns
                }
            }
        }),
    },
});

export const {
    getBord,
    setBoardState,
    updateTodoInDB,
    setSerchString,
    deleteTask,
    setNewTitleInput,
    setNewTaskType,
    setNewDescriptionInput,
    setNewTaskPriority,
    setImage,
    addTask,
} = bordSlice.actions;
export default bordSlice.reducer;