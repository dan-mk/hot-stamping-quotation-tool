import { Header } from "./Header";
import { ArtsTabs } from "./ArtsTabs";
import { Workspace } from "./Workspace";
import { Resources } from "./Resources";
import { OverallQuotationScreen } from "./OverallQuotationScreen";
import { getAllArtFragments, isEverythingSet, getArtFragmentIdsByStep } from './../../../helpers';
import { useEffect, useState } from "react";
import { useImmer } from 'use-immer';
import './../../../css/configuration-screen.css';
import api from "../../../helpers/api";
import { setFoilOffsets } from "../../../redux/actions/configurationActions";
import { useDispatch } from "react-redux";

export function ConfigurationScreen(props) {
    const configuration = props.configuration;

    const arts = configuration.quotation.arts;
    const [currentArt, setCurrentArt] = useState(1);
    const [showQuotationScreen, setShowQuotationScreen] = useState(false);
    const [quotationInstances, setQuotationInstances] = useImmer({
        next_id: 1,
        data: {}
    });

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

    const addQuotationInstance = () => {
        const number_of_pages = {};
        arts.forEach(art => number_of_pages[art.index] = '');

        setQuotationInstances(draft => {
            draft.data[draft.next_id] = {
                id: draft.next_id,
                locked: false,
                number_of_pages,
                cliche_price: {},
                foil_price: {},
                production_price: null,
            }
            draft.next_id += 1;
        });
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
        addQuotationInstance();
    }, []);

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
                                        quotationInstances={quotationInstances}
                                        setQuotationInstances={setQuotationInstances}
                                        addQuotationInstance={addQuotationInstance} /> }
        </div>
    );
}