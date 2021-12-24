import { useSelector, useDispatch } from 'react-redux';
import { getConfigurationCliches } from '../helpers';
import { deleteCliche } from '../actions';

export function Resources(props) {
    const configuration = props.configuration;
    const cliches = useSelector(state => getConfigurationCliches(state, configuration));

    const dispatch = useDispatch();

    const onClickDeleteCliche = (clicheId) => {
        dispatch(deleteCliche(clicheId));
    };

    return (
        <ul>
            { cliches.map(cliche => (
                <li key={cliche.id}>
                    Cliche {cliche.sequence} <span onClick={() => onClickDeleteCliche(cliche.id)}>Deletar</span>
                </li>
            )) }
        </ul>
    );
}