import { Header } from "./Header";
import { ArtsTabs } from "./ArtsTabs";
import { Workspace } from "./Workspace";
import { Resources } from "./Resources";
import { OverallQuotationScreen } from "./OverallQuotationScreen";
import { getAllArtFragments, isEverythingSet, getArtFragmentIdsByStep } from './../../../helpers';
import { useEffect, useState } from "react";
import './../../../css/configuration-screen.css';
import api from "../../../helpers/api";
import { setFoilOffsets } from "../../../redux/actions/configurationActions";
import { useDispatch } from "react-redux";

export function ConfigurationScreen(props) {
    const configuration = props.configuration;

    const arts = configuration.quotation.arts;
    const [currentArt, setCurrentArt] = useState(1);
    const [showQuotationScreen, setShowQuotationScreen] = useState(false);
    const quotationInstances = configuration.quotation_instances ?? {};

    const allArtFragments = getAllArtFragments(configuration);
    const everythingSet = isEverythingSet(configuration, allArtFragments);
    const styleCalculate = {
        color: everythingSet ? '' : 'darkgray',
        pointerEvents: everythingSet ? 'all' : 'none',
    };

    const dispatch = useDispatch();

    const onClickTab = (artIndex) => {
        setCurrentArt(artIndex);
    };

    const onCalculate = async () => {
        for (const artIndex in configuration.arts) {
            const art = { ...configuration.arts[artIndex], index: artIndex };
            for (const stepIndex in art.steps) {
                if (art.steps[stepIndex].foil_offsets !== undefined) {
                    break;
                }

                const artFragmentIds = getArtFragmentIdsByStep(configuration, art, stepIndex);
                const response = await api.post('/calculate-offsets', {
                    art_fragment_ids: artFragmentIds,
                });
                const offsets = response.data.offsets;
                dispatch(setFoilOffsets(art.index, stepIndex, offsets));
            }
        }
        setShowQuotationScreen(true);
    };

    useEffect(() => {
        api.put(`/configurations/${configuration.id}`, {
            next_cliche_id: configuration.next_cliche_id,
            next_cliche_group_id: configuration.next_cliche_group_id,
            next_foil_id: configuration.next_foil_id,
            arts: configuration.arts,
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
                        return <Workspace show={i + 1 === currentArt} key={i} art={art} configuration={configuration} />
                    }) }
                </div>
                <div id="resources-container">
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