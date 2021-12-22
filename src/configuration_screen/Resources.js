import { useSelector } from 'react-redux';
import { getConfigurationCliches } from '../helpers';

export function Resources(props) {
    const configuration = props.configuration;
    const cliches = useSelector(state => getConfigurationCliches(state, configuration));

    return (
        <ul>
            { cliches.map((cliche, i) => <li key={cliche.id}>Cliche {i + 1}</li>) }
        </ul>
    );
}