import { ArtFragment } from "./ArtFragment";
import { Cliche } from "./Cliche";
import { Foil } from "./Foil";
import { FoilOverlay } from "./FoilOverlay";
import { useSelector } from 'react-redux';
import { cmToPixels, getArtFragments } from './../../../helpers';

export function Paper(props) {
    const art = props.art;
    const configuration = props.configuration;
    const artFragmentsData = props.artFragmentsData;
    const cliches = props.cliches;
    const size = props.size;
    const focusPoint = props.focusPoint;
    const zoomMultiplier = props.zoomMultiplier;
    const currentStep = props.currentStep;
    const showOnlyPaper = props.showOnlyPaper;
    const isConfigurationFinished = props.isConfigurationFinished;

    const stylePaper = {
        background: 'white',
        boxShadow: '5px 5px 0 #00000025',
        position: 'absolute',
        left: -zoomMultiplier * (focusPoint.x + size.width / 2) + 'px',
        top: -zoomMultiplier * (focusPoint.y + size.height / 2) + 'px',
        height: zoomMultiplier * size.height,
        width: zoomMultiplier * size.width,
    };

    const artFragments = getArtFragments(art);
    const foils = Object.values(configuration.arts[art.index].steps[currentStep].foils.data);
    const foilTypes = useSelector(state => state.foil_types.data);

    return (
        <div style={stylePaper}>
            {
                foils.map((foil, i) => {
                    const position = { x: foil.x, y: 0 };
                    const size = { height: cmToPixels(2) + art.height, width: foil.width };
                    const color = foilTypes[foil.foil_type_id].color;
                    return <Foil 
                                key={i}
                                position={position}
                                size={size}
                                zoomMultiplier={zoomMultiplier}
                                color={color}
                                id={foil.id}
                                showOnlyPaper={showOnlyPaper}
                                isConfigurationFinished={isConfigurationFinished} />;
                })
            }
            {
                cliches.map((cliche, i) => {
                    const position = { x: cliche.x, y: cliche.y };
                    const size = { height: cliche.height, width: cliche.width };
                    return <Cliche
                                key={i}
                                position={position}
                                size={size}
                                zoomMultiplier={zoomMultiplier}
                                id={cliche.id}
                                groupId={cliche.group_id}
                                showOnlyPaper={showOnlyPaper}
                                isConfigurationFinished={isConfigurationFinished} />;
                })
            }
            {
                foils.map((foil, i) => {
                    const position = { x: foil.x, y: 0 };
                    const size = { height: cmToPixels(2) + art.height, width: foil.width };
                    const color = foilTypes[foil.foil_type_id].color;

                    return <FoilOverlay 
                                key={i}
                                position={position}
                                size={size}
                                zoomMultiplier={zoomMultiplier}
                                color={color} />;
                })
            }
            {
                artFragments.map((artFragment, i) => {
                    const position = { x: artFragment.x, y: artFragment.y };
                    const size = { height: artFragment.height, width: artFragment.width };
                    const selected = artFragmentsData[artFragment.id].selected;
                    const hasEverythingCurrentStep = artFragmentsData[artFragment.id].hasEverythingCurrentStep;
                    const hasEverythingOtherStep = artFragmentsData[artFragment.id].hasEverythingOtherStep;
                    const hasAnythingOtherStep = artFragmentsData[artFragment.id].hasAnythingOtherStep;
                    const id = artFragment.id;
                    return <ArtFragment 
                                key={i}
                                position={position}
                                size={size}
                                zoomMultiplier={zoomMultiplier}
                                selected={selected}
                                hasEverythingCurrentStep={hasEverythingCurrentStep}
                                hasEverythingOtherStep={hasEverythingOtherStep}
                                hasAnythingOtherStep={hasAnythingOtherStep}
                                id={id} />;
                })
            }
        </div>
    );
}