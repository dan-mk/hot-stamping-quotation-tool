import { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { Paper } from './Paper';
import { SelectionBox } from './SelectionBox';
import { getArtFragments } from '../helpers';

export function Workspace(props) {
    const art = props.art;
    const artFragments = useSelector(state => getArtFragments(state, art));
    const zoomBase = 1.3;

    const [zoom, setZoom] = useState((() => {
        return 0; // TODO INITIALIZATION AT THE IDEAL VALUE
    })());
    const [focusPoint, setFocusPoint] = useState({ x: 0, y: 0 });
    const [selectionStartPosition, setSelectionStartPosition] = useState(null);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [viewportWidth, setViewportWidth] = useState(null);
    const [viewportHeight, setViewportHeight] = useState(null);
    const [selectedArtFragments, setSelectedArtFragments] = useState([]);
    const refViewport = useRef(null);

    const zoomMultiplier = Math.pow(zoomBase, zoom);
    const size = { height: art.height, width: art.width };

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

    const onMouseDown = (e) => {
        if (e.button !== 0) return;
        setSelectionStartPosition({ x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY });
    };

    const onMouseUp = (e) => {
        if (e.button !== 0) return;
        setSelectionStartPosition(null);

        if (selectionStartPosition === null) return;

        const convertToArtPosition = (point) => {
            const viewMiddlePoint = { x: viewportWidth / 2, y: viewportHeight / 2 };
            const diff = { x: point.x - viewMiddlePoint.x, y: point.y - viewMiddlePoint.y };
            return {
                x: focusPoint.x + diff.x / zoomMultiplier + art.width / 2,
                y: focusPoint.y + diff.y / zoomMultiplier + art.height / 2,
            };
        };

        const selectionArtStartPoint = convertToArtPosition(selectionStartPosition);
        const selectionArtEndPoint = convertToArtPosition(mousePosition);

        const selected = artFragments.filter(artFragment => {
            const horizontalCheck = (
                artFragment.x >= Math.min(selectionArtStartPoint.x, selectionArtEndPoint.x) && 
                artFragment.x + artFragment.width <= Math.max(selectionArtStartPoint.x, selectionArtEndPoint.x)
            );
            const verticalCheck = (
                artFragment.y >= Math.min(selectionArtStartPoint.y, selectionArtEndPoint.y) && 
                artFragment.y + artFragment.height <= Math.max(selectionArtStartPoint.y, selectionArtEndPoint.y)
            );
            return horizontalCheck && verticalCheck;
        }).map(artFragment => artFragment.id);
        
        setSelectedArtFragments(selected);
    };

    const onMouseMove = (e) => {
        setMousePosition({
            x: e.pageX - refViewport.current.offsetLeft,
            y: e.pageY - refViewport.current.offsetTop
        });
    };

    useEffect(() => {
        setFocusPoint({ x: 0, y: 0 });
        setZoom(0);
        setSelectedArtFragments([]);
    }, [art]);

    useEffect(() => {
        setViewportWidth(refViewport.current.clientWidth);
        setViewportHeight(refViewport.current.clientHeight);

        window.addEventListener('mouseup', onMouseUp);
        window.addEventListener('mousemove', onMouseMove);
        return () => {
            window.removeEventListener('mouseup', onMouseUp);
            window.removeEventListener('mousemove', onMouseMove);
        };
    });

    const style = {
        background: 'gray',
        height: '500px',
        overflow: 'hidden',
        position: 'relative',
        userSelect: 'none',
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
        <div style={style} onWheel={onWheel} onMouseDown={onMouseDown} ref={refViewport}>
            <div style={paperContainerStyle}>
                <Paper 
                    art={art}
                    size={size}
                    focusPoint={focusPoint}
                    zoomMultiplier={zoomMultiplier}
                    selectedArtFragments={selectedArtFragments} />
            </div>
            { selectionStartPosition !== null && 
                <SelectionBox selectionStartPosition={selectionStartPosition} mousePosition={mousePosition} />
            }
            <div style={overlayStyle}></div>
        </div>
    );
}