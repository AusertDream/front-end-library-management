import { Button, Form, Input, Popconfirm, Table } from 'antd';
import React, { useContext, useEffect, useRef, useState } from 'react';
const EditableContext = React.createContext(null);
import "./remainder.css"
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
                    /*设置剩余量检查，数据不能小于零*/
                    {
                        validator: (_, value, callback) => {
                            if (parseInt(value) < 0) {
                                callback('剩余量不能小于零');
                            } else {
                                callback();
                            }
                        },
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
const Remainder = () => {

    const [dataSource, setDataSource] = useState([]);
    const [count, setCount] = useState(2);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:9000/api/mgr/CollectionOfBook', {
                    params: {
                        action: 'list_collection',
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
            await axios.delete('http://127.0.0.1:9000/api/mgr/collection', {
                params: {
                    action: 'del_collection',
                    id: key,
                },
            });

            const newData = dataSource.filter((item) => item.key !== key);
            setDataSource(newData);
        } catch (error) {
            // 发生错误，可以根据需要进行处理
        }
    };

    const defaultColumns = [
        {
            title: 'ISBN',
            dataIndex: 'ISBN_id',
            width: '20%',
            editable: true,
        },

        {
            title: '剩余量',
            dataIndex: 'TotalNum',
            editable: true,
        },
        {
            title: '操作',
            dataIndex: 'operation',
            render: (_, record) =>
                dataSource.length >= 1 ? (
                    <Popconfirm title="确认删除?" onConfirm={() => handleDelete(record.key)}>
                        <a>删除</a>
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
                ISBN: '1234567891234',
                totalNum: '100',
            };

            const response = await axios.post('http://127.0.0.1:9000/api/mgr/collection', {
                action: 'add_collection',
                data: newData,
            });

            if (response.data.ret === 0) {
                newData.id = response.data.id;
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
            const response = await axios.put('http://127.0.0.1:9000/api/mgr/collection', {
                action: 'modify_collection',
                id: row.key,
                newdata: {
                    TotalNum: row.TotalNum,
                },
            });

            if (response.data.ret === 0) {
                const newData = [...dataSource];
                const index = newData.findIndex((item) => row.key === item.key);
                const item = newData[index];
                newData.splice(index, 1, {
                    ...item,
                    ...row,
                });
                setDataSource(newData);
            } else {
                // 修改失败，可以根据需要进行处理
            }
        } catch (error) {
            // 发生错误，可以根据需要进行处理
        }
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
                <h1>书籍库存信息表</h1>
            </div>
            <Button
                onClick={handleAdd}
                type="primary"
                style={{
                    marginBottom: 16,
                }}
            >
                新增记录
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
export default Remainder;