import axios from "axios";
import { useQuery } from "react-query";
import { Album, User } from "../../types";

export const useAlbums = (count: number | string) => {
    const fetchData = async () => {
        const url =
            count === "all"
                ? "https://jsonplaceholder.typicode.com/albums"
                : `https://jsonplaceholder.typicode.com/albums?_start=0&_limit=${count}`;

        const response = await axios.get<Album[]>(url);
        const albums = response.data;
        const authorPromises = albums.map(async (album) => {
            const userResponse = await axios.get<User>(
                `https://jsonplaceholder.typicode.com/users/${album.userId}`
            );
            const user = userResponse.data;
            return {
                ...album,
                author: user.name,
                isFavorite: false,
            };
        });

        const albumsWithAuthor = await Promise.all(authorPromises);

        return albumsWithAuthor;
    };

    return useQuery<Album[]>("albums", fetchData, {
        enabled: false,
    });
};
