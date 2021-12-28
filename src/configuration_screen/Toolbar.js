import '../css/toolbar.css';

export function Toolbar(props) {
    const onClickSelectArtFragments = props.onClickSelectArtFragments;
    const onClickSelectCliches = props.onClickSelectCliches;
    const onClickNewCliche = props.onClickNewCliche;
    const onClickNewFoil = props.onClickNewFoil;
    const selectionType = props.selectionType;

    const clicheDisabled = props.clicheDisabled;
    const foilDisabled = props.foilDisabled;

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
            <span title="Add cliche">
                <div
                    className={"toolbar-option" + (clicheDisabled ? ' toolbar-option-disabled' : '')}
                    onClick={onClickNewCliche}>
                    <img src='add-cliche.png' width="100%" />
                </div>
            </span>
            <span title="Add foil">
                <div
                    className={"toolbar-option" + (foilDisabled ? ' toolbar-option-disabled' : '')}
                    onClick={onClickNewFoil}>
                    <img src='add-foil.png' width="100%" />
                </div>
            </span>
        </div>
    );
}