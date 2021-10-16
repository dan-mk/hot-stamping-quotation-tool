import "./ContextMenuOptions.css";

export function ContextMenuOptions(props) {
    let style = {
        left: props.position.x + 'px',
        top: props.position.y + 'px',
    };

    return (
        <ul className="ContextMenuOptions" style={style}>
            {
                props.options.map((option, i) => {
                    return (
                        <li key={i} className="Option" onClick={() => props.onClickOption(option)}>
                            {option.description}
                        </li>
                    );
                })
            }
        </ul>
    );
}