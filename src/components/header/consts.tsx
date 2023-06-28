import { CheckSquareOutlined, FileImageOutlined, BookOutlined} from '@ant-design/icons';
import type { MenuProps } from 'antd/lib/menu';
import { Link } from 'react-router-dom';

export const items: MenuProps['items'] = [
  {
    label: (
      <Link to="/posts">
        Посты
      </Link>
    ),
    key: 'posts',
    icon: <BookOutlined />,
  },
  {
    label: (
      <Link to="/albums">
        Фото
      </Link>
    ),
    key: 'albums',
    icon: <FileImageOutlined />,
  },
  {
    label: (
      <Link to="/todos">
        Задачи
      </Link>
    ),
    key: 'todos',
    icon: <CheckSquareOutlined />
  },
];
