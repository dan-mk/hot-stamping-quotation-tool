import { useSelector } from 'react-redux';
import '../css/header.css';

export function Header(props) {
    const configuration = props.configuration;
    const quoteId = configuration.quote_id;
    const quote = useSelector(state => state.quotes.data[quoteId]);

    return (
        <header id="header">
            <p>{quote.description}</p>
            <h1>{configuration.description}</h1>
        </header>
    );
}