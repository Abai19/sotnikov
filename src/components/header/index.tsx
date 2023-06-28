import { useState } from 'react';
import type { MenuProps } from 'antd';
import { Menu } from 'antd';
import { items } from './consts';

const Header = () => {
    const activeMenu = localStorage.getItem('menu');
    const [current, setCurrent] = useState(activeMenu || 'posts');

    const onClick: MenuProps['onClick'] = (e) => {
        setCurrent(e.key);
        localStorage.setItem('menu', e.key)
    }

    return (
        <Menu
            onClick={onClick}
            selectedKeys={[current]}
            mode="horizontal"
            items={items}
            style={{ justifyContent: 'center' }}
        />
    )
}
export default Header;