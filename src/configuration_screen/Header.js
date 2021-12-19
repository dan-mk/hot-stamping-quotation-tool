import { useSelector } from 'react-redux';

export function Header(props) {
    const configuration = props.configuration;
    const quoteId = configuration.quote_id;
    const quote = useSelector(state => state.quotes.data[quoteId]);

    return (
        <div>
            {quote.description}<br />
            {configuration.description}
        </div>
    );
}