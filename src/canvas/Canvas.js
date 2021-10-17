import { useState, useEffect } from 'react';
import "./Canvas.css";
import { Page } from "./Page";
import { ContextMenuOptions } from "./ContextMenuOptions";

export function Canvas(props) {
    let [zoom, setZoom] = useState(0);
    let [dragging, setDragging] = useState(false);
    let [canvasRefOffset, setCanvasRefOffset] = useState({x: 0, y: 0});
    let [canvasDraggingAnchor, setCanvasDraggingAnchor] = useState({x: 0, y: 0});
    let [canvasOffset, setCanvasOffset] = useState({x: 0, y: 0});
    let [contextMenuOptions, setContextMenuOptions] = useState(null);
    let [contextMenuPosition, setContextMenuPosition] = useState({x: 0, y: 0});

    let onWheel = (e) => {
        let diff = (e.deltaY > 0 ? -1 : 1);
        setZoom(zoom + diff);
        setContextMenuOptions(null);
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
        setContextMenuOptions(null);
    };

    let onClick = (e) => {
        setContextMenuOptions(null);
        props.unselectAll();
    };

    let onRightClick = (e) => {
        e.preventDefault();
        setContextMenuOptions([{ option: 'nothing' }]);
        setContextMenuPosition({x: e.clientX, y: e.clientY});
    };

    useEffect(() => {
        window.addEventListener('mouseup', onMouseUp);
        window.addEventListener('mousemove', onMouseMove);
        return () => {
            window.removeEventListener('mouseup', onMouseUp);
            window.removeEventListener('mousemove', onMouseMove);
        };
    });

    let getClicheIndexesUnderMouse = (e) => {
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
            page.cliches.forEach((cliche, clicheIndex) => {
                let clicheResource = props.resources.cliches.find(c => c.id === cliche.id);
                let outsideX = (pageMouse.x < cliche.xOffset || pageMouse.x > cliche.xOffset + clicheResource.width);
                let outsideY = (pageMouse.y < cliche.yOffset || pageMouse.y > cliche.yOffset + clicheResource.height);
                if (!outsideX && !outsideY) {
                    result = [pageIndex, clicheIndex];
                }
            });
        });

        return result;
    };

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
    };

    let getElementUnderMouse = (e) => {
        let clicheIndexesUnderMouse = getClicheIndexesUnderMouse(e);
        let clusterIndexesUnderMouse = getClusterIndexesUnderMouse(e);
        if (clicheIndexesUnderMouse !== null) {
            return [...clicheIndexesUnderMouse, 'cliche'];
        } else if (clusterIndexesUnderMouse !== null) {
            return [...clusterIndexesUnderMouse, 'cluster'];
        }
        return null;
    };

    let onMouseMoveCanvas = (e) => {
        let elementUnderMouse = getElementUnderMouse(e);
        if (elementUnderMouse === null) {
            props.unhighlightAll();
        } else {
            let [pageIndex, elementIndex, elementType] = elementUnderMouse;
            if (elementType === 'cluster') {
                props.highlight(pageIndex, elementIndex);
            }
        }
    };

    let onClickCanvas = (e) => {
        setContextMenuOptions(null);
        let elementUnderMouse = getElementUnderMouse(e);
        if (elementUnderMouse === null) {
            if (e.shiftKey === false) {
                props.unselectAll();
            }
        } else {
            let [pageIndex, elementIndex, elementType] = elementUnderMouse;
            if (elementType === 'cliche') {
                if (e.shiftKey === false) {
                    props.unselectAll();
                }
            } else {
                let isSelected = props.pages[pageIndex].clusters[elementIndex].selected;
                if (e.shiftKey) {
                    if (isSelected) {
                        props.unselect(pageIndex, elementIndex);
                    } else {
                        props.select(pageIndex, elementIndex);
                    }
                } else {
                    if (!isSelected) {
                        props.selectOnly(pageIndex, elementIndex);
                    }
                }
            }
        }
        e.stopPropagation();
    };

    let onRightClickCanvas = (e) => {
        let elementUnderMouse = getElementUnderMouse(e);
        if (elementUnderMouse !== null) {
            let [pageIndex, elementIndex, elementType] = elementUnderMouse;
            if (elementType === 'cluster') {
                let isSelected = props.pages[pageIndex].clusters[elementIndex].selected;
                if (!isSelected) {
                    props.selectOnly(pageIndex, elementIndex);
                }
                setContextMenuOptions([{ option: 'createCliche' }]);
            } else {
                let clicheId = props.pages[pageIndex].cliches[elementIndex].id;
                setContextMenuOptions([{ option: 'deleteCliche', args: [clicheId] }]);
            }
        } else {
            setContextMenuOptions([{ option: 'nothing' }]);
        }
        setContextMenuPosition({x: e.clientX, y: e.clientY});
        e.preventDefault();
        e.stopPropagation();
    };

    let onClickOption = (option) => {
        option.callback();
        setContextMenuOptions(null);
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

    let contextMenuCompleteOptions = null;
    if (contextMenuOptions) {
        contextMenuCompleteOptions = contextMenuOptions.map(option => ({
            createCliche: { description: 'Create cliche', callback: () => props.createCliche() },
            deleteCliche: { description: 'Delete cliche', callback: () => props.deleteCliche(...option.args) },
            nothing: { description: 'No available action', callback: () => {} }
        }[option.option]))
    }

    return (
        <div 
            className="CanvasContainer"
            style={containerStyle}
            onWheel={onWheel} 
            onMouseDown={onMouseDown}
            onClick={onClick}
            onContextMenu={onRightClick} >
            <div 
                className="Canvas"
                style={canvasStyle}
                onMouseMove={onMouseMoveCanvas}
                onClick={onClickCanvas}
                onContextMenu={onRightClickCanvas} >
                {
                    props.pages.map((page, i) => {
                        return (
                            <Page 
                                height={page.height}
                                width={page.width}
                                xOffset={page.xOffset}
                                yOffset={page.yOffset}
                                resources={props.resources}
                                clusters={page.clusters}
                                cliches={page.cliches}
                                index={i}
                                key={i} />
                        );
                    })
                }
            </div>
            {contextMenuOptions && <ContextMenuOptions
                                        options={contextMenuCompleteOptions}
                                        position={contextMenuPosition}
                                        onClickOption={onClickOption} />}
        </div>
    );
}