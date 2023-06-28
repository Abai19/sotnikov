import React, { useEffect, useState } from 'react';
import { Select, Col, Checkbox } from 'antd';
import { CheckboxChangeEvent } from 'antd/lib/checkbox';

const { Option } = Select;
interface IAuthor {
    author: string;
}
interface FiltersProps {
    handleFiltersChange: (filters: FiltersState) => void;
    data: IAuthor[] | undefined;
}

interface FiltersState {
    displayCount: number | string;
    usernameFilter: string[];
    favoriteFilter: boolean;
    sortField: string;
    sortDirection: 'asc' | 'desc';
}

const Filters: React.FC<FiltersProps> = ({ data, handleFiltersChange }) => {
    const [displayCount, setDisplayCount] = useState<number | string>('10');
    const [usernameFilter, setUsernameFilter] = useState<string[]>([]);
    const [favoriteFilter, setFavoriteFilter] = useState(false);
    const [sortField, setSortField] = useState('');
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

    useEffect(() => {
        handleFiltersChange({
            displayCount,
            usernameFilter,
            favoriteFilter,
            sortField,
            sortDirection,
        });
    }, [displayCount, usernameFilter, favoriteFilter, sortField, sortDirection]);

    const handleDisplayCountChange = (value: string) => {
        if (value === 'all') {
            setDisplayCount('all');
        } else {
            setDisplayCount(parseInt(value));
        }
    };

    const handleUsernameFilterChange = (value: string[]) => {
        setUsernameFilter(value);
    };

    const handleFavoriteFilterChange = (e: CheckboxChangeEvent) => {
        setFavoriteFilter(e.target.checked);
    };

    const handleSortChange = (value: string) => {
        setSortField(value);
    };

    const handleSortDirection = (value: 'asc' | 'desc') => {
        setSortDirection(value);
    };
    return (
        <>
            <Col>
                <span style={{ marginRight: '8px' }}>Отображать по:</span>
                <Select value={displayCount.toString()} onChange={handleDisplayCountChange}>
                    <Option value='10'>10</Option>
                    <Option value='20'>20</Option>
                    <Option value='50'>50</Option>
                    <Option value='100'>100</Option>
                    <Option value='all'>все</Option>
                </Select>
            </Col>
            <Col>
                <span style={{ marginRight: '8px' }}>Фильтр по имени</span>
                <Select
                    mode='multiple'
                    style={{ minWidth: '200px' }}
                    placeholder='Выберите имена пользователей'
                    onChange={handleUsernameFilterChange}
                    value={usernameFilter}
                >
                    {
                        data && data.length > 0 && Array.from(new Set(data.map((d) => d.author))).map((author) => (
                            <Option key={author} value={author}>
                                {author}
                            </Option>
                        ))
                    }

                </Select>
            </Col>
            <Col>
                <Checkbox onChange={handleFavoriteFilterChange} checked={favoriteFilter}>
                    Показать только избранные
                </Checkbox>
            </Col>
            <Col>
                <Select value={sortField} onChange={handleSortChange} style={{ marginRight: '5px' }}>
                    <Option value=''>Не сортировать</Option>
                    <Option value='id'>ID</Option>
                    <Option value='title'>Заголовок</Option>
                    <Option value='username'>Имя пользователя</Option>
                    <Option value='isFavorite'>Избранные</Option>
                </Select>
                <Select value={sortDirection} onChange={(value) => handleSortDirection(value)}>
                    <Option value='asc'>По возрастанию</Option>
                    <Option value='desc'>По убыванию</Option>
                </Select>
            </Col>
        </>
    );
};

export default Filters;
