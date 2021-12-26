import { ArtFragment } from "./ArtFragment";
import { Cliche } from "./Cliche";
import { Foil } from "./Foil";
import { useSelector } from 'react-redux';
import { getArtFragments } from '../helpers';

export function Paper(props) {
    const art = props.art;
    const configuration = props.configuration;
    const usedArtFragments = props.usedArtFragments;
    const usedArtFragmentsAllSteps = props.usedArtFragmentsAllSteps;
    const cliches = props.cliches;
    const size = props.size;
    const focusPoint = props.focusPoint;
    const zoomMultiplier = props.zoomMultiplier;
    const selectedArtFragments = props.selectedArtFragments;
    const selectedCliches = props.selectedCliches;
    const currentStep = props.currentStep;

    let stylePaper = {
        background: 'white',
        position: 'absolute',
        left: -zoomMultiplier * (focusPoint.x + size.width / 2) + 'px',
        top: -zoomMultiplier * (focusPoint.y + size.height / 2) + 'px',
        height: zoomMultiplier * size.height,
        width: zoomMultiplier * size.width,
    };

    const artFragments = useSelector(state => getArtFragments(state, art));
    const foils = Object.values(configuration.arts[art.id].steps[currentStep].foils.data);

    return (
        <div style={stylePaper}>
            {
                foils.map((foil, i) => {
                    const position = { x: foil.x, y: -10 };
                    const size = { height: art.height + 20, width: foil.width };
                    return <Foil key={i} position={position} size={size} zoomMultiplier={zoomMultiplier} />;
                })
            }
            {
                cliches.map((cliche, i) => {
                    const position = { x: cliche.x, y: cliche.y };
                    const size = { height: cliche.height, width: cliche.width };
                    const selected = selectedCliches.includes(cliche.id);
                    return <Cliche key={i} position={position} size={size} zoomMultiplier={zoomMultiplier} selected={selected} />;
                })
            }
            {
                artFragments.map((artFragment, i) => {
                    const position = { x: artFragment.x, y: artFragment.y };
                    const size = { height: artFragment.height, width: artFragment.width };
                    const selected = selectedArtFragments.includes(artFragment.id);
                    const usedAllSteps = usedArtFragmentsAllSteps.includes(artFragment.id);
                    const used = usedArtFragments.includes(artFragment.id);
                    const data = artFragment.data;
                    return <ArtFragment 
                                key={i}
                                position={position}
                                size={size}
                                zoomMultiplier={zoomMultiplier}
                                selected={selected}
                                usedAllSteps={usedAllSteps}
                                used={used}
                                data={data} />;
                })
            }
        </div>
    );
}