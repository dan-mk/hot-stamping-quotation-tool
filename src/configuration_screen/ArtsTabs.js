import { getConfigurationArts } from '../helpers';
import { useSelector } from 'react-redux';

export function ArtsTabs(props) {
    const configuration = props.configuration;
    const arts = useSelector(state => getConfigurationArts(state, configuration));

    return (
        <ul>
            { arts.map((art, i) => <li onClick={() => props.onClickTab(art)} key={i}>Art {i + 1}</li>)}
        </ul>
    );
}