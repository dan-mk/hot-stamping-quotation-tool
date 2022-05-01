const costPerSquareCmCliche = 1;
const costPerStamping = 0.1;

export function getClichePrice(widthCm, heightCm) {
    return (widthCm * heightCm) * costPerSquareCmCliche;
}

export function getFoilPrice(widthCm, heightCm, foilRollWidthCm, foilRollLengthCm, foilRollPrice) {
    const costPerSquareCmFoil = foilRollPrice / (foilRollWidthCm * foilRollLengthCm);
    return (widthCm * heightCm) * costPerSquareCmFoil;
}

export function getProductionPrice(totalOfStampings) {
    return totalOfStampings * costPerStamping;
}

export function getTotalPrice(totalClichePrice, totalFoilPrice, productionPrice) {
    return totalClichePrice + totalFoilPrice + productionPrice;
}
