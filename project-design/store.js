let store = {
    clients: {
        '1': {
            id: '1',
            name: 'Client S'
        }
    },
    quotes: {
        '1': {
            id: '1',
            client_id: '1',
            description: 'Bag S',
            date: '2021-10-18 11:08:47',
        }
    },
    arts: {
        '1': {
            id: '1',
            quote_id: '1',
            dpi: 300,
            height: 123,
            width: 456,
        }
    },
    art_fragments: {
        '1': {
            id: '1',
            art_id: '1',
            data: [[]],
            x: 0,
            y: 0,
        }
    },
    simulations: {
        '1': {
            id: '1',
            quote_id: '1',
            description: 'Simulation 1',
            arts: {
                '1': {
                    id: '1',
                    art_id: '1',
                    steps: {
                        '1': {
                            id: '1',
                            sequence: '1',
                            positioned_cliches: {
                                '1': {
                                    id: '1',
                                    cliche_id: '1',
                                    art_fragments_ids: ['1'],
                                    x: 0,
                                    y: 0,
                                }
                            },
                            foils: {
                                '1': {
                                    id: '1',
                                    foil_type_id: '1',
                                    positioned_cliches_ids: ['1'],
                                }
                            }
                        }
                    }
                }
            }
        }
    },
    cliches: {
        '1': {
            id: '1',
            simulation_id: '1',
            height: 12,
            width: 34,
        }
    },
    foil_type: {
        '1': {
            id: '1',
            description: 'Golden',
            width: 123,
            length: 12200,
            price: 123,
        }
    }
};