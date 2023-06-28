import {FC, PropsWithChildren} from 'react';
import { Post } from '../../types';


export type Props = PropsWithChildren<{
    post: Post;
    selectedPosts: number[];
    handlePostSelection: (id: number, checked: boolean) => void
}>;

export type Component = FC<Props>;
