import "./ArtFragment.css";

export function ArtFragment(props) {
    let style = {
        background: props.selected ? 'orange' : (props.highlighted ? '#333' : ''),
        height: props.height,
        width: props.width,
        left: props.xOffset,
        top: props.yOffset,
    };

    return <div className="ArtFragment" style={style}></div>;
}