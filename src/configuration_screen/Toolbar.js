import { useState } from 'react';
import '../css/toolbar.css';

export function Toolbar(props) {
    const onClickNewCliche = props.onClickNewCliche;
    const onClickReuseCliche = props.onClickReuseCliche;
    const onClickNewFoil = props.onClickNewFoil;

    const clicheDisabled = props.clicheDisabled;
    const foilDisabled = props.foilDisabled;
    const reusableCliches = props.reusableCliches;

    const [clicheOptionsOpen, setClicheOptionsOpen] = useState(false);

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

    return (
        <div id="toolbar-subcontainer">
            <span title="Insert cliche">
                <div
                    className={"toolbar-option" + (clicheDisabled ? ' toolbar-option-disabled' : '')}
                    onClick={openClicheOptions}>
                    <img src='add-cliche.png' width="100%" />
                </div>
                <div className="expanded-toolbar-options" title="" style={{ display: (clicheOptionsOpen ? 'block' : '') }}>
                    <div onClick={onClickNewCliche}>Create new cliche</div>
                    { reusableCliches.length > 0 && <span>or reuse</span> }
                    { reusableCliches.map(cliche => <div key={'reuse' + cliche.group_id} onClick={() => onClickReuseCliche(cliche)}>
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