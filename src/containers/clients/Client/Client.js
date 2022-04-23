import { useEffect } from 'react';
import { createUseStyles } from 'react-jss';
import { useSelector, useDispatch } from 'react-redux';
import { useParams, useNavigate } from "react-router-dom";
import { PageHeader, Button } from 'antd';
import api from '../../../helpers/api';
import { setClient } from "../../../redux/actions/clientActions";
import GStyle from "../../../css/GStyle";
import Style from "./Style";

const useStyles = createUseStyles({ ...GStyle, ...Style });

function Client() {
    const { id } = useParams();
    const classes = useStyles();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const client = useSelector(state => state.clients.data[id]);

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

    useEffect(() => fetchClient(), []);

    const onDeleteHandler = async () => {
        api.delete(`/clients/${id}`).then(() => {
            navigate('/clients');
        });
    };

    return (
        <PageHeader
            title={client ? client.name : '...'}
            className={classes.title}
            onBack={() => navigate(`/clients`)}
            extra={[
                <Button key="1" type="secondary" onClick={() => onDeleteHandler()}>
                    Delete
                </Button>,
            ]}
        />
    );
}

export default Client;
