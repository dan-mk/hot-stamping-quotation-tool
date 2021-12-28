import { useDispatch } from 'react-redux';
import { deleteFoil } from '../actions';

export function Foil(props) {
    const position = props.position;
    const size = props.size;
    const zoomMultiplier = props.zoomMultiplier;
    const color = props.color;
    const configurationId = props.configurationId;
    const id = props.id;

    let style = {
        background: `${color}88`,
        position: 'absolute',
        left: zoomMultiplier * (position.x) + 'px',
        top: zoomMultiplier * (position.y) + 'px',
        height: zoomMultiplier * size.height,
        width: zoomMultiplier * size.width,
    };

    let styleRoll = {
        background: `linear-gradient(${color}, ${color}aa)`,
        position: 'absolute',
        left: zoomMultiplier * (position.x) + 'px',
        top: zoomMultiplier * (position.y + size.height) + 'px',
        height: zoomMultiplier * 0.1 * size.height,
        width: zoomMultiplier * size.width,
    };

    let styleRollBehind = { ...styleRoll, background: 'black', outline: '2px solid #ffffff44' };

    let styleLabel = {
        background: 'white',
        borderRadius: '3px',
        boxShadow: '0 0 3px #00000088',
        fontSize: '14px',
        padding: '3px 6px',
        position: 'absolute',
        left: zoomMultiplier * (position.x) + 'px',
        top: (zoomMultiplier * (position.y + 1.1 * size.height) + 5) + 'px',
        zIndex: '1',
    }

    let styleX = {
        color: 'red',
        cursor: 'pointer',
        paddingLeft: '8px',
        position: 'relative',
    };

    const prevent = (e) => {
        e.stopPropagation();
    };

    const dispatch = useDispatch();
    const onClick = () => {
        dispatch(deleteFoil(configurationId, id));
    };

    return (
        <>
            <div style={style}></div>
            <div style={styleRollBehind}></div>
            <div style={styleRoll}></div>
            <div onMouseDown={prevent} onMouseUp={prevent} style={styleLabel}>
                Foil {id}
                <b onClick={onClick} style={styleX}>X</b>
            </div>
        </>
    );
}