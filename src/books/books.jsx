import { Button, Form, Input, Popconfirm, Table } from 'antd';
import React, { useContext, useEffect, useRef, useState } from 'react';
const EditableContext = React.createContext(null);
import "./books.css"
import axios from 'axios';

const EditableRow = ({ index, ...props }) => {
    const [form] = Form.useForm();
    return (
        <Form form={form} component={false}>
            <EditableContext.Provider value={form}>
                <tr {...props} />
            </EditableContext.Provider>
        </Form>
    );
};

const EditableCell = ({
                          title,
                          editable,
                          children,
                          dataIndex,
                          record,
                          handleSave,
                          ...restProps
                      }) => {
    const [editing, setEditing] = useState(false);
    const inputRef = useRef(null);
    const form = useContext(EditableContext);
    useEffect(() => {
        if (editing) {
            inputRef.current.focus();
        }
    }, [editing]);
    const toggleEdit = () => {
        setEditing(!editing);
        form.setFieldsValue({
            [dataIndex]: record[dataIndex],
        });
    };
    const save = async () => {
        try {
            const values = await form.validateFields();
            toggleEdit();
            handleSave({
                ...record,
                ...values,
            });
        } catch (errInfo) {
            console.log('Save failed:', errInfo);
        }
    };
    let childNode = children;
    if (editable) {
        childNode = editing ? (
            <Form.Item
                style={{
                    margin: 0,
                }}
                name={dataIndex}
                rules={[
                    {
                        required: true,
                        message: `${title}是必填的`,
                    },
                ]}
            >
                <Input ref={inputRef} onPressEnter={save} onBlur={save} />
            </Form.Item>
        ) : (
            <div
                className="editable-cell-value-wrap"
                style={{
                    paddingRight: 24,
                }}
                onClick={toggleEdit}
            >
                {children}
            </div>
        );
    }
    return <td {...restProps}>{childNode}</td>;
};
const Books = () => {
    const [dataSource, setDataSource] = useState([]);
    const [count, setCount] = useState(2);
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
            const response = await axios.delete('http://127.0.0.1:9000/api/mgr/book', {
                data: {
                    action: 'del_Book',
                    ISBN: dataSource.find((item) => item.key === key).ISBN,
                },
            });
            if (response.data.ret === 0) {
                const newData = dataSource.filter((item) => item.key !== key);
                setDataSource(newData);
            } else {
                // 删除失败，可以根据需要进行处理
            }
        } catch (error) {
            // 发生错误，可以根据需要进行处理
        }
    };
    const defaultColumns = [
        {
            title: 'ISBN',
            dataIndex: 'ISBN',
            width: '20%',
            editable: true,
        },
        {
            title:'书名',
            dataIndex: 'bookName',
            editable: true,
        },
        {
            title: '作者',
            dataIndex: 'author',
            editable: true,
        },
        {
            title: '价格',
            dataIndex: 'price',
            editable: true,
        },
        {
            title: '操作',
            dataIndex: 'operation',
            render: (_, record) =>
                dataSource.length >= 1 ? (
                    <Popconfirm title="Sure to delete?" onConfirm={() => handleDelete(record.key)}>
                        <a>Delete</a>
                    </Popconfirm>
                ) : null,
        },
    ];

    /* 这里这个handleAdd函数就是处理按了添加之后的操作的，与后端互动的地方应该就在这里*/
    /* 下面还有一个handleSave同理*/

    const handleAdd = async () => {
        try {
            const newData = {
                key: count,
                ISBN: '000000000',
                bookName: 'None',
                author: 'no author',
                price: '0.00',
            };
            setDataSource([...dataSource, newData]);
            setCount(count + 1);

        } catch (error) {
            // 发生错误，可以根据需要进行处理
        }
    };
    const handleSave = (row) => {
        const newData = [...dataSource];
        const index = newData.findIndex((item) => row.key === item.key);
        const item = newData[index];
        newData.splice(index, 1, {
            ...item,
            ...row,
        });
        setDataSource(newData);
        /* 将更新后的 newData 数组设置为新的数据源，从而更新表格中的数据显示。 */

    };
    const components = {
        body: {
            row: EditableRow,
            cell: EditableCell,
        },
    };
    const columns = defaultColumns.map((col) => {
        if (!col.editable) {
            return col;
        }
        return {
            ...col,
            onCell: (record) => ({
                record,
                editable: col.editable,
                dataIndex: col.dataIndex,
                title: col.title,
                handleSave,
            }),
        };
    });
    return (
        <span >
            <div className={"container"}>
                <h1>书籍信息表</h1>
            </div>
            <Button
                onClick={handleAdd}
                type="primary"
                style={{
                    marginBottom: 16,
                }}
            >
                添加书籍
            </Button>
            <Table
                components={components}
                rowClassName={() => 'editable-row'}
                bordered
                dataSource={dataSource}
                columns={columns}
            />
        </span>
    );
};



export default Books;