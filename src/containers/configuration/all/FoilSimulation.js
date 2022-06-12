import { useEffect, useRef, useState } from "react";
import { cmToPixels, getArtFragmentIdsByStep, pixelsToCm, roundToMultipleCeil, roundToMultipleClosest } from "./../../../helpers";
import api from '../../../helpers/api';
import { useDispatch } from "react-redux";
import { setFoilOffsets } from "../../../redux/actions/configurationActions";
import { setLoading } from "../../../redux/actions/uiActions";

export function FoilSimulation(props) {
    const configuration = props.configuration;
    const art = props.art;
    const currentStep = props.currentStep;
    const setShowFoilSimulation = props.setShowFoilSimulation;

    const refContainer = useRef(null);
    const artFragmentIds = getArtFragmentIdsByStep(configuration, art, currentStep);
    const artFragments = configuration.quotation.arts.reduce((list, art) => {
        return [...list, ...art.art_fragments];
    }, []).filter(artFragment => artFragmentIds.includes(artFragment.id));

    const [mainCanvas, setMainCanvas] = useState(null);
    const [displayCanvas, setDisplayCanvas] = useState(null);
    const foilUse = configuration.arts[art.index].steps[currentStep].foil_offsets;

    const dispatch = useDispatch();

    const calculateFoilUse = async () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        const left = artFragments.reduce((x, artFragment) => {
            return Math.min(x, artFragment.x);
        }, Infinity);

        const right = artFragments.reduce((x, artFragment) => {
            return Math.max(x, artFragment.x + artFragment.width);
        }, -Infinity);

        const top = artFragments.reduce((y, artFragment) => {
            return Math.min(y, artFragment.y);
        }, Infinity);

        const bottom = artFragments.reduce((y, artFragment) => {
            return Math.max(y, artFragment.y + artFragment.height);
        }, -Infinity);

        canvas.width = right - left;
        canvas.height = bottom - top;

        const promises = [];
        artFragments.forEach(artFragment => {
            promises.push(new Promise((resolve) => {
                const image = new Image();
                image.src = `${api.defaults.baseURL}/uploads/art_fragments/${artFragment.id}.png`
                image.onload = () => {
                    ctx.drawImage(image, artFragment.x - left, artFragment.y - top);
                    resolve();
                };
            }));
        });

        await Promise.all(promises);

        if (configuration.arts[art.index].steps[currentStep].foil_offsets.length === 0) {
            dispatch(setLoading(true));
            const response = await api.post('/calculate-offsets', {
                art_fragment_ids: artFragmentIds,
                foil_margin: configuration.arts['1'].foil_margin,
            });
            dispatch(setFoilOffsets(art.index, currentStep, response.data.offsets));
            dispatch(setLoading(false));
        }

        setMainCanvas(canvas);
    };

    const createFinalImage = () => {
        if (foilUse.length === 0 || mainCanvas === null) return;

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const mainCtx = mainCanvas.getContext('2d');

        canvas.style.display = 'block';
        canvas.style.height = '100%';
        canvas.style.width = '100%';
        canvas.style.position = 'absolute';
        canvas.style.objectFit = 'contain';
        canvas.style.objectPosition = 'top';
        canvas.height = mainCanvas.height + foilUse.reduce((sum, n, i) => {
            let h = n;
            if (i === foilUse.length - 1) {
                h = Math.min(h, cmToPixels(configuration.arts[art.index].foil_margin) + 0.3 * mainCanvas.height);
            }
            return sum + h;
        }, 0);
        canvas.width = mainCanvas.width;

        const colors = ['#ff0000', '#0000ff', '#00ff00', '#6a0dad', '#ffa500'];

        ctx.drawImage(mainCanvas, 0, 0);
        let sum = 0;
        foilUse.forEach((n, i) => {
            sum += n;
            mainCtx.globalCompositeOperation = 'source-in';
            mainCtx.fillStyle = (i === foilUse.length - 1 ? 'gray' : colors[i % colors.length]);
            mainCtx.fillRect(0, 0, mainCanvas.width, mainCanvas.height);
            ctx.drawImage(mainCanvas, 0, sum);
        });

        const gradient = ctx.createLinearGradient(
            0, mainCanvas.height + foilUse.slice(0, -1).reduce((sum, n) => sum + n, 0), 0, canvas.height
        );
        gradient.addColorStop(0, "#ffffff00");
        gradient.addColorStop(1, "white");

        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        refContainer.current.innerHTML = '';
        refContainer.current.appendChild(canvas);

        setDisplayCanvas(canvas);
    };

    const setLevels = () => {
        if (displayCanvas === null) return;

        let resizeFactor = Math.min(
            displayCanvas.clientHeight / displayCanvas.height,
            displayCanvas.clientWidth / displayCanvas.width,
        );

        const baseLeft = (displayCanvas.clientWidth - (resizeFactor * displayCanvas.width)) / 2;
        
        let verticalLine = document.createElement('div');
        verticalLine.style.position = 'absolute';
        verticalLine.style.height = parseInt(resizeFactor * foilUse.reduce((sum, n) => sum + n, 0)) + 2 + 'px';
        verticalLine.style.borderRight = '2px solid black';
        verticalLine.style.top = '0px';
        verticalLine.style.left = `${baseLeft - 21}px`;
        refContainer.current.appendChild(verticalLine);

        let sum = 0;
        let totalHeight = 0;
        [0, ...foilUse].forEach((n, i) => {
            sum += n;

            let levelLine = document.createElement('div');
            levelLine.style.position = 'absolute';
            levelLine.style.width = 36 + parseInt(resizeFactor * displayCanvas.width) + 'px';
            levelLine.style.borderBottom = '2px dashed #FF000099';
            levelLine.style.top = parseInt(resizeFactor * sum) + 'px';
            levelLine.style.right = `${baseLeft - 5}px`;
            refContainer.current.appendChild(levelLine);

            if (i > 0) {
                let level = document.createElement('div');
                level.innerHTML = '~' + roundToMultipleClosest(pixelsToCm(n), 0.5) + ' cm';
                totalHeight += roundToMultipleClosest(pixelsToCm(n), 0.5);
                level.style.position = 'absolute';
                level.style.whiteSpace = 'nowrap';
                level.style.top = parseInt(resizeFactor * (sum - n + 0.5 * n) - 7) + 'px';
                level.style.right = `calc(100% + ${40 - baseLeft}px)`;
                refContainer.current.appendChild(level);
            }
        });

        const averageHeight = roundToMultipleCeil(pixelsToCm(foilUse.reduce((sum, n) => sum + n, 0) / foilUse.length), 0.5);

        if (foilUse.length > 1) {
            let totalLevel = document.createElement('div');
            totalLevel.innerHTML = 'total:<br> <b>~' + totalHeight + ' cm</b><br>average:<br> <b>~' + averageHeight + ' cm / stamp</b>';
            totalLevel.style.textAlign = 'right';
            totalLevel.style.position = 'absolute';
            totalLevel.style.whiteSpace = 'nowrap';
            totalLevel.style.bottom = '-68px';
            totalLevel.style.right = `0`;
            totalLevel.style.lineHeight = '1.1';
            verticalLine.appendChild(totalLevel);
        }

        const closeButton = document.createElement('img');
        closeButton.setAttribute('src', '/times-solid.svg');
        closeButton.style.width = '18px';
        closeButton.style.position = 'absolute';
        closeButton.style.top = '-10px';
        closeButton.style.right = '-120px';
        closeButton.style.cursor = 'pointer';
        closeButton.style.zIndex = '1';
        closeButton.onclick = () => setShowFoilSimulation(false);

        refContainer.current.appendChild(closeButton);
    };

    useEffect(calculateFoilUse, []);
    useEffect(createFinalImage, [foilUse, mainCanvas]);
    useEffect(setLevels, [displayCanvas]);

    return (
        <div style={{background: 'white', minHeight: '100%', minWidth: '100%', position: 'absolute'}}>
            <div ref={refContainer} style={{
                background: 'white', position: 'absolute', height: 'calc(100% - 60px)', width: 'calc(100% - 280px)',
                left: '140px', top: '30px'
            }}></div>
        </div>
    );
}