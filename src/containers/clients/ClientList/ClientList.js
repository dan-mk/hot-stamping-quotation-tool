import { useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { createUseStyles } from 'react-jss';
import { useNavigate } from "react-router-dom";
import { Button, PageHeader, List } from 'antd';
import api from "../../../helpers/api";
import { setClients, setSelectedClient } from "../../../redux/actions/clientActions";
import GStyle from "../../../css/GStyle";
import Style from "./Style";

const useStyles = createUseStyles({ ...GStyle, ...Style });

function ClientList() {
    const classes = useStyles();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const clients = useSelector(state => state.clients);

    const fetchClients = async () => {
        try {
            const response = await api.get('/clients');
            dispatch(setClients(response.data));
        } catch (e) {
            console.log(e);
        }
    };

    useEffect(() => {
        fetchClients();
    }, []);

    return (
        <>
            <PageHeader
                title="Clients"
                className={classes.title}
                extra={[
                    <Button key="1" type="primary" onClick={() => navigate(`/clients/new`)}>
                        New
                    </Button>,
                ]}
            />
            <List
                className={classes.listContainer}
                itemLayout="horizontal"
                dataSource={Object.values(clients.data)}
                renderItem={item => (
                    <List.Item className={classes.listItem} onClick={() => {
                        dispatch(setSelectedClient(item));
                        navigate(`/clients/${item.id}`);
                    }}>
                        <List.Item.Meta
                            title={item.name}
                            description={item.email}
                        />
                    </List.Item>
                )}
            />
        </>
    );
}

export default ClientList;
