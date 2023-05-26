import {Button, Form, Input, Popconfirm, Table, Select, message} from 'antd';
import React, { useContext, useEffect, useRef, useState } from 'react';
const EditableContext = React.createContext(null);
import './borrowAndReturn.css'
import axios from 'axios';
import moment from 'moment';

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


const BorrowAndReturn = () => {
    const [dataSource, setDataSource] = useState([]);
    const [count, setCount] = useState(2);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:9000/api/mgr/borrow_return', {
                    params: {
                        action: 'list_borrow',
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

    const [dataSource2, setDataSource2] = useState([]);
    const [count2, setCount2] = useState(2);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:9000/api/mgr/borrow_return', {
                    params: {
                        action: 'list_return',
                    },
                });
                if (response.data.ret === 0) {
                    setDataSource2(response.data.retlist);
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


    // 前端代码


    const handleDelete = async (key) => {
        try {
            const borrowItem = dataSource.find((item) => item.borrowID === key);
            const borrowID = borrowItem.borrowID;
            const ISBN = borrowItem.ISBN;
            await axios.post('http://127.0.0.1:9000/api/mgr/borrow_return', {
                action: 'delete_borrow',
                borrowID: borrowID,
                ISBN: ISBN,
            });

            // 更新数据源
            setDataSource(dataSource.filter(item => item.borrowID !== key));
            alert(message);


        } catch (error) {
            console.error(error);
        }
    };

    const defaultColumns = [
        {
            title: 'ID',
            dataIndex: 'borrowID',
            width: '20%',
            editable: false,
        },

        {
            title: 'ISBN',
            dataIndex: 'ISBN_id',
            editable: false,
        },

        {
            title: '读者ID',
            dataIndex: 'readerID_id',
            editable: true,
        },
        {
            title:'日期',
            dataIndex: 'date',
            editable: true,
        },
        {
            title: '操作',
            dataIndex: 'operation',
            render: (_, record) =>
                dataSource.length >= 1 ? (
                    <Popconfirm title="确认删除?" onConfirm={() => handleDelete(record.borrowID)}>
                        <a>删除</a>
                    </Popconfirm>
                ) : null,
        },
    ];

    const defaultColumns2 = [
        {
            title: 'ID',
            dataIndex: 'returnID',
            width: '20%',
            editable: false,
        },

        {
            title: 'ISBN',
            dataIndex: 'ISBN_id',
            editable: false,
        },

        {
            title: '读者ID',
            dataIndex: 'readerID_id',
            editable: false,
        },
        {
            title:'日期',
            dataIndex: 'date',
            editable: true,
        },

    ];
    /* 这里这个handleAdd函数就是处理按了添加之后的操作的，与后端互动的地方应该就在这里*/
    /* 下面还有一个handleSave同理*/

    const handleAdd = () => {

        const newData = {
            key: count,
            ID: '0',
            ISBN: selectedISBN,
            readerID: selectedReaderID,
            date: '0000-00-00',
        };

        axios
            .post('http://127.0.0.1:9000/api/mgr/borrow_return', {
                action: 'add_borrow',
                data: newData,
            })
            .then((response) => {
                const { ret, message } = response.data;
                if (ret === 0) {
                    // 借阅成功
                    setDataSource([...dataSource, newData]);
                    setCount(count + 1);

                    // 清空选择的ISBN和readerID
                    setSelectedISBN('');
                    setSelectedReaderID('');
                    alert(message);
                } else {
                    // 借阅失败
                    alert(message);
                }
            })
            .catch((error) => {
                console.error(error);
                alert('发生错误，请重试');
            });
    };




    /*没有新增归还记录和  修改功能*/
    const handleSave = (row) => {
        const newData = [...dataSource];
        const index = newData.findIndex((item) => row.key === item.key);
        const item = newData[index];

        /* 这里这个splice方法，用来将修改后的数据，覆盖原来的数据*/
        newData.splice(index, 1, {
            ...item,
            ...row,
        });
        setDataSource(newData);
        /* 将更新后的 newData 数组设置为新的数据源，从而更新表格中的数据显示。 */
    };

    const handleSave2 = (row) => {
        const newData = [...dataSource2];
        const index = newData.findIndex((item) => row.key === item.key);
        const item = newData[index];

        /* 这里这个splice方法，用来将修改后的数据，覆盖原来的数据*/
        newData.splice(index, 1, {
            ...item,
            ...row,
        });
        setDataSource2(newData);
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
    const columns2 = defaultColumns2.map((col) => {
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
                handleSave2,
            }),
        };
    });
    const { Option } = Select;
    const [bookData, setBookData] = useState([]);
    const [readerData, setReaderData] = useState([]);
    useEffect(() => {
        const fetchData1 = async () => {
            try {
                const bookResponse = await axios.get('http://127.0.0.1:9000/api/mgr/CollectionOfBook', {
                    params: {
                        action: 'list_collection',
                    },
                });

                if (bookResponse.data.ret === 0) {
                    setBookData(bookResponse.data.retlist);
                    console.log('Book data initialized successfully');
                } else {
                    console.log('Book data initialization failed');
                }

                const readerResponse = await axios.get('http://127.0.0.1:9000/api/mgr/reader', {
                    params: {
                        action: 'list_reader',
                    },
                });

                if (readerResponse.data.ret === 0) {
                    setReaderData(readerResponse.data.retlist);
                    console.log('Reader data initialized successfully');
                } else {
                    console.log('Reader data initialization failed');
                }
            } catch (error) {
                console.error(error);
            }
        };
        fetchData1();
    }, []);
    const [selectedISBN, setSelectedISBN] = useState('');
    const [selectedReaderID, setSelectedReaderID] = useState('');



    return (
        <span >
            <div className={'container'}>
                <h1>借阅记录表</h1>
            </div>

            <Table
                components={components}
                rowClassName={() => 'editable-row'}
                bordered
                dataSource={dataSource}
                columns={columns}
            />
            <Button
                onClick={handleAdd}
                type="primary"
                style={{
                    marginBottom: 16,
                }}
            >
                添加借阅记录
            </Button>
            <div>
                <label>ISBN：</label>
                <Select
                    style={{ width: 200 }}
                    value={selectedISBN}
                    onChange={value => setSelectedISBN(value)}
                >
                    {bookData.map((CollectionOfBook) => (
                        <Option key={CollectionOfBook.ISBN_id} value={CollectionOfBook.ISBN_id}>
                                {CollectionOfBook.ISBN_id}
                        </Option>
                ))}
                </Select>
            </div>
            <div>
                <label>Reader ID：</label>
                <Select
                    style={{ width: 200 }}
                    value={selectedReaderID}
                    onChange={value => setSelectedReaderID(value)}
                >
                    {readerData.map((reader) => (
                        <Option key={reader.readerID} value={reader.readerID}>
                            {reader.readerID}
                        </Option>
                    ))}
                </Select>
            </div>






            <div className={'container'}>
                <h1>归还记录表</h1>
            </div>

            <Table
                components={components}
                rowClassName={() => 'editable-row'}
                bordered
                dataSource={dataSource2}
                columns={columns2}
            />
        </span>
    );
};
export default BorrowAndReturn;