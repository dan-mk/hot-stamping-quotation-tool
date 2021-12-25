import { ArtFragment } from "./ArtFragment";
import { Cliche } from "./Cliche";
import { Foil } from "./Foil";
import { useSelector } from 'react-redux';
import { getArtFragments, getConfigurationCliches } from '../helpers';

export function Paper(props) {
    const art = props.art;
    const configuration = props.configuration;
    const usedArtFragments = props.usedArtFragments;
    const positionedCliches = props.positionedCliches;
    const size = props.size;
    const focusPoint = props.focusPoint;
    const zoomMultiplier = props.zoomMultiplier;
    const selectedArtFragments = props.selectedArtFragments;
    const selectedPositionedCliches = props.selectedPositionedCliches;

    let stylePaper = {
        background: 'white',
        position: 'absolute',
        left: -zoomMultiplier * (focusPoint.x + size.width / 2) + 'px',
        top: -zoomMultiplier * (focusPoint.y + size.height / 2) + 'px',
        height: zoomMultiplier * size.height,
        width: zoomMultiplier * size.width,
    };

    const cliches = useSelector(state => getConfigurationCliches(state, configuration));
    const artFragments = useSelector(state => getArtFragments(state, art));
    const positionedFoils = Object.values(configuration.arts[art.id].steps[1].positioned_foils);

    return (
        <div style={stylePaper}>
            {
                positionedFoils.map((positionedFoil, i) => {
                    const position = { x: positionedFoil.x, y: -10 };
                    const size = { height: art.height + 20, width: positionedFoil.width };
                    return <Foil key={i} position={position} size={size} zoomMultiplier={zoomMultiplier} />;
                })
            }
            {
                positionedCliches.map((positionedCliche, i) => {
                    const position = { x: positionedCliche.x, y: positionedCliche.y };
                    const cliche = cliches.find(cliche => cliche.id === positionedCliche.cliche_id);
                    const size = { height: cliche.height, width: cliche.width };
                    const selected = selectedPositionedCliches.includes(cliche.id);
                    return <Cliche key={i} position={position} size={size} zoomMultiplier={zoomMultiplier} selected={selected} />;
                })
            }
            {
                artFragments.map((artFragment, i) => {
                    const position = { x: artFragment.x, y: artFragment.y };
                    const size = { height: artFragment.height, width: artFragment.width };
                    const selected = selectedArtFragments.includes(artFragment.id);
                    const used = usedArtFragments.includes(artFragment.id);
                    return <ArtFragment 
                                key={i}
                                position={position}
                                size={size}
                                zoomMultiplier={zoomMultiplier}
                                selected={selected}
                                used={used} />;
                })
            }
        </div>
    );
}