import { useEffect } from 'react';
import { createUseStyles } from 'react-jss';
import { useSelector, useDispatch } from 'react-redux';
import { useParams, useNavigate } from "react-router-dom";
import { PageHeader, Button, List, Avatar } from 'antd';
import * as moment from 'moment';
import api from '../../../helpers/api';
import { setSelectedClient } from "../../../redux/actions/clientActions";
import { setQuotations, setSelectedQuotation } from "../../../redux/actions/quotationActions";
import GStyle from "../../../css/GStyle";
import Style from "./Style";

const useStyles = createUseStyles({ ...GStyle, ...Style });

function Client() {
    const { id } = useParams();
    const classes = useStyles();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const client = useSelector(state => state.clients.selected);
    const quotations = useSelector(state => state.quotations);

    const fetchClient = async () => {
        if (client) {
            return;
        }
        try {
            const response = await api.get(`/clients/${id}`);
            dispatch(setSelectedClient(response.data));
        } catch (e) {
            console.log(e);
        }
    };

    const fetchQuotations = async () => {
        try {
            const response = await api.get(`/quotations?client_id=${id}`);
            dispatch(setQuotations(response.data));
        } catch (e) {
            console.log(e);
        }
    };

    useEffect(() => {
        fetchClient();
        fetchQuotations();
        return () => {
            dispatch(setQuotations([]));
        };
    }, []);

    const onDeleteHandler = async () => {
        api.delete(`/clients/${id}`).then(() => {
            navigate('/clients');
        });
    };

    return (
        <>
            <PageHeader
                title={client ? client.name : '...'}
                className={classes.title}
                onBack={() => navigate(`/clients`)}
                extra={[
                    <Button
                        key="1"
                        type="dashed"
                        onClick={() => onDeleteHandler()}
                        disabled={Object.values(quotations.data).length > 0}
                    >
                        Delete
                    </Button>,
                ]}
            />
            <PageHeader
                title={'Quotations'}
                className={classes.subTitle}
                extra={[
                    <Button key="1" size="small" type="primary" onClick={() => navigate(`/clients/${id}/quotations/new`)}>
                        New
                    </Button>,
                ]}
            />
            <List
                className={classes.listContainer}
                itemLayout="horizontal"
                dataSource={Object.values(quotations.data)}
                renderItem={item => (
                    <List.Item className={classes.listItem} onClick={() => {
                        dispatch(setSelectedQuotation(item));
                        navigate(`/clients/${id}/quotations/${item.id}`);
                    }}>
                        <List.Item.Meta
                            avatar={
                                <Avatar
                                    shape="square"
                                    size={72}
                                    src={`${api.defaults.baseURL}/uploads/arts/${item.arts[0].id}.png`}
                                />
                            }
                            title={item.description}
                            description={
                                `${item.arts.length} image${item.arts.length === 1 ? '' : 's'} - ` +
                                `Created at ${moment(item.created_at).format('MM/DD/YYYY')}`
                            }
                        />
                    </List.Item>
                )}
            />
        </>
    );
}

export default Client;
