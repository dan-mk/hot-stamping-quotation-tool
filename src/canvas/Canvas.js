import { useState, useEffect } from 'react';
import "./Canvas.css";
import { Page } from "./Page";

export function Canvas(props) {
    let pages = props.pages;
    let [zoom, setZoom] = useState(0);
    let [dragging, setDragging] = useState(false);
    let [canvasRefOffset, setCanvasRefOffset] = useState({x: 0, y: 0});
    let [canvasDraggingAnchor, setCanvasDraggingAnchor] = useState({x: 0, y: 0});
    let [canvasOffset, setCanvasOffset] = useState({x: 0, y: 0});

    let onWheel = (e) => {
        let diff = (e.deltaY > 0 ? -1 : 1);
        setZoom(zoom + diff);
    };

    let onMouseDown = (e) => {
        if (e.button !== 0) return;
        setDragging(true);
        setCanvasRefOffset(canvasOffset);
        setCanvasDraggingAnchor({x: e.pageX, y: e.pageY});
    };

    let onMouseUp = (e) => {
        if (e.button !== 0) return;
        setDragging(false);
    };

    let onMouseMove = (e) => {
        if (dragging === false) return;
        setCanvasOffset({
            x: canvasRefOffset.x + (e.pageX - canvasDraggingAnchor.x),
            y: canvasRefOffset.y + (e.pageY - canvasDraggingAnchor.y),
        });
    };

    useEffect(() => {
        window.addEventListener('mouseup', onMouseUp);
        window.addEventListener('mousemove', onMouseMove);
        return () => {
            window.removeEventListener('mouseup', onMouseUp);
            window.removeEventListener('mousemove', onMouseMove);
        };
    }, [dragging, setDragging]);

    let containerStyle = {
        height: props.height,
    };

    let padding = 20;
    let mmCanvasHeight = pages.reduce((a, b) => Math.max(a, b.mmHeight), 0);
    let mmCanvasWidth = pages.reduce((a, b) => a + b.mmWidth, 0) + padding * (props.pages.length - 1);

    let canvasStyle = {
        height: 2 * padding + mmCanvasHeight + 'px',
        width: 2 * padding + mmCanvasWidth + 'px',
        transform: `translateX(${canvasOffset.x + 'px'}) translateY(${canvasOffset.y + 'px'}) scale(${Math.pow(1.3, zoom)})`,
    };

    return (
        <div 
            className="CanvasContainer"
            style={containerStyle}
            onWheel={onWheel} 
            onMouseDown={onMouseDown} >
            <div className="Canvas" style={canvasStyle}>
                {
                    pages.map((page, i) => {
                        let hOffset = (i + 1) * padding + pages.slice(0, i).reduce((a, b) => a + b.mmWidth, 0);
                        let vOffset = padding + (mmCanvasHeight - page.mmHeight) / 2;

                        return (
                            <Page 
                                mmHeight={page.mmHeight}
                                mmWidth={page.mmWidth}
                                mmHorizontalOffset={hOffset}
                                mmVerticalOffset={vOffset}
                                key={i} />
                        );
                    })
                }
            </div>
        </div>
    );
}