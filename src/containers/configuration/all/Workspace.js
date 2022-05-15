import { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { Paper } from './Paper';
import { SelectionBox } from './SelectionBox';
import { Toolbar } from './Toolbar';
import { StepsTabs } from './StepsTabs';
import { FoilSimulation } from './FoilSimulation';
import { getArtFragments, getAllUniqueCliches, cmToPixels } from './../../../helpers';
import { addCliche, addFoil } from './../../../redux/actions/configurationActions';
import './../../../css/workspace.css';

export function Workspace(props) {
    const show = props.show;
    const art = props.art;
    const configuration = props.configuration;
    const showOnlyPaper = props.showOnlyPaper || false;
    const paddingHorizontal = props.paddingHorizontal || 16;
    const paddingVertical = props.paddingVertical || 40;
    const artFragments = getArtFragments(art);
    const zoomBase = props.zoomBase || 1.25;
    const isConfigurationFinished = props.isConfigurationFinished;

    const [zoom, setZoom] = useState(0);
    const [focusPoint, setFocusPoint] = useState({ x: 0, y: 0 });
    const [selectionStartPosition, setSelectionStartPosition] = useState(null);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [viewportWidth, setViewportWidth] = useState(null);
    const [viewportHeight, setViewportHeight] = useState(null);
    const [selectedArtFragmentIds, setSelectedArtFragmentIds] = useState([]);
    const [currentStep, setCurrentStep] = useState(props.step || 1);
    const [showFoilSimulation, setShowFoilSimulation] = useState(false);
    const refViewport = useRef(null);

    const zoomMultiplier = Math.pow(zoomBase, zoom);
    const size = { height: art.height, width: art.width };

    const allUniqueCliches = getAllUniqueCliches(configuration);
    const cliches = Object.values(configuration.arts[art.index].steps[currentStep].cliches.data);
    const foils = Object.values(configuration.arts[art.index].steps[currentStep].foils.data);

    const artFragmentIdsWithCliches = cliches.reduce((list, cliche) => {
        return [...list, ...cliche.art_fragments_ids];
    }, []);
    const artFragmentIdsWithFoils = foils.reduce((list, foil) => {
        return [...list, ...foil.art_fragments_ids];
    }, []);

    const clichesAllSteps = Object.values(configuration.arts[art.index].steps).reduce((list, step) => {
        return [...list, ...Object.values(step.cliches.data)];
    }, []);
    const foilsAllSteps = Object.values(configuration.arts[art.index].steps).reduce((list, step) => {
        return [...list, ...Object.values(step.foils.data)];
    }, []);

    const artFragmentIdsWithClichesAllSteps = clichesAllSteps.reduce((list, cliche) => {
        return [...list, ...cliche.art_fragments_ids];
    }, []);
    const artFragmentIdsWithFoilsAllSteps = foilsAllSteps.reduce((list, foil) => {
        return [...list, ...foil.art_fragments_ids];
    }, []);

    const artFragmentsData = {};
    artFragments.forEach(artFragment => {
        const artFragmentData = {};

        artFragmentData.selected = selectedArtFragmentIds.includes(artFragment.id);
        artFragmentData.hasClicheCurrentStep = artFragmentIdsWithCliches.includes(artFragment.id);
        artFragmentData.hasFoilCurrentStep = artFragmentIdsWithFoils.includes(artFragment.id);
        artFragmentData.hasClicheAnyStep = artFragmentIdsWithClichesAllSteps.includes(artFragment.id);
        artFragmentData.hasFoilAnyStep = artFragmentIdsWithFoilsAllSteps.includes(artFragment.id);
        artFragmentData.hasClicheOtherStep = (artFragmentData.hasClicheAnyStep && !artFragmentData.hasClicheCurrentStep);
        artFragmentData.hasFoilOtherStep = (artFragmentData.hasFoilAnyStep && !artFragmentData.hasFoilCurrentStep);
        artFragmentData.hasEverythingCurrentStep = (artFragmentData.hasClicheCurrentStep && artFragmentData.hasFoilCurrentStep);
        artFragmentData.hasEverythingOtherStep = (artFragmentData.hasClicheOtherStep && artFragmentData.hasFoilOtherStep);
        artFragmentData.hasAnythingOtherStep = (artFragmentData.hasClicheOtherStep || artFragmentData.hasFoilOtherStep);

        artFragmentsData[artFragment.id] = artFragmentData;
    });

    const clicheDisabled = (
        selectedArtFragmentIds.length === 0 ||
        selectedArtFragmentIds.some(artFragmentId => artFragmentsData[artFragmentId].hasClicheAnyStep)
    );
    const foilDisabled = (
        selectedArtFragmentIds.length === 0 ||
        selectedArtFragmentIds.some(artFragmentId => artFragmentsData[artFragmentId].hasFoilAnyStep)
    );
    const reusableCliches = allUniqueCliches.filter(cliche => !cliches.map(c => c.id).includes(cliche.id));

    const simulateFoilUseDisabled = (showFoilSimulation === true || foils.length === 0);

    let onWheel = (e) => {
        if (showOnlyPaper || showFoilSimulation) return;

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
        if (e.button !== 0 || showOnlyPaper || showFoilSimulation) return;
        setSelectionStartPosition({ x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY });
    };

    const onMouseUp = (e) => {
        if (e.button !== 0 || showOnlyPaper || showFoilSimulation) return;
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
            const hasEverythingCurrentStep = artFragmentsData[artFragment.id].hasEverythingCurrentStep;
            const hasAnythingOtherStep = artFragmentsData[artFragment.id].hasAnythingOtherStep;
            return horizontalCheck && verticalCheck && !hasEverythingCurrentStep && !hasAnythingOtherStep;
        }).map(artFragment => artFragment.id);
        
        setSelectedArtFragmentIds(selected);
    };

    const onMouseMove = (e) => {
        setMousePosition({
            x: e.pageX - refViewport.current.offsetLeft,
            y: e.pageY - refViewport.current.offsetTop
        });
    };

    const dispatch = useDispatch();

    const onClickNewCliche = () => {
        if (selectedArtFragmentIds.length === 0) return;

        let minY = Infinity, maxY = -Infinity;
        let minX = Infinity, maxX = -Infinity;

        selectedArtFragmentIds.forEach((artFragmentId) => {
            const artFragment = artFragments.find(artFragment => artFragment.id === artFragmentId);
            minY = Math.min(minY, artFragment.y);
            maxY = Math.max(maxY, artFragment.y + artFragment.height);
            minX = Math.min(minX, artFragment.x);
            maxX = Math.max(maxX, artFragment.x + artFragment.width);
        });

        dispatch(
            addCliche(
                art.index,
                currentStep,
                selectedArtFragmentIds,
                minX - cmToPixels(0.5),
                minY - cmToPixels(0.5),
                (maxY - minY) + cmToPixels(1),
                (maxX - minX) + cmToPixels(1)
            )
        );
        setSelectedArtFragmentIds([]);
    };

    const onClickReuseCliche = (reusedCliche) => {
        if (selectedArtFragmentIds.length === 0) return;

        let minY = Infinity;
        let minX = Infinity;

        selectedArtFragmentIds.forEach((artFragmentId) => {
            const artFragment = artFragments.find(artFragment => artFragment.id === artFragmentId);
            minY = Math.min(minY, artFragment.y);
            minX = Math.min(minX, artFragment.x);
        });

        dispatch(
            addCliche(
                art.index,
                currentStep,
                selectedArtFragmentIds,
                minX - cmToPixels(0.5),
                minY - cmToPixels(0.5),
                reusedCliche.height,
                reusedCliche.width,
                reusedCliche.group_id
            )
        );
        setSelectedArtFragmentIds([]);
    };

    const onClickNewFoil = (foilTypeId) => {
        if (selectedArtFragmentIds.length === 0) return;

        let minX = Infinity, maxX = -Infinity;

        selectedArtFragmentIds.forEach((artFragmentId) => {
            const artFragment = artFragments.find(artFragment => artFragment.id === artFragmentId);
            minX = Math.min(minX, artFragment.x);
            maxX = Math.max(maxX, artFragment.x + artFragment.width);
        });

        dispatch(
            addFoil(
                art.index,
                currentStep,
                foilTypeId,
                selectedArtFragmentIds,
                minX - cmToPixels(1),
                maxX - minX + cmToPixels(2)
            )
        );
        setSelectedArtFragmentIds([]);
    };

    const onClickStep = (step) => {
        setCurrentStep(step.id);
        setSelectedArtFragmentIds([]);
    }

    const resetToIdealView = (vWidth = viewportWidth, vHeight = viewportHeight) => {
        const artWidth = art.width;
        const artHeight = cmToPixels(8) + art.height;

        const viewportIdealRatioWidth = vWidth / artWidth;
        const idealZoomLevelWidth = (Math.log10(viewportIdealRatioWidth) / Math.log10(zoomBase));

        const viewportIdealRatioHeight = vHeight / artHeight;
        const idealZoomLevelHeight = (Math.log10(viewportIdealRatioHeight) / Math.log10(zoomBase));

        let idealZoomLevel = Math.floor(Math.min(idealZoomLevelWidth, idealZoomLevelHeight));
        while (
            vWidth < Math.pow(zoomBase, idealZoomLevel) * artWidth + 2 * paddingHorizontal || 
            vHeight < Math.pow(zoomBase, idealZoomLevel) * artHeight + 2 * paddingVertical
        ) {
            idealZoomLevel -= 1;
        }

        setZoom(idealZoomLevel);
        setFocusPoint({ x: 0, y: 0 });
    };

    const onClickSimulateFoilUse = () => {
        setShowFoilSimulation(true);
    };

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

    useEffect(() => {
        if (show === false || viewportWidth === null || viewportWidth === null) return;
        resetToIdealView();
    }, [viewportWidth, viewportWidth]);

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
            { !showOnlyPaper && <div id="toolbar-container">
                <Toolbar 
                    onClickResetToIdealView={resetToIdealView}
                    onClickNewCliche={onClickNewCliche}
                    onClickReuseCliche={onClickReuseCliche}
                    onClickNewFoil={onClickNewFoil}
                    onClickSimulateFoilUse={onClickSimulateFoilUse}
                    clicheDisabled={clicheDisabled}
                    foilDisabled={foilDisabled}
                    reusableCliches={reusableCliches}
                    simulateFoilUseDisabled={simulateFoilUseDisabled}
                    isConfigurationFinished={isConfigurationFinished} />
            </div> }
            <div id="paper-container">
                <div style={style} onWheel={onWheel} onMouseDown={onMouseDown} ref={refViewport}>
                    { !showFoilSimulation && <div style={paperContainerStyle}>
                        <Paper 
                            art={art}
                            configuration={configuration}
                            artFragmentsData={artFragmentsData}
                            cliches={cliches}
                            size={size}
                            focusPoint={focusPoint}
                            zoomMultiplier={zoomMultiplier}
                            currentStep={currentStep}
                            showOnlyPaper={showOnlyPaper}
                            isConfigurationFinished={isConfigurationFinished} />
                    </div> }
                    { showFoilSimulation && 
                        <FoilSimulation configuration={configuration} art={art} currentStep={currentStep} setShowFoilSimulation={setShowFoilSimulation} /> }
                    { selectionStartPosition !== null && 
                        <SelectionBox selectionStartPosition={selectionStartPosition} mousePosition={mousePosition} />
                    }
                    <div style={overlayStyle}></div>
                </div>
                { !showOnlyPaper && <StepsTabs
                    configuration={configuration}
                    art={art}
                    onClickStep={onClickStep}
                    currentStep={currentStep}
                    setCurrentStep={setCurrentStep}
                    isConfigurationFinished={isConfigurationFinished} /> }
            </div>
        </div>
    );
}