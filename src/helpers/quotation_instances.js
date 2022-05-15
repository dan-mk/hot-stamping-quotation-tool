import { getAllFoils, getAllUniqueCliches, getAllNonUniqueCliches, pixelsToCm } from './index';
import { getClichePrice, getFoilPrice, getProductionPrice, getTotalPrice } from './../config/Formulas';

export function calculatePrices(configuration, quotationInstance, foilTypes) {
    const clichePrices = {};
    const foilPrices = {};
    let productionPrice = 0;
    let totalPrice = 0;

    let totalOfStampings = 0;
    
    const cliches = getAllUniqueCliches(configuration);
    const nonUniqueCliches = getAllNonUniqueCliches(configuration);
    const foils = getAllFoils(configuration);

    cliches.forEach(cliche => {
        const price = parseFloat(getClichePrice(
            parseFloat(pixelsToCm(cliche.width)),
            parseFloat(pixelsToCm(cliche.height))
        ).toFixed(2));
        clichePrices[cliche.id] = {
            regular: price,
            custom: price,
        };
    });

    nonUniqueCliches.forEach(cliche => {
        clichePrices[cliche.id] = {
            regular: 0,
            custom: 0,
        };
    });

    for (let artId in quotationInstance.number_of_pages) {
        const qtdSteps = Object.values(configuration.arts[artId].steps).length;
        totalOfStampings += quotationInstance.number_of_pages[artId] * qtdSteps;
    }

    foils.forEach(foil => {
        let artId;
        Object.values(configuration.arts).forEach((art, i) => {
            Object.values(art.steps).forEach(step => {
                Object.values(step.foils.data).forEach(f => {
                    if (f.id === foil.id) {
                        artId = i + 1;
                    }
                });
            });
        });

        let stepId;
        Object.values(configuration.arts).forEach(art => {
            Object.values(art.steps).forEach(step => {
                Object.values(step.foils.data).forEach(f => {
                    if (f.id === foil.id) {
                        stepId = step.id;
                    }
                });
            });
        });

        const foilUse = configuration.arts[artId].steps[stepId].foil_offsets;
        const avgHeight = foilUse.reduce((sum, n) => sum + n, 0) / foilUse.length;

        const foilType = foilTypes[foil.foil_type_id];
        const foilRollWidthCm = foilType.width;
        const foilRollLengthCm = foilType.length;
        const foilRollPrice = foilType.price;

        const stampingsForStep = quotationInstance.number_of_pages[artId];

        const price = parseFloat(
            getFoilPrice(
                parseFloat(pixelsToCm(foil.width)),
                parseFloat(pixelsToCm(avgHeight * stampingsForStep)),
                foilRollWidthCm,
                foilRollLengthCm,
                foilRollPrice
            ).toFixed(2)
        );

        foilPrices[foil.id] = {
            regular: price,
            custom: price,
        };
    });

    const totalClichePrice = Object.values(clichePrices).reduce((sum, v) => sum + v.regular, 0);
    const totalFoilPrice = Object.values(foilPrices).reduce((sum, v) => sum + v.regular, 0);
    productionPrice = parseFloat(getProductionPrice(totalOfStampings).toFixed(2));

    totalPrice = getTotalPrice(totalClichePrice, totalFoilPrice, productionPrice);

    return {
        cliches: clichePrices,
        foils: foilPrices,
        production: {
            regular: productionPrice,
            custom: productionPrice,
        },
        total: {
            regular: totalPrice,
            custom: totalPrice,
        },
        totalOfStampings,
    };
}

export function calculateCustomTotal(quotationInstance) {
    const totalCustomClichePrice = Object.values(quotationInstance.cliches).reduce((sum, v) => sum + parseFloat(v.custom || 0), 0);
    const totalCustomFoilPrice = Object.values(quotationInstance.foils).reduce((sum, v) => sum + parseFloat(v.custom || 0), 0);
    const productionCustomPrice = parseFloat(quotationInstance.production.custom || 0);
    
    return getTotalPrice(totalCustomClichePrice, totalCustomFoilPrice, productionCustomPrice);
}
