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
    let [currentArt, setCurrentArt] = useState(arts[0]);

    const onClickTab = (art) => {
        setCurrentArt(art);
    };

    return (
        <div id="content-container">
            <div>
                <Header configuration={configuration} />
            </div>
            <div id="bottom-container">
                <div id="workspace-container">
                    <ArtsTabs configuration={configuration} onClickTab={onClickTab} />
                    { arts.map((art, i) => {
                        return <Workspace show={art.id === currentArt.id} key={i} art={art} configuration={configuration} />
                    }) }
                </div>
                <div id="resources-container">
                    <Resources configuration={configuration} />
                </div>
            </div>
        </div>
    );
}