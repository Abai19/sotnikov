import React, { useEffect, useState } from 'react';
import { Card, Checkbox, Button, Modal, Carousel, Image as ImageAnt, Spin, message, Input } from 'antd';
import { Album, Image } from '../../types';
import { CloseOutlined, DeleteOutlined, EditOutlined, SaveOutlined, StarFilled, StarOutlined } from '@ant-design/icons';
import { useImages } from './query';
import { HeaderWrapper } from './styles';
import { CheckboxChangeEvent } from 'antd/lib/checkbox';

interface Props {
    album: Album;
    selectedAlbum: number[];
    handleAlbumSelection: (id: number, checked: boolean) => void
}

const AlbumCard: React.FC<Props> = ({ album, selectedAlbum, handleAlbumSelection }) => {
    const favorites = localStorage.getItem('favorites-albums');
    const parsedFavorites = favorites ? JSON.parse(favorites) : [];
    const [modalVisible, setModalVisible] = useState(false);
    const [images, setImages] = useState<Image[]>([])
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [deletedAlbum, setDeletedAlbum] = useState<null | number>(null);
    const [editMode, setEditMode] = useState(false);
    const [editedAlbum, setEditedAlbum] = useState(album);
    const [isFavorite, setIsFavorite] = useState(album.isFavorite);

    const [isFavoriteArr, setIsFavoriteArr] = useState<number[]>([]);


    const { data } = useImages(album.id, modalVisible)
    useEffect(() => {
        if (data && data.length > 0) {
            setImages(data)
        }
    }, [data])

    const handleDelete = () => {
        setDeletedAlbum(album.id);
        setShowDeleteConfirm(false);
        message.success('Успешно удалено!');
    };
    const handleCloseModal = () => {
        setModalVisible(false);
    };
    const handleClick = () => {
        setModalVisible(true);
    }
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        e.stopPropagation();
        const { name, value } = e.target;
        setEditedAlbum((prevEditedAlbum) => ({
            ...prevEditedAlbum,
            [name]: value,
        }));
    };
    const handleFavorite = () => {
        if (isFavoriteArr.includes(album.id)) {
            const updatedFavorites = parsedFavorites.filter((id: number) => id !== album.id);
            setIsFavoriteArr(updatedFavorites);
        } else {
            const updatedFavorites = [...parsedFavorites, album.id];
            setIsFavoriteArr(updatedFavorites);
        }

        setIsFavorite(!isFavorite);
    };
    const handleOnEdit = (event: React.MouseEvent<HTMLElement>) => {
        event.stopPropagation();
        setEditMode(true);
    };
    const handleSave = (event: React.MouseEvent<HTMLElement>) => {
        event.stopPropagation();
        setEditMode(false);
        setEditedAlbum(editedAlbum);
        message.success('Успешно изменено!');
    };
    const handleCancel = (event: React.MouseEvent<HTMLElement>) => {
        event.stopPropagation();
        setEditMode(false);
        setEditedAlbum(album);
    };
    const handleCheckboxChange = (e: CheckboxChangeEvent) => {
        const { checked } = e.target;
        handleAlbumSelection(album.id, checked);
    };
    const onOpenModalDelete = (event: React.MouseEvent<HTMLElement>) => {
        event.stopPropagation();
        setShowDeleteConfirm(true)
    }
    if (deletedAlbum === album.id) {
        return null;
    }
    return (
        <>
            <Card

                style={{
                    width: "300px",
                    justifyContent: 'space-between',
                    display: 'flex',
                    flexDirection: 'column',
                    border: album.isFavorite
                        ? '2px solid #F16E6E'
                        : selectedAlbum.includes(album.id)
                            ? '2px solid #1677ff'
                            : '1px solid #f0f0f0',
                }}
                actions={[
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
                        <Button icon={<EditOutlined />} onClick={handleOnEdit} />
                    ),
                    <Button icon={<DeleteOutlined />} key="delete" onClick={onOpenModalDelete} />,
                    <Button key="favorite" onClick={handleFavorite}>
                        {isFavorite ? (
                            <StarFilled style={{ color: '#F16E6E' }} />
                        ) : (
                            <StarOutlined />
                        )}
                    </Button>,

                ]}
            >
                <HeaderWrapper>
                    {
                        editMode ? (
                            <Input name="author" style={{ width: 'auto', marginBottom: '5px' }} value={editedAlbum.author} onChange={handleInputChange} />
                        ) : (
                            editedAlbum.author
                        )
                    }

                    <Checkbox
                        checked={selectedAlbum.includes(album.id)}
                        onChange={handleCheckboxChange}
                    />
                </HeaderWrapper>
                {
                    editMode ? (
                        <Input name="title" value={editedAlbum.title} onChange={handleInputChange} />
                    ) : (
                        <p style={{ cursor: 'pointer' }} onClick={handleClick}>{editedAlbum.title}</p>
                    )
                }

            </Card>
            <Modal
                style={{ minWidth: "400px" }}
                title={album.title}
                open={modalVisible}
                onCancel={handleCloseModal}
                footer={null}>
                <Carousel
                    slidesToShow={4}
                    slidesToScroll={4}
                >
                    {
                        images.length > 0 ? images.map(image => (
                            <ImageAnt
                                key={image.id}
                                preview={{
                                    src: image.url
                                }}
                                style={{ width: '100%' }}
                                src={image.thumbnailUrl}
                                alt={image.title}
                            />
                        )) : <Spin size='large' />
                    }
                </Carousel >

            </Modal>
            <Modal
                title="Подтвердите действие"
                open={showDeleteConfirm}
                onOk={handleDelete}
                onCancel={() => setShowDeleteConfirm(false)}
                okText="Удалить"
                cancelText="Отмена"
            >
                <p>Вы уверены, что хотите удалить альбом?</p>
            </Modal>
        </>
    );
};

export default AlbumCard;
