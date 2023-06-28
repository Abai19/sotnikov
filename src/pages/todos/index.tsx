import React, { useEffect, useState } from 'react';
import { List, Checkbox, Button, Modal, Input, Select } from 'antd';
import { CheckboxChangeEvent } from 'antd/lib/checkbox';
import { Todo } from '../../types';
import { useTodos } from './query';
import { ActionsBlock, TodoBlock, TodosWrapper, FiltersWrapper, FiltersSelects, FilterButtons } from './styles';
import { DeleteOutlined, EditOutlined, SaveOutlined } from '@ant-design/icons';

const Todos: React.FC = () => {
    const [todos, setTodos] = useState<Todo[]>([]);
    const currentAmountList = localStorage.getItem('todos');
    const [displayCount, setDisplayCount] = useState<number | string>(currentAmountList || 10);
    const [filter, setFilter] = useState<string>('all');
    const [sortBy, setSortBy] = useState<string>('default');
    const [showAddModal, setShowAddModal] = useState<boolean>(false);
    const [newTodoTitle, setNewTodoTitle] = useState<string>('');
    const [editingTodoId, setEditingTodoId] = useState<number | null>(null);
    const [editingTodoTitle, setEditingTodoTitle] = useState<string>('');
    const { data, isLoading, refetch } = useTodos(displayCount);

    const handleCheckboxChange = (todoId: number) => (event: CheckboxChangeEvent) => {
        const updatedTodos = todos.map((todo) =>
            todo.id === todoId ? { ...todo, checked: event.target.checked } : todo
        );
        setTodos(updatedTodos);
    };

    useEffect(() => {
        refetch()
    }, [displayCount])

    useEffect(() => {
        if (data && data.length > 0) {
            setTodos(data)
        }
    }, [data])

    const handleEditButtonClick = (todoId: number) => {
        const todo = todos.find((t) => t.id === todoId);
        if (todo) {
            setEditingTodoId(todoId);
            setEditingTodoTitle(todo.title);
        }
    };

    const handleSaveEdit = () => {
        const updatedTodos = todos.map((todo) =>
            todo.id === editingTodoId ? { ...todo, title: editingTodoTitle } : todo
        );
        setTodos(updatedTodos);
        setEditingTodoId(null);
        setEditingTodoTitle('');
    };

    const handleDeleteTodos = (id: number) => {
        const updatedTodos = todos.filter((todo) => todo.id !== id);
        setTodos(updatedTodos);
    };
    const handleDeleteTodosAll = () => {
        const updatedTodos = todos.filter((todo) => !todo.checked);
        setTodos(updatedTodos);
    };
    const handleChangeStatus = (id: number) => {
        const updatedTodos = todos.map((todo) =>
            todo.id === id ? { ...todo, completed: !todo.completed } : todo
        )
        setTodos(updatedTodos);
    };

    const handleAddTodo = () => {
        const newTodo: Todo = {
            checked: false,
            userId: Math.floor(Math.random() * 10) + 1,
            id: Math.floor(Math.random() * 801) + 200,
            title: newTodoTitle,
            completed: false,
        };
        setTodos([...todos, newTodo]);
        setShowAddModal(false);
        setNewTodoTitle('');
    };

    const handleDisplayCountChange = (value: string) => {
        if (value === 'all') {
            setDisplayCount('all');
        } else {
            setDisplayCount(parseInt(value));
        }
    }
    const sortedTodos = [...todos].sort((a, b) => {
        if (sortBy === 'default') {
            return a.completed === b.completed ? 0 : a.completed ? 1 : -1;
        } else if (sortBy === 'title') {
            return a.title.localeCompare(b.title);
        }
        return 0;
    });

    const filteredTodos = sortedTodos.filter((todo) => {
        if (filter === 'all') return true;
        if (filter === 'completed') return todo.completed;
        if (filter === 'outstanding') return !todo.completed;
        return false;
    });


    return (
        <TodosWrapper>

            <FiltersWrapper>
                <FiltersSelects>


                    <Select
                        value={displayCount.toString()}
                        onChange={handleDisplayCountChange}
                        options={[
                            { value: '10', label: 'по 10' },
                            { value: '20', label: 'по 20' },
                            { value: '50', label: 'по 50' },
                            { value: '100', label: 'по 100' },
                            { value: 'all', label: 'все' },
                        ]}
                    />
                    <Select
                        value={filter}
                        onChange={(value) => setFilter(value)}
                        options={[
                            { value: 'all', label: 'все' },
                            { value: 'completed', label: 'завершенные' },
                            { value: 'outstanding', label: 'незавершенные' },
                        ]}
                    />

                    <Select
                        value={sortBy}
                        onChange={(value) => setSortBy(value)}
                        options={[
                            { value: 'default', label: 'По умолчанию' },
                            { value: 'title', label: 'По заголовку' },

                        ]}
                    />
                </FiltersSelects>
                <FilterButtons>
                    {todos.some((todo) => todo.checked) &&
                        <Button danger
                            onClick={handleDeleteTodosAll}
                            disabled={!todos.some((todo) => todo.checked)}>
                            Удалить
                        </Button>
                    }
                    <Button type="primary" onClick={() => setShowAddModal(true)}>
                        Создать
                    </Button>
                </FilterButtons>

            </FiltersWrapper>

            <List
                itemLayout="horizontal"
                dataSource={filteredTodos}
                loading={isLoading}
                bordered
                renderItem={(todo) => (
                    <List.Item>
                        <TodoBlock>
                            <Checkbox checked={todo.checked} onChange={handleCheckboxChange(todo.id)} />
                            <span style={{ textDecoration: todo.completed ? 'line-through' : 'none' }}>
                                {editingTodoId === todo.id ? (
                                    <Input value={editingTodoTitle} onChange={(e) => setEditingTodoTitle(e.target.value)} />
                                ) : (
                                    <span style={{ cursor: 'pointer' }} onClick={() => handleChangeStatus(todo.id)}>
                                        {todo.title}
                                    </span>
                                )}
                            </span>
                        </TodoBlock>
                        <ActionsBlock>
                            {editingTodoId === todo.id ? (
                                <Button type="primary" onClick={handleSaveEdit}>
                                    <SaveOutlined />
                                </Button>
                            ) : (
                                <Button type="primary" onClick={() => handleEditButtonClick(todo.id)}>
                                    <EditOutlined />
                                </Button>
                            )}

                            <Button type="primary" danger onClick={() => handleDeleteTodos(todo.id)}>
                                <DeleteOutlined />
                            </Button>
                        </ActionsBlock>
                    </List.Item>
                )}
            />

            <Modal
                title="Добить новую задачу"
                okText="Создать"
                cancelText="Отмена"
                open={showAddModal}
                onOk={handleAddTodo}
                onCancel={() => setShowAddModal(false)}
            >
                <Input
                    placeholder="Введите заголовок"
                    value={newTodoTitle}
                    onChange={(e) => setNewTodoTitle(e.target.value)}
                />
            </Modal>
        </TodosWrapper>
    );
};

export default Todos;
