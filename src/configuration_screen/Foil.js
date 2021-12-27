export function Foil(props) {
    const position = props.position;
    const size = props.size;
    const zoomMultiplier = props.zoomMultiplier;
    const color = props.color;

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
        height: zoomMultiplier * 0.12 * size.height,
        width: zoomMultiplier * size.width,
    };

    let styleRollBehind = { ...styleRoll, background: 'black', outline: '2px solid #ffffff44' };

    return (
        <>
            <div style={style}></div>
            <div style={styleRollBehind}></div>
            <div style={styleRoll}></div>
        </>
    );
}