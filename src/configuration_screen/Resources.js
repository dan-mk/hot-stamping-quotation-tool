import { useDispatch } from 'react-redux';
import { deleteCliche, deleteFoil } from '../actions';

export function Resources(props) {
    const configuration = props.configuration;
    const cliches = Object.values(configuration.arts).reduce((list, art) => {
        return [...list, ...Object.values(art.steps).reduce((list2, step) => {
            return [...list2, ...Object.values(step.cliches.data)];
        }, [])];
    }, []);
    const foils = Object.values(configuration.arts).reduce((list, art) => {
        return [...list, ...Object.values(art.steps).reduce((list2, step) => {
            return [...list2, ...Object.values(step.foils.data)];
        }, [])];
    }, []);

    const dispatch = useDispatch();

    const onClickDeleteCliche = (configurationId, clicheId) => {
        dispatch(deleteCliche(configurationId, clicheId));
    };

    const onClickDeleteFoil = (configurationId, clicheId) => {
        dispatch(deleteFoil(configurationId, clicheId));
    };

    return (
        <ul>
            { cliches.map(cliche => (
                <li key={'cliche:' + cliche.id}>
                    Cliche {cliche.id} <span onClick={() => onClickDeleteCliche(configuration.id, cliche.id)}>Deletar</span>
                </li>
            )) }
            { foils.map(foil => (
                <li key={'foil:' + foil.id}>
                    Foil {foil.id} <span onClick={() => onClickDeleteFoil(configuration.id, foil.id)}>Deletar</span>
                </li>
            )) }
        </ul>
    );
}