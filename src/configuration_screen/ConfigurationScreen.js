import { Header } from "./Header";
import { ArtsTabs } from "./ArtsTabs";
import { Workspace } from "./Workspace";
import { Resources } from "./Resources";
import { getConfigurationArts } from '../helpers';
import { useSelector } from 'react-redux';
import { useState } from "react";

export function ConfigurationScreen(props) {
    const configuration = props.configuration;

    const arts = useSelector(state => getConfigurationArts(state, configuration));
    let [currentArt, setCurrentArt] = useState(arts[0]);

    const onClickTab = (art) => {
        setCurrentArt(art);
    };

    const style = {
        marginLeft: '100px',
        width: '600px',
    };

    return (
        <div>
            <Header configuration={configuration} />
            <ArtsTabs configuration={configuration} onClickTab={onClickTab} />
            <div style={style}>
                <Workspace art={currentArt} configuration={configuration} />
            </div>
            <Resources configuration={configuration} />
        </div>
    );
}