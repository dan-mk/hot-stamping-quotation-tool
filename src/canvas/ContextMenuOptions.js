import "./ContextMenuOptions.css";

export function ContextMenuOptions(props) {
    let style = {
        left: props.position.x + 'px',
        top: props.position.y + 'px',
    };

    let onClick = (e, option) => {
        props.onClickOption(option);
        e.stopPropagation();
    }

    return (
        <ul className="ContextMenuOptions" style={style}>
            {
                props.options.map((option, i) => {
                    return (
                        <li key={i} className="Option" onClick={(e) => onClick(e, option)}>
                            {option.description}
                        </li>
                    );
                })
            }
        </ul>
    );
}