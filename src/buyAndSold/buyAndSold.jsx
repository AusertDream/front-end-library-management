import { Button, Form, Input, Popconfirm, Table } from 'antd';
import React, { useContext, useEffect, useRef, useState } from 'react';
const EditableContext = React.createContext(null);
import './buyAndSold.css'
import axios from "axios";

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


const BuyAndSold = () => {
    const [dataSource, setDataSource] = useState([{},]);
    const [count, setCount] = useState(2);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:9000/api/mgr/sell_purchase', {
                    params: {
                        action: 'list_purchase',
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


    const [dataSource2, setDataSource2] = useState([{},]);
    const [count2, setCount2] = useState(2);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:9000/api/mgr/sell_purchase', {
                    params: {
                        action: 'list_sell',
                    },
                });
                if (response.data.ret === 0) {
                    const data = response.data.retlist.map(item => ({
                        sellID: item.sellID,
                        ISBN: item.ISBN,
                        alreadySold: item.alreadySold,
                        price: item.price__price,
                    }));

                    setDataSource2(data);
                    console.log("init completed");
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



    const handleDelete = (key) => {
        const newData = dataSource.filter((item) => item.key !== key);
        setDataSource(newData);
    };
    const handleDelete2 = (key) => {
        const newData = dataSource2.filter((item) => item.key !== key);
        setDataSource2(newData);
    };
    const defaultColumns = [
        {
            title: 'ID',
            dataIndex: 'purchaseID',
            width: '20%',
            editable: true,
        },
        {
            title:'ISBN',
            dataIndex: 'ISBN',
            editable: true,
        },
        {
            title: '数量',
            dataIndex: 'num',
            editable: true,
        },
        {
            title: '总金额',
            dataIndex: 'price',
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

    const defaultColumns2 = [
        {
            title: 'ID',
            dataIndex: 'sellID',
            width: '20%',

        },
        {
            title:'ISBN',
            dataIndex: 'ISBN',

        },
        {
            title: '数量',
            dataIndex: 'alreadySold',

        },
        {
            title: '单价',
            dataIndex: 'price',

        },
        {
            title: '操作',
            dataIndex: 'operation',
            render: (_, record) =>
                dataSource.length >= 1 ? (
                    <Popconfirm title="确认删除?" onConfirm={() => handleDelete2(record.key)}>
                        <a>删除</a>
                    </Popconfirm>
                ) : null,
        },
    ];
    /* 这里这个handleAdd函数就是处理按了添加之后的操作的，与后端互动的地方应该就在这里*/
    /* 下面还有一个handleSave同理*/

    const handleAdd = () => {
        const newData = {
            key: count,
            ID: `0`,
            ISBN: '000000',
            num: `0`,
            totalNum: '0',
        };
        setDataSource([...dataSource, newData]);
        setCount(count + 1);
    };

    const handleAdd2 = async () => {
        try {
            const newData = {
                key: count,
                ID: '1',
                ISBN: '0000000',
                num: '10',
                amount: '100',
            };

            const response = await axios.post('http://127.0.0.1:9000/api/mgr/sell_purchase', {
                action: 'add_purchase',
                data: newData,
            });

            if (response.data.ret === 0) {
                newData.purchaseID = response.data.purchaseID;
                setDataSource2([...dataSource2, newData]);
                setCount2(count + 1);
            } else {
                // 添加失败，可以根据需要进行处理
            }
        } catch (error) {
            // 发生错误，可以根据需要进行处理
        }
    };
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
    return (
        <span >
            <div className={'container'}>
                <h1>
                    购买记录表
                </h1>
            </div>
            <Button
                onClick={handleAdd}
                type="primary"
                style={{
                    marginBottom: 16,
                }}
            >
                添加购买记录
            </Button>
            <Table
                components={components}
                rowClassName={() => 'editable-row'}
                bordered
                dataSource={dataSource}
                columns={columns}
            />
            <div className={'container'}>
                <h1>出售记录表</h1>
            </div>
            <Button
                onClick={handleAdd2}
                type="primary"
                style={{
                    marginBottom: 16,
                }}
            >
                添加出售记录
            </Button>
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
export default BuyAndSold;