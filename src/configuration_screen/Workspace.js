import { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Paper } from './Paper';
import { SelectionBox } from './SelectionBox';
import { Toolbar } from './Toolbar';
import { StepsTabs } from './StepsTabs';
import { getArtFragments } from '../helpers';
import { addCliche, addFoil } from '../actions';
import '../css/workspace.css';

export function Workspace(props) {
    const show = props.show;
    const art = props.art;
    const configuration = props.configuration;
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
    const [selectedCliches, setSelectedCliches] = useState([]);
    const [selectionType, setSelectionType] = useState('art_fragments');
    const [currentStep, setCurrentStep] = useState(1);
    const refViewport = useRef(null);

    const zoomMultiplier = Math.pow(zoomBase, zoom);
    const size = { height: art.height, width: art.width };

    const cliches = Object.values(configuration.arts[art.id].steps[currentStep].cliches.data);
    const usedArtFragments = cliches.reduce((list, cliche) => {
        return [...list, ...cliche.art_fragments_ids];
    }, []);
    const clichesAllSteps = Object.values(configuration.arts[art.id].steps).reduce((list, step) => {
        return [...list, ...Object.values(step.cliches.data)];
    }, []);
    const usedArtFragmentsAllSteps = clichesAllSteps.reduce((list, cliche) => {
        return [...list, ...cliche.art_fragments_ids];
    }, []);
    const foils = Object.values(configuration.arts[art.id].steps[currentStep].foils.data);
    const usedCliches = foils.reduce((list, foil) => {
        return [...list, ...foil.cliches_ids];
    }, []);

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

        if (selectionType === 'art_fragments') {
            const selected = artFragments.filter(artFragment => {
                const horizontalCheck = (
                    artFragment.x >= Math.min(selectionArtStartPoint.x, selectionArtEndPoint.x) && 
                    artFragment.x + artFragment.width <= Math.max(selectionArtStartPoint.x, selectionArtEndPoint.x)
                );
                const verticalCheck = (
                    artFragment.y >= Math.min(selectionArtStartPoint.y, selectionArtEndPoint.y) && 
                    artFragment.y + artFragment.height <= Math.max(selectionArtStartPoint.y, selectionArtEndPoint.y)
                );
                const used = usedArtFragmentsAllSteps.includes(artFragment.id);
                return horizontalCheck && verticalCheck && !used;
            }).map(artFragment => artFragment.id);
            
            setSelectedArtFragments(selected);
        } else if (selectionType === 'cliches') {
            const selected = cliches.filter(cliche => {
                const horizontalCheck = (
                    cliche.x >= Math.min(selectionArtStartPoint.x, selectionArtEndPoint.x) && 
                    cliche.x + cliche.width <= Math.max(selectionArtStartPoint.x, selectionArtEndPoint.x)
                );
                const verticalCheck = (
                    cliche.y >= Math.min(selectionArtStartPoint.y, selectionArtEndPoint.y) && 
                    cliche.y + cliche.height <= Math.max(selectionArtStartPoint.y, selectionArtEndPoint.y)
                );
                const used = usedCliches.includes(cliche.id);
                return horizontalCheck && verticalCheck && !used;
            }).map(cliche => cliche.id);
            
            setSelectedCliches(selected);
        }
    };

    const onMouseMove = (e) => {
        setMousePosition({
            x: e.pageX - refViewport.current.offsetLeft,
            y: e.pageY - refViewport.current.offsetTop
        });
    };

    const dispatch = useDispatch();

    const onClickSelectArtFragments = () => {
        setSelectionType('art_fragments');
        setSelectedCliches([]);
    };

    const onClickSelectCliches = () => {
        setSelectionType('cliches');
        setSelectedArtFragments([]);
    };

    const onClickNewCliche = () => {
        if (selectedArtFragments.length === 0) return;

        let minY = Infinity, maxY = -Infinity;
        let minX = Infinity, maxX = -Infinity;

        selectedArtFragments.forEach((artFragmentId) => {
            const artFragment = artFragments.find(artFragment => artFragment.id === artFragmentId);
            minY = Math.min(minY, artFragment.y);
            maxY = Math.max(maxY, artFragment.y + artFragment.height);
            minX = Math.min(minX, artFragment.x);
            maxX = Math.max(maxX, artFragment.x + artFragment.width);
        });

        dispatch(addCliche(configuration.id, art.id, currentStep, selectedArtFragments, minX - 10, minY - 10, (maxY - minY) + 20, (maxX - minX) + 20));
        setSelectedArtFragments([]);
    };

    const onClickNewFoil = () => {
        if (selectedCliches.length === 0) return;

        let minX = Infinity, maxX = -Infinity;

        selectedCliches.forEach((clicheId) => {
            const cliche = cliches.find(cliche => cliche.id === clicheId);
            minX = Math.min(minX, cliche.x);
            maxX = Math.max(maxX, cliche.x + cliche.width);
        });

        dispatch(addFoil(configuration.id, art.id, currentStep, 1, selectedCliches, minX - 10, maxX - minX + 20));
        setSelectedCliches([]);
    };

    const onClickStep = (step) => {
        setCurrentStep(step.id);
        setSelectedArtFragments([]);
        setSelectedCliches([]);
    }

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
        background: '#d0d0d0',
        border: '1px solid #b0b0b0',
        flexGrow: '1',
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
        <div id="workspace-subcontainer" style={{ display: (show ? 'flex' : 'none') }}>
            <div id="toolbar-container">
                <Toolbar 
                    onClickSelectArtFragments={onClickSelectArtFragments}
                    onClickSelectCliches={onClickSelectCliches}
                    onClickNewCliche={onClickNewCliche}
                    onClickNewFoil={onClickNewFoil}
                    selectionType={selectionType} />
            </div>
            <div id="paper-container">
                <div style={style} onWheel={onWheel} onMouseDown={onMouseDown} ref={refViewport}>
                    <div style={paperContainerStyle}>
                        <Paper 
                            art={art}
                            configuration={configuration}
                            usedArtFragments={usedArtFragments}
                            usedArtFragmentsAllSteps={usedArtFragmentsAllSteps}
                            cliches={cliches}
                            usedCliches={usedCliches}
                            size={size}
                            focusPoint={focusPoint}
                            zoomMultiplier={zoomMultiplier}
                            selectedArtFragments={selectedArtFragments}
                            selectedCliches={selectedCliches}
                            currentStep={currentStep} />
                    </div>
                    { selectionStartPosition !== null && 
                        <SelectionBox selectionStartPosition={selectionStartPosition} mousePosition={mousePosition} />
                    }
                    <div style={overlayStyle}></div>
                </div>
                <StepsTabs configuration={configuration} art={art} onClickStep={onClickStep} currentStep={currentStep} />
            </div>
        </div>
    );
}