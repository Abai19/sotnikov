import axios from "axios";
import { useQuery } from "react-query";
import { Post, User } from "../../types";
import { Values } from "./new-post";

export const usePosts = (count: number | string) => {
    const fetchData = async () => {
        const url =
            count === "all"
                ? "https://jsonplaceholder.typicode.com/posts"
                : `https://jsonplaceholder.typicode.com/posts?_start=0&_limit=${count}`;

        const response = await axios.get<Post[]>(url);
        const posts = response.data;
        const authorPromises = posts.map(async (post) => {
            const userResponse = await axios.get<User>(
                `https://jsonplaceholder.typicode.com/users/${post.userId}`
            );
            const user = userResponse.data;
            return {
                ...post,
                author: user.name,
                isFavorite: false,
            };
        });

        const postsWithAuthor = await Promise.all(authorPromises);

        return postsWithAuthor;
    };

    return useQuery<Post[]>("posts", fetchData, {
        enabled: false,
    });
};


export const useUsers = () => {
    const fetchData = async () => {
        const userResponse = await axios.get<User[]>(
            `https://jsonplaceholder.typicode.com/users/`
        );
        return userResponse.data;
    };

    return useQuery<User[]>("users", fetchData, {

    });
};
export const createPost = async (data: Values) => {
    const { data: response } = await axios.post('https://jsonplaceholder.typicode.com/posts', data);
    return response.data;
};
