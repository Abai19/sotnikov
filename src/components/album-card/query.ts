import axios from 'axios';
import { useQuery } from 'react-query';
import { Image } from '../../types';

export const useImages = (id: number, send: boolean) => {
    const fetchData = async () => {
        const url = `https://jsonplaceholder.typicode.com/photos?albumId=${id}`;

        const response = await axios.get<Image[]>(url);

        return response.data; 

    };

    return useQuery<Image[]>(['images', id, send], fetchData, {
        enabled: send,
    });
};
