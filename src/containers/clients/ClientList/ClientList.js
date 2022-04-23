import { useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { createUseStyles } from 'react-jss';
import ClientCard from "../../../components/clients/ClientCard/ClientCard";
import Title from "../../../components/common/Title/Title";
import api from "../../../helpers/api";
import { setClients } from "../../../redux/actions/clientActions";
import Style from "./Style";

const useStyles = createUseStyles(Style);

function ClientList() {
    const classes = useStyles();
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

    useEffect(() => fetchClients(), []);

    const onClickCardHandler = (client) => {
        console.log(client);
    };

    return (
        <div className={classes.container}>
            <Title>Clients</Title>
            <div className={classes.cardsContainer}>
                {Object.entries(clients.data).map(([id, client]) => (
                    <ClientCard key={id} client={client} onClick={onClickCardHandler} />
                ))}
            </div>
        </div>
    );
}

export default ClientList;
