import React from 'react';
import { useQuery } from 'react-query';
import axios from 'axios';
import { Spin } from 'antd';

interface Comment {
    id: number;
    postId: number;
    name: string;
    email: string;
    body: string;
}

interface CommentsProps {
    postId: number;
}

const Comments: React.FC<CommentsProps> = ({ postId }) => {
    const { data: comments, isLoading } = useQuery<Comment[]>(['comments', postId], async () => {
        const response = await axios.get<Comment[]>(`https://jsonplaceholder.typicode.com/comments?postId=${postId}`);
        return response.data;
    });

    if (isLoading) {
        return <Spin />;
    }

    return (
        <div>
            {comments &&
                comments.map((comment) => (
                    <div key={comment.id}>
                        <h4>{comment.name}</h4>
                        <p>{comment.email}</p>
                        <p>{comment.body}</p>
                    </div>
                ))}
        </div>
    );
};

export default Comments;