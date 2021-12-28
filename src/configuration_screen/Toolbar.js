import { useState } from 'react';
import '../css/toolbar.css';

export function Toolbar(props) {
    const onClickSelectArtFragments = props.onClickSelectArtFragments;
    const onClickSelectCliches = props.onClickSelectCliches;
    const onClickNewCliche = props.onClickNewCliche;
    const onClickReuseCliche = props.onClickReuseCliche;
    const onClickNewFoil = props.onClickNewFoil;
    const selectionType = props.selectionType;

    const clicheDisabled = props.clicheDisabled;
    const cliches = props.cliches;
    const allUniqueCliches = props.allUniqueCliches;
    const foilDisabled = props.foilDisabled;

    const [clicheOptionsOpen, setClicheOptionsOpen] = useState(false);

    const reusableCliches = allUniqueCliches.filter(cliche => !cliches.map(c => c.id).includes(cliche.id));

    const openClicheOptions = (e) => {
        e.stopPropagation();

        if (clicheOptionsOpen === false) {
            setClicheOptionsOpen(true);
        } else {
            setClicheOptionsOpen(false);
        }

        window.addEventListener('click', () => {
            setClicheOptionsOpen(false);
        }, { once: true });
    }

    let styleDivision = {
        height: '2px'
    };

    return (
        <div id="toolbar-subcontainer">
            <span title="Select art fragments">
                <div
                    className={(selectionType === 'art_fragments' ? 'selected ' : '') + "toolbar-option"}
                    onClick={onClickSelectArtFragments}>
                        <img src='select-art-fragments.png' width="100%" />
                </div>
            </span>
            <span title="Select cliches">
                <div
                    className={(selectionType === 'cliches' ? 'selected ' : '') + "toolbar-option"}
                    onClick={onClickSelectCliches}>
                        <img src='select-cliches.png' width="100%" />
                </div>
            </span>
            <div style={styleDivision}></div>
            <span title="Insert cliche">
                <div
                    className={"toolbar-option" + (clicheDisabled ? ' toolbar-option-disabled' : '')}
                    onClick={openClicheOptions}>
                    <img src='add-cliche.png' width="100%" />
                </div>
                <div className="expanded-toolbar-options" title="" style={{ display: (clicheOptionsOpen ? 'block' : '') }}>
                    <div onClick={onClickNewCliche}>Create new cliche</div>
                    { reusableCliches.length > 0 && <span>or reuse</span> }
                    { reusableCliches.map(cliche => <div onClick={() => onClickReuseCliche(cliche)}>
                        Cliche {cliche.group_id}
                    </div>) }
                </div>
            </span>
            <span title="Insert foil">
                <div
                    className={"toolbar-option" + (foilDisabled ? ' toolbar-option-disabled' : '')}
                    onClick={onClickNewFoil}>
                    <img src='add-foil.png' width="100%" />
                </div>
            </span>
        </div>
    );
}