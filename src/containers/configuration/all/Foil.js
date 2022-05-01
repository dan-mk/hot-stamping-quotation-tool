import { useDispatch } from 'react-redux';
import { deleteFoil } from './../../../redux/actions/configurationActions';
import { cmToPixels } from './../../../helpers';

export function Foil(props) {
    const position = props.position;
    const size = props.size;
    const zoomMultiplier = props.zoomMultiplier;
    const color = props.color;
    const id = props.id;
    const showOnlyPaper = props.showOnlyPaper;

    let style = {
        background: `${color}55`,
        borderLeft: '2px dashed #00000022',
        borderRight: '2px dashed #00000022',
        position: 'absolute',
        left: zoomMultiplier * (position.x) + 'px',
        top: zoomMultiplier * (position.y) + 'px',
        height: zoomMultiplier * size.height,
        width: zoomMultiplier * size.width,
    };

    let styleRollBorder = {
        border: '2px solid #00000044',
        position: 'absolute',
        left: zoomMultiplier * (position.x) + 'px',
        top: zoomMultiplier * (position.y + size.height) + 'px',
        height: zoomMultiplier * cmToPixels(2),
        width: zoomMultiplier * size.width,
    };

    let styleRoll = {
        background: `linear-gradient(${color}, ${color}aa)`,
        position: 'absolute',
        left: zoomMultiplier * (position.x) + 'px',
        top: zoomMultiplier * (position.y + size.height) + 'px',
        height: zoomMultiplier * cmToPixels(2),
        width: zoomMultiplier * size.width,
    };

    let styleRollBehind = { ...styleRoll, background: 'black' };

    let styleLabel = {
        background: 'white',
        borderRadius: '3px',
        boxShadow: '0 0 3px #00000088',
        fontSize: '14px',
        padding: '3px 6px',
        pointerEvents: 'none',
        position: 'absolute',
        left: zoomMultiplier * (position.x) + 'px',
        top: (zoomMultiplier * (position.y + size.height + cmToPixels(2)) + 5) + 'px',
        zIndex: '1',
    }

    let styleX = {
        color: 'red',
        cursor: 'pointer',
        marginLeft: '8px',
        pointerEvents: 'all',
        position: 'relative',
    };

    const prevent = (e) => {
        e.stopPropagation();
    };

    const dispatch = useDispatch();
    const onClick = () => {
        dispatch(deleteFoil(id));
    };

    return (
        <>
            <div style={style}></div>
            <div style={styleRollBehind}></div>
            <div style={styleRoll}></div>
            <div style={styleRollBorder}></div>
            <div style={styleLabel}>
                Foil {id}
                { !showOnlyPaper &&
                    <b onMouseDown={prevent} onMouseUp={prevent} onWheel={prevent} onClick={onClick} style={styleX}>X</b> }
            </div>
        </>
    );
}