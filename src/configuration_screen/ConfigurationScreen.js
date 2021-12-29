import { Header } from "./Header";
import { ArtsTabs } from "./ArtsTabs";
import { Workspace } from "./Workspace";
import { Resources } from "./Resources";
import { getConfigurationArts } from '../helpers';
import { useSelector } from 'react-redux';
import { useState } from "react";
import '../css/configuration-screen.css';

export function ConfigurationScreen(props) {
    const configuration = props.configuration;

    const arts = useSelector(state => getConfigurationArts(state, configuration));
    const [currentArt, setCurrentArt] = useState(1);

    const onClickTab = (artIndex) => {
        setCurrentArt(artIndex);
    };

    return (
        <div id="content-container">
            <div>
                <Header configuration={configuration} />
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
        </div>
    );
}