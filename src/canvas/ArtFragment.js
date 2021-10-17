import "./ArtFragment.css";

export function ArtFragment(props) {
    let bgColor = '';
    if (props.attachedCliche !== null) {
        bgColor = 'white';
    } else if (props.selected) {
        bgColor = 'orange';
    } else if (props.highlighted) {
        bgColor = '#333';
    }

    let style = {
        background: bgColor,
        height: props.height,
        width: props.width,
        left: props.xOffset,
        top: props.yOffset,
    };

    return <div className="ArtFragment" style={style}></div>;
}