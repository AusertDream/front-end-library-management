import React, { useState } from 'react';
import { UserOutlined } from '@ant-design/icons';
import { Input, Button } from 'antd';
import axios from 'axios';
import { Alert, Space } from 'antd';
import { BrowserRouter, Routes, Route, Link,useNavigate } from 'react-router-dom';



 function App() {
    const [username, setUsername] = useState(''); // 定义保存用户名的状态
    const [password, setPassword] = useState(''); // 定义保存密码的状态
    const navigate = useNavigate();
    const handleLogin = () => {
        // 构造请求数据
        const data = new URLSearchParams();
        data.append('username', username);
        data.append('password', password);

        axios
            .post('http://127.0.0.1:9000/api/mgr/signin', data)
            .then(response => {
                // 登录成功的处理逻辑
                navigate('./src/books/books.html');
                console.log(response.data); // 输出服务器响应的数据
            })
            .catch(error => {
                // 登录失败的处理逻辑
                console.error(error); // 输出错误信息
            });
    };

    return (
        <div>
            <div className="container">
                <h1>DXY书店管理系统</h1>
            </div>
            <div className="login">
                <h2>请登录！</h2>
                <Input
                    placeholder="登录名"
                    prefix={<UserOutlined />}
                    value={username}
                    onChange={e => setUsername(e.target.value)} // 更新用户名的状态
                />
                <Input.Password
                    placeholder="密码"
                    value={password}
                    onChange={e => setPassword(e.target.value)} // 更新密码的状态
                />
                <Button onClick={handleLogin}>登录</Button>
            </div>
            <div>
                <a href="/src/books/books.html">去管理员界面</a>
            </div>
        </div>
    );
}

export default function Login(){
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<App />} />
            </Routes>
        </BrowserRouter>
    );
}

