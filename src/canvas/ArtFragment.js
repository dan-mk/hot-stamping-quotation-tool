import "./ArtFragment.css";

export function ArtFragment(props) {
    let style = {
        outline: props.selected ? '2px solid orange' : '',
        height: props.height,
        width: props.width,
        left: props.xOffset,
        top: props.yOffset,
    };

    return <div className="ArtFragment" style={style}></div>;
}