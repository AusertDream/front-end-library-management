import React from "react";
import "./navbar.css"
import { AppstoreOutlined, MailOutlined, SettingOutlined } from '@ant-design/icons';
import { Menu } from 'antd';
import { BrowserRouter, Routes, Route, Link,useNavigate } from 'react-router-dom';

const items =[
    {
        key: '1',
        title: '书籍',
        link: '/src/books/books.html'
    },
    {
        key: '2',
        title: '读者',
        link: '/src/readers/readers.html'
    },
    {
        key: '3',
        title: '借阅/归还',
        link: '/src/borrowAndReturn/borrowAndReturn.html'
    },
    {
        key: '4',
        title: '购入/卖出',
        link: '/src/buyAndSold/buyAndSold.html'
    },
    {
        key: '5',
        title: '库存',
        link: '/src/remainder/remainder.html'
    },
]



export default function Navbar(){
    const handleLogout = () => {

    };
    return(
        <div>
            <div>
                <nav className={"navbar"}>
                    <ul className={"nav-menu"}>
                        <li>DXY书店管理系统</li>
                        <li>Admin</li>
                        <a className={"right-text"} href="../../index.html" >登出</a>
                    </ul>

                </nav>
            </div>
            <div>
                <Menu
                    style={{ width: 256 }}
                    defaultSelectedKeys={['1']}
                    mode="inline"
                >
                    {items.map(item => (
                        <Menu.Item key={item.key} title={item.title}>
                            <a href={item.link}>{item.title}</a>
                        </Menu.Item>
                    ))}
                </Menu>
            </div>
        </div>
    )
}


