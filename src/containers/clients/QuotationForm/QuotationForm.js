import { useEffect, useState } from 'react';
import { createUseStyles } from 'react-jss';
import { useSelector, useDispatch } from 'react-redux';
import { PageHeader, Form, Input, Button, Upload } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { useParams, useNavigate } from "react-router-dom";
import api from "../../../helpers/api";
import { setClient } from "../../../redux/actions/clientActions";
import Style from './Style';
import GStyle from "../../../css/GStyle";

const useStyles = createUseStyles({ ...GStyle, ...Style });

function QuotationForm() {
    const { id } = useParams();
    const classes = useStyles();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const client = useSelector(state => state.clients.data[id]);
    const [fileList, setFileList] = useState([]);

    const fetchClient = async () => {
        if (client) {
            return;
        }
        try {
            const response = await api.get(`/clients/${id}`);
            dispatch(setClient(response.data));
        } catch (e) {
            console.log(e);
        }
    };

    useEffect(() => {
        fetchClient();
    }, []);

    const onChangeFileList = ({ fileList }) => {
        setFileList(fileList);
    };

    const onFinish = (values) => {
        values.client_id = id;
        api.post('/quotations', values).then((response) => {
            const quotationId = response.data.id;
            const formData = new FormData();

            fileList.forEach((file) => {
                formData.append('images', file.originFileObj);
            });

            api.post(`/quotations/${quotationId}/arts`, formData).then(() => {
                // navigate(`/clients/${id}/quotations/${quotationId}`);
            });
        });
    };

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    return (
        <>
            <PageHeader
                title={`Create new quotation for client ${client ? client.name : '...'}`}
                className={classes.title}
                onBack={() => navigate(`/clients/${id}`)}
            />
            <Form
                name="basic"
                layout="vertical"
                className={classes.formContainer}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
            >
                <Form.Item
                    label="Description"
                    name="description"
                    rules={[
                        {
                            required: true,
                            message: 'Please input the description!',
                        },
                    ]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="Images"
                    name="images"
                    valuePropName=""
                    rules={[
                        {
                            validator: () => {
                                if (fileList.length === 0) {
                                    return Promise.reject(new Error('Please select at least one image!'));
                                } else {
                                    return Promise.resolve();
                                }
                            }
                        },
                    ]}
                >
                    <Upload
                        listType="picture"
                        className="upload-list-inline"
                        beforeUpload={() => false}
                        multiple
                        onChange={onChangeFileList}
                    >
                        <Button icon={<UploadOutlined />}>Select images</Button>
                    </Upload>
                </Form.Item>

                <Form.Item style={{ marginTop: '20px' }}>
                    <Button type="primary" htmlType="submit">
                        Create
                    </Button>
                </Form.Item>
            </Form>
        </>
    );
}

export default QuotationForm;
