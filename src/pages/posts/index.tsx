import React, { useEffect, useState } from 'react';
import { createPost, usePosts } from './query';
import { PostsWrapper, GlobalActionsBlock, PostContainer, FiltersWrapper } from './styles';
import { Spin, Row, Button, Modal, message } from 'antd';
import PostCard from '../../components/post-card';
import { FiltersState, Post } from '../../types';

import Filters from '../../components/filters';
import NewPostModal, { Values } from './new-post';
import { useMutation } from 'react-query';


interface FilteredPost extends Post {
	[key: string]: any;
}

const Posts: React.FC = () => {
	const currentAmountList = localStorage.getItem('posts');
	const [displayCount, setDisplayCount] = useState<number | string>(currentAmountList || 10);
	const [selectedPosts, setSelectedPosts] = useState<number[]>([]);
	const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
	const [showNewPost, setShoNewPost] = useState(false);

	const { data, isLoading, refetch } = usePosts(displayCount);
	const [filteredPosts, setFilteredPosts] = useState<FilteredPost[]>([]);
	const { mutate } = useMutation(createPost, {
		onSuccess: () => {
			message.success('Успешно создано!')
		},
		onError: () => {
			message.error('Что то пошло не так!')
		}
	});

	useEffect(() => {
		if (data !== undefined && data?.length > 0) {
			setFilteredPosts(data);
		}
	}, [data]);

	const handlePostSelection = (postId: number, selected: boolean) => {
		setSelectedPosts((prevSelectedPosts) => {
			if (selected) {
				return [...prevSelectedPosts, postId];
			} else {
				return prevSelectedPosts.filter((id) => id !== postId);
			}
		});
	};

	const handleDeleteConfirmed = () => {
		setSelectedPosts([]);
		setShowDeleteConfirm(false);
		const deletedArr = filteredPosts.filter((obj) => !selectedPosts.includes(obj.id));
		setFilteredPosts(deletedArr);

	};

	const handleAddToFavoritesConfirmed = () => {
		setSelectedPosts([]);
		setShowDeleteConfirm(false);
		localStorage.setItem('favorites', JSON.stringify(selectedPosts));
		const updatedObjects = filteredPosts.map((post) => ({
			...post,
			isFavorite: selectedPosts.includes(post.id),
		}));
		setFilteredPosts(updatedObjects);
	};

	const handleCancelPosts = () => {
		setSelectedPosts([]);
		setShowDeleteConfirm(false);
	};

	useEffect(() => {
		refetch();
	}, [displayCount]);

	const handleFiltersChange = (filters: FiltersState) => {
		const { displayCount, usernameFilter, favoriteFilter, sortField, sortDirection } = filters;
		let filteredData = data || [];

		if (usernameFilter.length > 0) {
			filteredData = filteredData.filter((post) => usernameFilter.includes(post.author));
		}

		if (favoriteFilter) {
			filteredData = filteredData.filter((post) => post.isFavorite);
		}

		if (sortField) {
			filteredData = filteredData.sort((a, b) => {
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
			localStorage.setItem('posts', 'all');
		} else {
			const count = typeof displayCount === 'number' ? displayCount : parseInt(displayCount);
			setDisplayCount(count);
			localStorage.setItem('posts', count.toString());
		}
		setFilteredPosts(filteredData);
	};
	const onCreate = (values: Values) => {
		mutate(values);
		setShoNewPost(false);
		setFilteredPosts((prevFilteredPosts) => [...prevFilteredPosts, {
			...values,
			id: Math.floor(Math.random() * (200 - 100 + 1)) + 100,
			isFavorite: false,
			author: 'own user'
		}]);
	}

	if (isLoading) {
		return <Spin size='large' className='spinner' />;
	}

	return (
		<PostsWrapper>
			<FiltersWrapper>
				<Filters data={data} handleFiltersChange={handleFiltersChange} />
				<Button
					type='primary'
					onClick={() => setShoNewPost(true)}>
					Создать пост
				</Button>
			</FiltersWrapper>

			<Row justify='end' style={{ margin: '20px' }}>
				{selectedPosts.length > 0 && (
					<GlobalActionsBlock>
						<Button onClick={() => setShowDeleteConfirm(true)} key='delete' danger>
							Удалить
						</Button>
						<Button onClick={handleAddToFavoritesConfirmed} key='addToFavorites'>
							В избранное
						</Button>
						<Button onClick={handleCancelPosts} key='cancel'>
							отмена
						</Button>
					</GlobalActionsBlock>
				)}
			</Row>
			<PostContainer>
				{filteredPosts.length > 0 && filteredPosts.map((post) => (
					<PostCard
						key={post.id}
						post={post}
						selectedPosts={selectedPosts}
						handlePostSelection={handlePostSelection}
					/>
				))}
			</PostContainer>
			<Modal
				title='Подтверждение'
				open={showDeleteConfirm}
				onOk={handleDeleteConfirmed}
				onCancel={() => setShowDeleteConfirm(false)}
				okText='Удалить'
				cancelText='Отмена'
			>
				<p>Вы действительно хотите удалить посты?</p>
			</Modal>

			<NewPostModal
				open={showNewPost}
				onCreate={onCreate}
				onCancel={() => {
					setShoNewPost(false);
				}}
			/>
		</PostsWrapper>
	);
};

export default Posts;
