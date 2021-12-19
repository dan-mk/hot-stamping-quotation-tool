import { useState, useEffect } from 'react';
import { Paper } from './Paper';

export function Workspace(props) {
    const art = props.art;
    const zoomBase = 1.3;

    const [zoom, setZoom] = useState((() => {
        return 0; // TODO INITIALIZATION AT THE IDEAL VALUE
    })());
    const [focusPoint, setFocusPoint] = useState({ x: 0, y: 0 });
    // const [mouseCheckpointPosition, setMouseCheckpointPosition] = useState({ x: 0, y: 0 });

    const zoomMultiplier = Math.pow(zoomBase, zoom);

    let onWheel = (e) => {
        const direction = (e.deltaY > 0 ? -1 : 1);
        const additionalMultiplier = (direction === 1 ? zoomBase : 1 / zoomBase);

        const viewMiddlePoint = { x: e.target.clientWidth / 2, y: e.target.clientHeight / 2 };
        const eventPoint = { x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY };

        const originalDiff = { x: eventPoint.x - viewMiddlePoint.x, y: eventPoint.y - viewMiddlePoint.y };
        const newDiff = {
            x: originalDiff.x * additionalMultiplier,
            y: originalDiff.y * additionalMultiplier,
        };

        const newFocusPoint = {
            x: focusPoint.x + (newDiff.x - originalDiff.x) / zoomMultiplier / additionalMultiplier,
            y: focusPoint.y + (newDiff.y - originalDiff.y) / zoomMultiplier / additionalMultiplier
        }

        setFocusPoint(newFocusPoint);
        setZoom(zoom + direction);
    };

    useEffect(() => {
        setFocusPoint({ x: 0, y: 0 });
        setZoom(0);
    }, [art]);

    // let onMouseDown = (e) => {
    //     if (e.button !== 0) return;
    //     setMouseCheckpointPosition({ x: e.pageX, y: e.pageY });
    // };


    // useEffect(() => {
    //     window.addEventListener('mouseup', onMouseUp);
    //     window.addEventListener('mousemove', onMouseMove);
    //     return () => {
    //         window.removeEventListener('mouseup', onMouseUp);
    //         window.removeEventListener('mousemove', onMouseMove);
    //     };
    // });

    const style = {
        background: 'gray',
        height: '500px',
        overflow: 'hidden',
        position: 'relative',
    };

    const paperContainerStyle = {
        left: '50%',
        top: '50%',
        position: 'absolute',
    };

    const overlayStyle = {
        position: 'absolute',
        height: '100%',
        width: '100%',
    };

    return (
        <div style={style} onWheel={onWheel}>
            <div style={paperContainerStyle}>
                <Paper size={{ height: art.height, width: art.width }} focusPoint={focusPoint} zoomMultiplier={zoomMultiplier} />
            </div>
            <div style={overlayStyle}></div>
        </div>
    );
}