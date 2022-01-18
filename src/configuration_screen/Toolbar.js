import { useState } from 'react';
import { useSelector } from 'react-redux';
import '../css/toolbar.css';

export function Toolbar(props) {
    const onClickResetToIdealView = props.onClickResetToIdealView;
    const onClickNewCliche = props.onClickNewCliche;
    const onClickReuseCliche = props.onClickReuseCliche;
    const onClickNewFoil = props.onClickNewFoil;
    const onClickSimulateFoilUse = props.onClickSimulateFoilUse;

    const clicheDisabled = props.clicheDisabled;
    const foilDisabled = props.foilDisabled;
    const reusableCliches = props.reusableCliches;
    const simulateFoilUseDisabled = props.simulateFoilUseDisabled;

    const [clicheOptionsOpen, setClicheOptionsOpen] = useState(false);
    const [foilOptionsOpen, setFoilOptionsOpen] = useState(false);

    const foilTypes = useSelector(state => Object.values(state.foil_types.data));

    const openClicheOptions = (e) => {
        e.stopPropagation();
        setFoilOptionsOpen(false);

        if (clicheOptionsOpen === false) {
            setClicheOptionsOpen(true);
        } else {
            setClicheOptionsOpen(false);
        }

        window.addEventListener('click', () => {
            setClicheOptionsOpen(false);
        }, { once: true });
    };

    const openFoilOptions = (e) => {
        e.stopPropagation();
        setClicheOptionsOpen(false);

        if (foilOptionsOpen === false) {
            setFoilOptionsOpen(true);
        } else {
            setFoilOptionsOpen(false);
        }

        window.addEventListener('click', () => {
            setFoilOptionsOpen(false);
        }, { once: true });
    };

    return (
        <div id="toolbar-subcontainer">
            <span title="Restore initial viewport">
                <div
                    className="toolbar-option" style={{ paddingBottom: '9px', paddingTop: '9px' }}
                    onClick={() => onClickResetToIdealView()}>
                    <img src='reset-ideal-view.png' width="100%" />
                </div>
            </span>
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
                    onClick={openFoilOptions}>
                    <img src='add-foil.png' width="100%" />
                </div>
                <div className="expanded-toolbar-options" title="" style={{ display: (foilOptionsOpen ? 'block' : '') }}>
                    { foilTypes.map(foilType => <div key={'foil' + foilType.id} onClick={() => onClickNewFoil(foilType.id)}>
                        {foilType.description}
                    </div>) }
                </div>
            </span>
            <span title="Simulate foil use">
                <div
                    className={"toolbar-option" + (simulateFoilUseDisabled ? ' toolbar-option-disabled' : '')}
                    onClick={onClickSimulateFoilUse} style={{ paddingTop: '8px', paddingBlock: '8px' }}>
                    <img src='foil-simulation.png' width="100%" />
                </div>
            </span>
        </div>
    );
}