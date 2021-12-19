export const addQuote = (client_id, description, datetime) => {
    return {
        type: 'ADD_QUOTE',
        payload: {
            client_id,
            description,
            datetime,
        }
    }
};

export const addArt = (quote_id, dpi, height, width) => {
    return {
        type: 'ADD_ART',
        payload: {
            quote_id,
            dpi,
            height,
            width,
        }
    }
};

export const addArtFragment = (art_id, x, y, height, width, data) => {
    return {
        type: 'ADD_ART_FRAGMENT',
        payload: {
            art_id,
            x,
            y,
            height,
            width,
            data,
        }
    }
}

export const addConfiguration = (quote_id, description, art_ids) => {
    const arts = {};

    art_ids.map((art_id, index) => {
        arts[index + 1] = {
            id: index + 1,
            art_id,
            steps: {
                '1': {
                    id: 1,
                    sequence: 1,
                    positioned_cliches: {},
                    foils: {}
                }
            }
        }
    })

    return {
        type: 'ADD_CONFIGURATION',
        payload: {
            quote_id,
            description,
            arts: arts
        }
    }
}