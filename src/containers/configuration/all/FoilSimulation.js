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
                image.crossOrigin = 'anonymous';
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
        canvas.width = mainCanvas.width + cmToPixels(4);

        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#ff7777';
        ctx.fillRect(0, 0, canvas.width, cmToPixels(0.08));

        const colors = ['#ff0000', '#0000ff', '#00ff00', '#6a0dad', '#ffa500'];

        ctx.drawImage(mainCanvas, cmToPixels(3), 0);
        let sum = 0;
        let totalHeight = 0;
        foilUse.forEach((n, i) => {
            sum += n;
            mainCtx.globalCompositeOperation = 'source-in';
            mainCtx.fillStyle = (i === foilUse.length - 1 ? 'gray' : colors[i % colors.length]);
            mainCtx.fillRect(0, 0, mainCanvas.width, mainCanvas.height);
            ctx.fillStyle = '#ff7777';
            ctx.fillRect(0, sum, canvas.width, cmToPixels(0.08));
            ctx.drawImage(mainCanvas, cmToPixels(3), sum);

            ctx.fillStyle = '#000000';
            ctx.font = 'bold 60px sans-serif';
            ctx.textAlign = 'right';
            ctx.fillText(`${'~' + roundToMultipleClosest(pixelsToCm(n), 0.5)} cm`, cmToPixels(2.2), sum - 20);

            totalHeight += roundToMultipleClosest(pixelsToCm(n), 0.5);
        });

        ctx.fillStyle = '#000000';
        ctx.fillRect(cmToPixels(2.35), 0, cmToPixels(0.1), sum + cmToPixels(0.08));

        const gradient = ctx.createLinearGradient(
            0, mainCanvas.height + cmToPixels(configuration.arts[art.index].foil_margin) + foilUse.slice(0, -1).reduce((sum, n) => {
                return sum + n
            }, 0),
            0, canvas.height
        );
        gradient.addColorStop(0, "#ffffff00");
        gradient.addColorStop(1, "white");

        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        if (foilUse.length > 1) {
            ctx.fillStyle = '#000000';
            ctx.font = 'bold 60px sans-serif';
            ctx.textAlign = 'left';
            ctx.fillText(`${foilUse.length} images in ${'~' + totalHeight} cm`, 40, canvas.height - 40);
        }

        refContainer.current.innerHTML = '';
        refContainer.current.appendChild(canvas);

        setDisplayCanvas(canvas);
    };

    const setButtons = () => {
        if (displayCanvas === null) return;

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

        const downloadButton = document.createElement('a');
        downloadButton.style.position = 'absolute';
        downloadButton.style.top = '-10px';
        downloadButton.style.left = '-120px';
        downloadButton.style.cursor = 'pointer';
        downloadButton.style.zIndex = '1';
        downloadButton.style.color = 'black';
        downloadButton.download = 'configuration' + configuration.id + '.png';
        downloadButton.href = displayCanvas.toDataURL('image/png');

        const downloadIcon = document.createElement('img');
        downloadIcon.setAttribute('src', '/download-solid.svg');
        downloadIcon.style.width = '22px';
        downloadIcon.style.height = '22px';
        downloadButton.appendChild(downloadIcon);

        refContainer.current.appendChild(downloadButton);
    };

    useEffect(calculateFoilUse, []);
    useEffect(createFinalImage, [foilUse, mainCanvas]);
    useEffect(setButtons, [displayCanvas]);

    return (
        <div style={{background: 'white', minHeight: '100%', minWidth: '100%', position: 'absolute'}}>
            <div ref={refContainer} style={{
                background: 'white', position: 'absolute', height: 'calc(100% - 60px)', width: 'calc(100% - 280px)',
                left: '140px', top: '30px'
            }}></div>
        </div>
    );
}