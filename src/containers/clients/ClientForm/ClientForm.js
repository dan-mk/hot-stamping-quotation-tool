import { createUseStyles } from 'react-jss';
import { PageHeader, Form, Input, Button } from 'antd';
import { useNavigate } from "react-router-dom";
import api from "../../../helpers/api";
import Style from './Style';
import GStyle from "../../../css/GStyle";

const useStyles = createUseStyles({ ...GStyle, ...Style });

function ClientForm() {
    const classes = useStyles();
    const navigate = useNavigate();

    const onFinish = (values) => {
        api.post('/clients', values).then(() => {
            navigate('/clients');
        });
    };
    
    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    return (
        <>
            <PageHeader
                title="Create new client"
                className={classes.title}
                onBack={() => navigate(`/clients`)}
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
                    label="Client name"
                    name="name"
                    rules={[
                        {
                            required: true,
                            message: 'Please input the client name!',
                        },
                    ]}
                >
                    <Input />
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit">
                        Create
                    </Button>
                </Form.Item>
            </Form>
        </>
    );
}

export default ClientForm;
