import { useEffect } from 'react';
import { createUseStyles } from 'react-jss';
import { useSelector, useDispatch } from 'react-redux';
import { useParams, useNavigate } from "react-router-dom";
import { PageHeader, Button, List, Avatar } from 'antd';
import api from '../../../helpers/api';
import { setSelectedQuotation } from '../../../redux/actions/quotationActions';
import GStyle from "../../../css/GStyle";
import Style from "./Style";

const useStyles = createUseStyles({ ...GStyle, ...Style });

function Quotation() {
    const { id, idQuotation } = useParams();
    const classes = useStyles();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const quotation = useSelector(state => state.quotations.selected);

    const fetchQuotation = async () => {
        if (quotation) {
            return;
        }
        try {
            const response = await api.get(`/quotations/${idQuotation}`);
            dispatch(setSelectedQuotation(response.data));
        } catch (e) {
            console.log(e);
        }
    };

    useEffect(() => {
        fetchQuotation();
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
        </>
    );
}

export default Quotation;
