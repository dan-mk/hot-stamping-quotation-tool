import { useDispatch } from 'react-redux';
import { deleteCliche } from '../actions';

export function Cliche(props) {
    const position = props.position;
    const size = props.size;
    const zoomMultiplier = props.zoomMultiplier;
    const selected = props.selected;
    const used = props.used;
    const configurationId = props.configurationId;
    const id = props.id;
    const groupId = props.groupId;

    let style = {
        background: used ? '#999' : (selected ? 'rgb(255, 127, 0)' : '#ed0000'),
        border: '3px dashed black',
        position: 'absolute',
        left: zoomMultiplier * (position.x) + 'px',
        top: zoomMultiplier * (position.y) + 'px',
        height: zoomMultiplier * size.height,
        width: zoomMultiplier * size.width,
    };

    let styleLabel = {
        background: 'white',
        borderRadius: '3px',
        boxShadow: '0 0 3px #00000088',
        fontSize: '14px',
        padding: '3px 6px',
        position: 'absolute',
        left: zoomMultiplier * (position.x) + 'px',
        top: (zoomMultiplier * (position.y + size.height) + 5) + 'px',
        zIndex: '1',
    }

    let styleX = {
        color: 'red',
        cursor: 'pointer',
        marginLeft: '8px',
        position: 'relative',
    };

    const prevent = (e) => {
        e.stopPropagation();
    };

    const dispatch = useDispatch();
    const onClick = () => {
        dispatch(deleteCliche(configurationId, id));
    };

    return (
        <>
            <div style={style}></div>
            <div onMouseDown={prevent} onMouseUp={prevent} style={styleLabel}>
                Cliche {groupId}
                <b onClick={onClick} style={styleX}>X</b>
            </div>
        </>
    );
}