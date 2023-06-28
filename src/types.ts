export interface Post {
    id: number;
    title: string;
    body: string;
    userId: number;
    author: string;
    isFavorite: boolean;
    [key: string]: any;
}
export interface User {
    id: 1;
    name: string;
    username: string;
    email: string;
}
export interface FiltersState {
    displayCount: number | string;
    usernameFilter: string[];
    favoriteFilter: boolean;
    sortField: string;
    sortDirection: 'asc' | 'desc';
}
export interface Album {
    userId: number;
    id: number;
    title: string;
    author: string;
    isFavorite: boolean;
    [key: string]: any;
}
export interface Image{
    albumId: number;
    id: number;
    title: string;
    url:string;
    thumbnailUrl: string;
}
export interface Todo {
    userId: number;
    id: number;
    title: string;
    completed: boolean;
    checked: boolean;
}