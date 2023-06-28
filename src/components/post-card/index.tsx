import React, { useState } from 'react';
import { Button, Card, Checkbox, Input, Modal, message } from 'antd';
import { CommentOutlined, EditOutlined, DeleteOutlined, HeartOutlined, SaveOutlined, CloseOutlined, HeartFilled } from '@ant-design/icons';
import { Component } from './types';
import Comments from '../comments';
import { CheckboxChangeEvent } from 'antd/es/checkbox';

const PostCard: Component = ({ post, handlePostSelection, selectedPosts }) => {
    const favorites = localStorage.getItem('favorites-posts');
    const parsedFavorites = favorites ? JSON.parse(favorites) : [];
    const [activeComments, setActiveComments] = useState<number[]>([]);
    const [editMode, setEditMode] = useState(false);
    const [editedPost, setEditedPost] = useState(post);
    const [deletedPost, setDeletedPost] = useState<null | number>(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [isFavorite, setIsFavorite] = useState(post.isFavorite);
    const [isFavoriteArr, setIsFavoriteArr] = useState<number[]>(parsedFavorites);

    const toggleComments = (postId: number) => {
        setActiveComments((prevActiveComments) => {
            if (prevActiveComments.includes(postId)) {
                return prevActiveComments.filter((id) => id !== postId);
            } else {
                return [...prevActiveComments, postId];
            }
        });
    };

    const handleEdit = () => {
        setEditMode(true);
    };

    const handleSave = () => {
        setEditMode(false);
        setEditedPost(editedPost);
        message.success('Успешно изменено!');
    };

    const handleCancel = () => {
        setEditMode(false);
        setEditedPost(post);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setEditedPost((prevEditedPost) => ({
            ...prevEditedPost,
            [name]: value,
        }));
    };

    const handleDelete = () => {
        setDeletedPost(post.id);
        setShowDeleteConfirm(false);
        message.success('Успешно удалено!');
    };

    const handleFavorite = () => {
        if (isFavoriteArr.includes(post.id)) {
            const updatedFavorites = parsedFavorites.filter((id: number) => id !== post.id);
            setIsFavoriteArr(updatedFavorites);
        } else {
            const updatedFavorites = [...parsedFavorites, post.id];
            setIsFavoriteArr(updatedFavorites);
        }

        setIsFavorite(!isFavorite);
    };
    const handleCheckboxChange = (e: CheckboxChangeEvent) => {
        const { checked } = e.target;
        handlePostSelection(post.id, checked);
    };


    if (deletedPost === post.id) {
        return null;
    }

    return (
        <Card
            key={post.id}
            title={
                editMode ? (
                    <Input name="title" value={editedPost.title} onChange={handleInputChange} />
                ) : (
                    editedPost.title
                )
            }
            style={{
                width: '350px',
                justifyContent: 'space-between',
                display: 'flex',
                flexDirection: 'column',
                maxHeight: activeComments.includes(post.id) ? 'unset' : '400px',
                border: post.isFavorite
                    ? '2px solid #F16E6E'
                    : selectedPosts.includes(post.id)
                        ? '2px solid #1677ff'
                        : '1px solid #f0f0f0',
            }}
            actions={[
                <Button
                    key="comments"
                    type={activeComments.includes(post.id) ? 'primary' : 'default'}
                    onClick={() => toggleComments(post.id)}
                >
                    <CommentOutlined />
                </Button>,
                editMode ? (
                    <div style={{ display: 'flex', gap: '5px' }}>
                        <Button key="save" onClick={handleSave}>
                            <SaveOutlined />
                        </Button>
                        <Button key="cancel" onClick={handleCancel}>
                            <CloseOutlined />
                        </Button>
                    </div>
                ) : (
                    <Button key="edit" onClick={handleEdit}>
                        <EditOutlined />
                    </Button>
                ),
                <Button key="delete" onClick={() => setShowDeleteConfirm(true)}>
                    <DeleteOutlined />
                </Button>,
                <Button key="favorite" onClick={handleFavorite}>
                    {isFavorite ? (
                        <HeartFilled style={{ color: '#F16E6E' }} />
                    ) : (
                        <HeartOutlined />
                    )}
                </Button>,
            ]}
        >
            <Checkbox
                checked={selectedPosts.includes(post.id)}
                onChange={handleCheckboxChange}
                style={{ position: 'absolute', top: '8px', right: '8px' }}
            />
            <p style={{ textAlign: 'right', margin: '0', fontWeight: 'bold' }}>
                {editMode ? (
                    <Input name="author" value={editedPost.author} onChange={handleInputChange} />
                ) : (
                    `@${editedPost.author}`
                )}
            </p>
            <p>{editMode ? <Input.TextArea name="body" value={editedPost.body} onChange={handleInputChange} /> : editedPost.body}</p>
            {activeComments.includes(post.id) && <Comments postId={post.id} />}

            <Modal
                title="Подтвердите действие"
                open={showDeleteConfirm}
                onOk={handleDelete}
                onCancel={() => setShowDeleteConfirm(false)}
                okText="Удалить"
                cancelText="Отмена"
            >
                <p>Вы уверены, что хотите удалить пост?</p>
            </Modal>
        </Card>
    );
};

export default PostCard;
