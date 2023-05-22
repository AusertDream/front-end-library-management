
import {
    EditableProTable,
    ProCard,
    ProFormField,
    ProFormRadio,
} from '@ant-design/pro-components';
import React, { useContext, useEffect, useRef, useState } from 'react';
import "./books.css"
import axios from 'axios';


const waitTime = (time = 100) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(true);
        }, time);
    });
};

const defaultData = [
    {
        id: 1,
        ISBN: 1,
        bookName: '书1',
        author: '作者1',
        price: 15.25,
    },
    {
        id: 2,
        ISBN: 2,
        bookName: '书2',
        author: '作者2',
        price: 11.25,
    },
];





const Books = () => {
    const [editableKeys, setEditableRowKeys] = useState([]);
    const [dataSource, setDataSource] = useState(defaultData);
    const [position, setPosition] = useState('top');
    const columns = [
        {
            title: 'ISBN',
            dataIndex: 'ISBN',
            formItemProps: (form, { rowIndex }) => {
                return {
                    rules: rowIndex > 1 ? [{ required: true, message: '此项为必填项' }] : [],
                };
            },
            editable: true,
            width: '15%',
        },
        {
            title:'书名',
            dataIndex: 'bookName',
            formItemProps: (form, { rowIndex }) => {
                return {
                    rules: rowIndex > 1 ? [{ required: true, message: '此项为必填项' }] : [],
                };
            },
            editable: true,
            width: '15%',
        },
        {
            title: '作者',
            dataIndex: 'author',
            formItemProps: (form, { rowIndex }) => {
                return {
                    rules: rowIndex > 1 ? [{ required: true, message: '此项为必填项' }] : [],
                };
            },
            editable: true,
        },
        {
            title: '价格',
            dataIndex: 'price',
            formItemProps: (form, { rowIndex }) => {
                return {
                    rules: rowIndex > 1 ? [{ required: true, message: '此项为必填项' }] : [],
                };
            },
            editable: true,
        },
        {
            title: '操作',
            valueType: 'option',
            width: 200,
            render: (text, record, _, action) => [
                <a
                    key="editable"
                    onClick={() => {
                        action?.startEditable?.(record.id);
                    }}
                >
                    编辑
                </a>,
                <a
                    key="delete"
                    onClick={() => {
                        setDataSource(dataSource.filter((item) => item.ISBN !== record.ISBN));
                        //如果点击了删除应该做什么，这里可以写前后端的交互
                        handleDelete(record.ISBN)
                    }}
                >
                    删除
                </a>,
            ],
        },
    ];
    //数据初始化
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:9000/api/mgr/book', {
                    params: {
                        action: 'list_Book',
                    },
                });
                if (response.data.ret === 0) {
                    setDataSource(response.data.retlist);
                    console.log("init completed")
                } else {
                    console.log("init failed")
                    // 请求失败，可以根据需要进行处理
                }
            } catch (error) {
                console.error(error)
                // 发生错误，可以根据需要进行处理
            }
        };
        fetchData();
    }, []);


    /* 这里这个handle delete函数就是处理按了删除之后的操作的，与后端互动的地方应该就在这里*/


    const handleDelete = async (key) => {
        try {
            const ISBN = dataSource.find((item) => item.ISBN === key).ISBN;
            // ...) => item.key === key).ISBN;

            const response = await axios.delete('http://127.0.0.1:9000/api/mgr/book', {
                headers: {
                    'Content-Type': 'application/json'
                },
                data: JSON.stringify({
                    action: 'del_Book',
                    ISBN: ISBN
                })
            });

            if (response.data.ret === 0) {
                const newData = dataSource.filter((item) => item.key !== key);
                setDataSource(newData);
            } else {
                // 处理删除失败的情况
            }
        } catch (error) {
            // 处理请求错误的情况
        }
    };



    /* 这里这个handleAdd函数就是处理按了添加之后的操作的，与后端互动的地方应该就在这里*/
    /* 下面还有一个handleSave同理*/

    const handleAdd = async () => {
        try {
            const newData = {
                ISBN: '987654321111',
                bookName: 'None',
                author: 'no author',
                price: '0.00',
            };

            const response = await axios.post('http://127.0.0.1:9000/api/mgr/book', {
                action: 'add_Book',
                data: newData,
            });

            if (response.data.ret === 0) {
                newData.key = response.data.ISBN;
                setDataSource([...dataSource, newData]);
                setCount(count + 1);
            } else {
                // 添加失败，可以根据需要进行处理
            }
        } catch (error) {
            // 发生错误，可以根据需要进行处理
        }
    };

    const handleSave = async (row) => {
        try {
            const response = await axios.put('http://127.0.0.1:9000/api/mgr/book', {
                action: 'modify_Book',
                ISBN: row.ISBN,
                newdata: {
                    ISBN: row.newISBN, // 修改的ISBN值
                    bookName: row.bookName,
                    author: row.author,
                    price: row.price,
                },
            });

            if (response.data.ret === 0) {
                const newData = [...dataSource];
                const index = newData.findIndex((item) => row.key === item.key);
                const item = newData[index];
                newData.splice(index, 1, {
                    ...item,
                    ...row,
                    ISBN: row.newISBN, // 更新修改后的ISBN值
                });
                setDataSource(newData);
            } else {
                // 修改失败，可以根据需要进行处理
            }
        } catch (error) {
            // 发生错误，可以根据需要进行处理
        }
    };


    return (
        <span >
            <div className={"container"}>
                <h1>书籍信息表</h1>
            </div>
             <EditableProTable
                 rowKey="id"
                 maxLength={1000000000000}
                 scroll={{
                     x: 960,
                 }}
                 recordCreatorProps={
                     position !== 'hidden'
                         ? {
                             position: 'top',
                             record: () => ({ id: (Math.random() * 1000000).toFixed(0) }),
                         }
                         : false
                 }
                 loading={false}
                 columns={columns}
                 request={async () => ({
                     data: defaultData,
                     total: 3,
                     success: true,
                 })}
                 value={dataSource}
                 onChange={setDataSource}
                 editable={{
                     type: 'multiple',
                     editableKeys: editableKeys,
                     //数据交互都在onSave这里进行
                     onSave: async (rowKey, data, row) => {
                         handleSave(row)
                         console.log(rowKey, data, row);
                         await waitTime(100);
                     },
                     onChange: setEditableRowKeys,
                 }}
             />
        </span>
    );
};



export default Books;