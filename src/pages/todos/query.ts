import axios from "axios";
import { Todo } from "../../types";
import { useQuery } from "react-query";

export const useTodos = (count: number | string) => {
    const fetchData = async () => {
        const url =
            count === "all"
                ? "https://jsonplaceholder.typicode.com/todos"
                : `https://jsonplaceholder.typicode.com/todos?_start=0&_limit=${count}`;

        const response = await axios.get<Todo[]>(url);
        const todos = response.data;
        return todos.map((todo) => {
            return {
                ...todo,
                checked: false,
            }

        })

    };

    return useQuery<Todo[]>("todos", fetchData, {

    });
};