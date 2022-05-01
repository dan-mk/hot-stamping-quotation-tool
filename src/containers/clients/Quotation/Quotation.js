import { useEffect } from 'react';
import { createUseStyles } from 'react-jss';
import { useSelector, useDispatch } from 'react-redux';
import { useParams, useNavigate } from "react-router-dom";
import { PageHeader, Button, List, Avatar } from 'antd';
import * as moment from 'moment';
import api from '../../../helpers/api';
import { setSelectedQuotation } from '../../../redux/actions/quotationActions';
import { setConfigurations } from '../../../redux/actions/configurationActions';
import GStyle from "../../../css/GStyle";
import Style from "./Style";

const useStyles = createUseStyles({ ...GStyle, ...Style });

function Quotation() {
    const { id, quotationId } = useParams();
    const classes = useStyles();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const quotation = useSelector(state => state.quotations.selected);
    const configurations = useSelector(state => state.configurations);

    const fetchQuotation = async () => {
        if (quotation) {
            return;
        }
        try {
            const response = await api.get(`/quotations/${quotationId}`);
            dispatch(setSelectedQuotation(response.data));
        } catch (e) {
            console.log(e);
        }
    };

    const fetchConfigurations = async () => {
        try {
            const response = await api.get(`/configurations`, {
                params: {
                    quotation_id: quotationId
                },
            });
            dispatch(setConfigurations(response.data));
        } catch (e) {
            console.log(e);
        }
    };

    useEffect(() => {
        fetchQuotation();
        fetchConfigurations();
        return () => {
            dispatch(setConfigurations([]));
        };
    }, []);

    return (
        <>
            <PageHeader
                title={quotation ? quotation.description : '...'}
                className={classes.title}
                onBack={() => navigate(`/clients/${id}`)}
            />
            <PageHeader
                title={'Arts'}
                className={classes.subTitle}
            />
            <div className={classes.listContainer}>
                {Object.values(quotation ? quotation.arts : []).map(item => (
                    <div key={item.id} className={classes.artItem}>
                        <Avatar
                            shape="square"
                            size={128}
                            src={`${api.defaults.baseURL}/uploads/arts/${item.id}.png`}
                        />
                    </div>
                ))}
            </div>
            <PageHeader
                title={'Configurations'}
                className={classes.subTitle}
                style={{ marginTop: '20px' }}
                extra={[
                    <Button key="1" size="small" type="primary" onClick={async () => {
                        await api.post(`configurations`, {
                            quotation_id: quotationId,
                        });
                        fetchConfigurations();
                    }}>
                        New
                    </Button>,
                ]}
            />
            <List
                className={classes.listContainer}
                itemLayout="horizontal"
                dataSource={Object.values(configurations.data)}
                renderItem={(item) => (
                    <List.Item className={classes.listItem} onClick={() => {
                        navigate(`/clients/${id}/quotations/${quotationId}/configurations/${item.id}`);
                    }}>
                        <List.Item.Meta
                            title={item.description}
                            description={`Created at ${moment(item.created_at).format('MM/DD/YYYY')}`}
                        />
                    </List.Item>
                )}
            />
        </>
    );
}

export default Quotation;
