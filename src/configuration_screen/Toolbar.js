
export function Toolbar(props) {
    const onClickNewCliche = props.onClickNewCliche;

    return (
        <div onClick={onClickNewCliche}>New Cliche</div>
    );
}