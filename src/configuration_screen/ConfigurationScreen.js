import { Header } from "./Header";
import { ArtsTabs } from "./ArtsTabs";
import { Workspace } from "./Workspace";
import { Resources } from "./Resources";
import { OverallQuotationScreen } from "./OverallQuotationScreen";
import { getConfigurationArts } from '../helpers';
import { useSelector } from 'react-redux';
import { useState } from "react";
import '../css/configuration-screen.css';

export function ConfigurationScreen(props) {
    const configuration = props.configuration;

    const arts = useSelector(state => getConfigurationArts(state, configuration));
    const [currentArt, setCurrentArt] = useState(1);
    const [showQuotationScreen, setShowQuotationScreen] = useState(false);

    const onClickTab = (artIndex) => {
        setCurrentArt(artIndex);
    };

    return (
        <div id="content-container">
            <div id="header-container">
                <Header configuration={configuration} />
                <div id="calculate-container">
                    <button onClick={() => setShowQuotationScreen(true)}>Calculate</button>
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
                                        onClickClose={() => setShowQuotationScreen(false)} /> }
        </div>
    );
}