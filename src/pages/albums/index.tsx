import React, { useState, useEffect } from 'react';
import { Button, Spin, Row, Modal } from 'antd';
import AlbumCard from '../../components/album-card';
import { useAlbums } from './query';
import { AlbumsCardWrapper, AlbumsWrapper, FiltersWrapper, GlobalActionsBlock } from './styles';
import Filters from '../../components/filters';
import { Album, FiltersState } from '../../types';



interface FilteredAlbums extends Album {
    [key: string]: any;
}


const AlbumsPage: React.FC = () => {
    const currentAmountList = localStorage.getItem('albums');
    const [displayCount, setDisplayCount] = useState<number | string>(currentAmountList || 10);
    const [filteredAlbums, setFilteredAlbums] = useState<FilteredAlbums[]>([]);
    const [selectedAlbums, setSelectedAlbums] = useState<number[]>([]);

    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const { data, isLoading, refetch } = useAlbums(displayCount);

    useEffect(() => {
        refetch();
    }, [displayCount]);

    useEffect(() => {
        if (data !== undefined && data?.length > 0) {
            setFilteredAlbums(data);
        }
    }, [data]);

    const handleAddToFavoritesConfirmed = () => {
        setSelectedAlbums([]);
        setShowDeleteConfirm(false);
        localStorage.setItem('favorites', JSON.stringify(selectedAlbums));
        const updatedObjects = filteredAlbums.map((album) => ({
            ...album,
            isFavorite: selectedAlbums.includes(album.id),
        }));
        setFilteredAlbums(updatedObjects);
    };
    const handleCancelAlbums = () => {
        setSelectedAlbums([]);
        setShowDeleteConfirm(false);
    };
    const handleFiltersChange = (filters: FiltersState) => {
        const { displayCount, usernameFilter, favoriteFilter, sortField, sortDirection } = filters;
        let filteredAlbums = data || [];

        if (usernameFilter.length > 0) {
            filteredAlbums = filteredAlbums.filter((post) => usernameFilter.includes(post.author));
        }

        if (favoriteFilter) {
            filteredAlbums = filteredAlbums.filter((post) => post.isFavorite);
        }

        if (sortField) {
            filteredAlbums = filteredAlbums.sort((a, b) => {
                const fieldA = a[sortField];
                const fieldB = b[sortField];

                if (fieldA < fieldB) {
                    return sortDirection === 'asc' ? -1 : 1;
                }
                if (fieldA > fieldB) {
                    return sortDirection === 'asc' ? 1 : -1;
                }
                return 0;
            });
        }

        if (displayCount === 'all') {
            setDisplayCount('all');
            localStorage.setItem('albums', 'all');
        } else {
            const count = typeof displayCount === 'number' ? displayCount : parseInt(displayCount);
            setDisplayCount(count);
            localStorage.setItem('albums', count.toString());
        }
        setFilteredAlbums(filteredAlbums);
    };
    const handleDeleteConfirmed = () => {
        setSelectedAlbums([]);
        setShowDeleteConfirm(false);
        const deletedArr = filteredAlbums.filter((obj) => !selectedAlbums.includes(obj.id));
        setFilteredAlbums(deletedArr);

    };
    const handleAlbumSelection = (albumId: number, selected: boolean) => {
        setSelectedAlbums((prevSelectedPosts) => {
            if (selected) {
                return [...prevSelectedPosts, albumId];
            } else {
                return prevSelectedPosts.filter((id) => id !== albumId);
            }
        });
    };
    if (isLoading) {
        return <Spin size='large' className='spinner' />
    }

    return (
        <AlbumsWrapper>
            <FiltersWrapper>
                <Filters data={data} handleFiltersChange={handleFiltersChange} />
            </FiltersWrapper>
            <Row justify='end' style={{ margin: '20px' }}>
                {selectedAlbums.length > 0 && (
                    <GlobalActionsBlock>
                        <Button onClick={() => setShowDeleteConfirm(true)} key='delete' danger>
                            Удалить
                        </Button>
                        <Button onClick={handleAddToFavoritesConfirmed} key='addToFavorites'>
                            В избранное
                        </Button>
                        <Button onClick={handleCancelAlbums} key='cancel'>
                            отмена
                        </Button>
                    </GlobalActionsBlock>
                )}
            </Row>
            <AlbumsCardWrapper>
                {filteredAlbums && filteredAlbums.map((album) => (
                    <AlbumCard selectedAlbum={selectedAlbums} handleAlbumSelection={handleAlbumSelection} key={album.id} album={album} />
                ))}
            </AlbumsCardWrapper>
            <Modal
                title='Подтверждение'
                open={showDeleteConfirm}
                onOk={handleDeleteConfirmed}
                onCancel={() => setShowDeleteConfirm(false)}
                okText='Удалить'
                cancelText='Отмена'
            >
                <p>Вы действительно хотите удалить альбомы?</p>
            </Modal>
        </AlbumsWrapper>
    );
};

export default AlbumsPage;
