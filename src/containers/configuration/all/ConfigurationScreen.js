import { Header } from "./Header";
import { ArtsTabs } from "./ArtsTabs";
import { Workspace } from "./Workspace";
import { Resources } from "./Resources";
import { OverallQuotationScreen } from "./OverallQuotationScreen";
import { getAllArtFragments, isEverythingSet, getArtFragmentIdsByStep } from './../../../helpers';
import { useEffect, useState } from "react";
import './../../../css/configuration-screen.css';
import api from "../../../helpers/api";
import { deleteStep, setFoilOffsets } from "../../../redux/actions/configurationActions";
import { useDispatch } from "react-redux";
import { setLoading } from "../../../redux/actions/uiActions";
import { FoilMargin } from "./FoilMargin";

export function ConfigurationScreen(props) {
    const configuration = props.configuration;

    const arts = configuration.quotation.arts;
    const [currentArt, setCurrentArt] = useState(1);
    const [showQuotationScreen, setShowQuotationScreen] = useState(false);
    const quotationInstances = configuration.quotation_instances;

    const allArtFragments = getAllArtFragments(configuration);
    const everythingSet = isEverythingSet(configuration, allArtFragments);
    const styleCalculate = {
        color: everythingSet ? '' : 'darkgray',
        pointerEvents: everythingSet ? 'all' : 'none',
    };

    const isConfigurationFinished = (Object.keys(configuration.quotation_instances).length > 0);

    const dispatch = useDispatch();

    const onClickTab = (artIndex) => {
        setCurrentArt(artIndex);
    };

    const onCalculate = async () => {
        dispatch(setLoading(true));
        for (const artIndex in configuration.arts) {
            const art = { ...configuration.arts[artIndex], index: artIndex };
            for (const stepIndex in art.steps) {
                const stepHasNoResources = (Object.values(art.steps[stepIndex].cliches.data).length === 0);
                if (art.steps[stepIndex].foil_offsets.length > 0 || stepHasNoResources) {
                    continue;
                }

                const artFragmentIds = getArtFragmentIdsByStep(configuration, art, stepIndex);
                const response = await api.post('/calculate-offsets', {
                    art_fragment_ids: artFragmentIds,
                    foil_margin: configuration.arts['1'].foil_margin,
                });
                const offsets = response.data.offsets;
                dispatch(setFoilOffsets(art.index, stepIndex, offsets));
            }
        }

        for (const artIndex in configuration.arts) {
            const art = { ...configuration.arts[artIndex], index: artIndex };
            const stepIndexes = Object.keys(art.steps);
            stepIndexes.reverse();
            for (const stepIndex of stepIndexes) {
                const stepHasNoResources = (Object.values(art.steps[stepIndex].cliches.data).length === 0);
                if (stepHasNoResources) {
                    dispatch(deleteStep(artIndex, stepIndex));
                }
            }
        }

        setShowQuotationScreen(true);
        dispatch(setLoading(false));
    };

    useEffect(() => {
        api.put(`/configurations/${configuration.id}`, {
            next_cliche_id: configuration.next_cliche_id,
            next_cliche_group_id: configuration.next_cliche_group_id,
            next_foil_id: configuration.next_foil_id,
            next_quotation_instance_id: configuration.next_quotation_instance_id,
            arts: configuration.arts,
            quotation_instances: configuration.quotation_instances,
        });
    }, [JSON.stringify(configuration)]);

    return (
        <div id="content-container">
            <div id="header-container">
                <Header configuration={configuration} />
                <div id="calculate-container">
                    <button style={styleCalculate} onClick={onCalculate}>Calculate</button>
                </div>
            </div>
            <div id="bottom-container">
                <div id="workspace-container">
                    <ArtsTabs configuration={configuration} onClickTab={onClickTab} currentArt={currentArt} />
                    { arts.map((art, i) => {
                        return <Workspace
                            show={i + 1 === currentArt}
                            key={i}
                            art={art}
                            configuration={configuration}
                            isConfigurationFinished={isConfigurationFinished} />
                    }) }
                </div>
                <div id="right-container">
                    <FoilMargin configuration={configuration} isConfigurationFinished={isConfigurationFinished} />
                    <Resources configuration={configuration} />
                </div>
            </div>
            { showQuotationScreen && <OverallQuotationScreen 
                                        configuration={configuration}
                                        onClickClose={() => setShowQuotationScreen(false)}
                                        quotationInstances={quotationInstances} /> }
        </div>
    );
}