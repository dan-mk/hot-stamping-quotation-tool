import { LeftCircleOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import './../../../css/header.css';

export function Header(props) {
    const configuration = props.configuration;
    const navigate = useNavigate();

    return (
        <header id="header">
            <LeftCircleOutlined
                style={{ float: 'left', fontSize: '30px', margin: '12px 20px 10px 0' }}
                onClick={() => navigate(`/clients/${configuration.quotation.client_id}/quotations/${configuration.quotation_id}/`) }
            />
            <p>{configuration.quotation.description}</p>
            <h1>{configuration.description}</h1>
        </header>
    );
}
