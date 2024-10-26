'use client'
import Module from "module";
interface Board {
    columns: Map<TypeColum, Column>;
}
type TypeColum = 'todo' | 'inprogress' | 'done';
type PriorityColum = 'low' | 'medium' | 'high';
interface Column {
    id: TypeColum;
    todos: Todo[];
}
interface Todo extends Module.Document {
    $id: string;
    $createdAt: string;
    title: string;
    description: string;
    status: TypeColum;
    priority: PriorityColum;
    image?: Image;
}
interface Image {
    bucketId: string;
    fileId: string;
}