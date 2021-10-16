import { useState, useEffect } from 'react';
import "./Canvas.css";
import { Page } from "./Page";

export function Canvas(props) {
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
    });

    let getClusterIndexesUnderMouse = (e) => {
        let canvasMouse = {
            x: e.nativeEvent.offsetX,
            y: e.nativeEvent.offsetY,
        };

        let result = null;
        props.pages.forEach((page, pageIndex) => {
            let pageMouse = {
                x: canvasMouse.x - page.xOffset,
                y: canvasMouse.y - page.yOffset,
            };
            page.clusters.forEach((cluster, clusterIndex) => {
                cluster.artFragments.forEach(artFragment => {
                    let outsideX = (pageMouse.x < artFragment.xOffset || pageMouse.x > artFragment.xOffset + artFragment.width);
                    let outsideY = (pageMouse.y < artFragment.yOffset || pageMouse.y > artFragment.yOffset + artFragment.height);
                    if (!outsideX && !outsideY) {
                        result = [pageIndex, clusterIndex];
                    }
                });
            });
        });

        return result;
    }

    let onMouseMoveCanvas = (e) => {
        let clusterIndexesBelowMouse = getClusterIndexesUnderMouse(e);
        if (clusterIndexesBelowMouse === null) {
            props.unhighlightAll();
        } else {
            let [pageIndex, clusterIndex] = clusterIndexesBelowMouse;
            props.highlight(pageIndex, clusterIndex);
        }
    };

    let onClickCanvas = (e) => {
        let clusterIndexesBelowMouse = getClusterIndexesUnderMouse(e);
        if (clusterIndexesBelowMouse === null) {
            props.unselectAll();
        } else {
            let [pageIndex, clusterIndex] = clusterIndexesBelowMouse;
            let isSelected = props.pages[pageIndex].clusters[clusterIndex].selected;
            if (e.shiftKey) {
                if (isSelected) {
                    props.unselect(pageIndex, clusterIndex);
                } else {
                    props.select(pageIndex, clusterIndex);
                }
            } else {
                if (!isSelected) {
                    props.selectOnly(pageIndex, clusterIndex);
                }
            }
        }
    };

    let containerStyle = {
        height: props.height,
    };

    let padding = 20;
    let canvasHeight = props.pages.reduce((a, b) => Math.max(a, b.height), 0);
    let canvasWidth = props.pages.reduce((a, b) => a + b.width, 0) + padding * (props.pages.length - 1);

    let canvasStyle = {
        height: 2 * padding + canvasHeight + 'px',
        width: 2 * padding + canvasWidth + 'px',
        transform: `translateX(${canvasOffset.x + 'px'}) translateY(${canvasOffset.y + 'px'}) scale(${Math.pow(1.3, zoom)})`,
    };

    props.pages.forEach((page, i) => {
        page.xOffset = (i + 1) * padding + props.pages.slice(0, i).reduce((a, b) => a + b.width, 0);
        page.yOffset = padding + (canvasHeight - page.height) / 2;
    });

    return (
        <div 
            className="CanvasContainer"
            style={containerStyle}
            onWheel={onWheel} 
            onMouseDown={onMouseDown} >
            <div className="Canvas" style={canvasStyle} onMouseMove={onMouseMoveCanvas} onClick={onClickCanvas}>
                {
                    props.pages.map((page, i) => {
                        return (
                            <Page 
                                height={page.height}
                                width={page.width}
                                xOffset={page.xOffset}
                                yOffset={page.yOffset}
                                clusters={page.clusters}
                                index={i}
                                key={i} />
                        );
                    })
                }
            </div>
        </div>
    );
}