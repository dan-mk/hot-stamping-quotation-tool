import { createUseStyles } from 'react-jss';
import Style from "./Style";

const useStyles = createUseStyles(Style);

function ClientCard(props) {
    const { client, onClick } = props;
    const classes = useStyles();

    return (
        <div className={classes.container} onClick={() => onClick(client)}>
            <div>{client.name}</div>
        </div>
    );
}

export default ClientCard;
