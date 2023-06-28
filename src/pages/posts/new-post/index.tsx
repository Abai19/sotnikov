import React from 'react';
import { Form, Input, Modal, Select } from 'antd';
import { useUsers } from '../query';

export interface Values {
    title: string;
    body: string;
    userId: number;
}

interface CollectionCreateFormProps {
    open: boolean;
    onCreate: (values: Values) => void;
    onCancel: () => void;
}
const { Option } = Select;
const NewPostModal: React.FC<CollectionCreateFormProps> = ({
    open,
    onCreate,
    onCancel,
}) => {
    const [form] = Form.useForm();
    const { data } = useUsers()
    return (
        <Modal
            open={open}
            title='Новый пост'
            okText='Создать'
            cancelText='Отмена'
            onCancel={onCancel}
            onOk={() => {
                form
                    .validateFields()
                    .then((values) => {
                        form.resetFields();
                        onCreate(values);
                    })
                    .catch((info) => {
                        console.log('Validate Failed:', info);
                    });
            }}
        >
            <Form
                form={form}
                layout="vertical"
                name="form_in_modal"
                initialValues={{ modifier: 'public' }}
            >
                <Form.Item
                    name="title"
                    label="Заголовок"
                    rules={[{ required: true, message: 'Введите заголовок!' }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    name="body"
                    label="Текст"
                    rules={[{ required: true, message: 'Введите текст!' }]}
                >
                    <Input type="textarea" />
                </Form.Item>
                <Form.Item
                    name="userId"
                    label="Пользователь"
                    rules={[{ required: true, message: 'Выберите пользователя!' }]}
                >
                    <Select>
                        {data?.map(user => (
                            <Option key={user.id} value={user.id}>
                                {user.name}
                            </Option>
                        ))}
                    </Select>
                </Form.Item>
            </Form>
        </Modal>
    )
};

export default NewPostModal;