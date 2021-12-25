import { useDispatch } from 'react-redux';
import { deleteCliche } from '../actions';

export function Resources(props) {
    const configuration = props.configuration;
    const cliches = Object.values(configuration.arts).reduce((list, art) => {
        return [...list, ...Object.values(art.steps).reduce((list2, step) => {
            return [...list2, ...Object.values(step.cliches.data)];
        }, [])];
    }, []);

    const dispatch = useDispatch();

    const onClickDeleteCliche = (configurationId, clicheId) => {
        dispatch(deleteCliche(configurationId, clicheId));
    };

    return (
        <ul>
            { cliches.map(cliche => (
                <li key={cliche.id}>
                    Cliche {cliche.sequence} <span onClick={() => onClickDeleteCliche(configuration.id, cliche.id)}>Deletar</span>
                </li>
            )) }
        </ul>
    );
}