import { getConfigurationArts } from '../helpers';
import { useSelector } from 'react-redux';
import '../css/art-tabs.css';

export function ArtsTabs(props) {
    const configuration = props.configuration;
    const onClickTab = props.onClickTab;
    const currentArt = props.currentArt;
    const arts = useSelector(state => getConfigurationArts(state, configuration));

    return (
        <ul id="arts-nav">
            { arts.map((art, i) => {
                return <li
                    className={currentArt === i + 1 ? 'selected-art' : ''}
                    onClick={() => onClickTab(i + 1)}
                    key={i}>
                        Art {i + 1}
                </li>;
            })}
        </ul>
    );
}