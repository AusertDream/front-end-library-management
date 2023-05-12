import './login.css'
import { UserOutlined } from '@ant-design/icons';
import { Input } from 'antd';
import {Button} from 'antd';

export default function Login(){

    return(
        <div>
            <div className={'container'}>
                <h1>DXY书店管理系统</h1>
            </div>
            <div className={'login'}>
                <h2>请登录！</h2>
                <Input placeholder="登录名" prefix={<UserOutlined />} />
                <Input.Password placeholder="密码" />
                <Button>
                    登录
                </Button>
            </div>
            <div>
                <a href="/src/books/books.html">去管理员界面</a>
            </div>
        </div>
    )
}

