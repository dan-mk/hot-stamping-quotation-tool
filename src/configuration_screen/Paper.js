import { ArtFragment } from "./ArtFragment";
import { useSelector } from 'react-redux';
import { getArtFragments } from '../helpers';

export function Paper(props) {
    const art = props.art;
    const size = props.size;
    const focusPoint = props.focusPoint;
    const zoomMultiplier = props.zoomMultiplier;

    let stylePaper = {
        background: 'white',
        position: 'absolute',
        left: -zoomMultiplier * (focusPoint.x + size.width / 2) + 'px',
        top: -zoomMultiplier * (focusPoint.y + size.height / 2) + 'px',
        height: zoomMultiplier * size.height,
        width: zoomMultiplier * size.width,
    };

    const artFragments = useSelector(state => getArtFragments(state, art));

    return (
        <div style={stylePaper}>
            {
                artFragments.map(artFragment => {
                    const position = { x: artFragment.x, y: artFragment.y };
                    const size = { height: artFragment.height, width: artFragment.width };
                    return <ArtFragment position={position} size={size} zoomMultiplier={zoomMultiplier} />;
                })
            }
        </div>
    );
}