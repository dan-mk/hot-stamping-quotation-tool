let store = {
    clients: {
        selected: {},
        data: {
            '1': {
                id: '1',
                name: 'Client S',
                created_at: '2020-01-01 00:00:00',
                updated_at: '2020-01-01 00:00:00',
            }
        }
    },
    quotes: {
        selected: {},
        data: {
            '1': {
                id: '1',
                client_id: '1',
                description: 'Bag S',
                created_at: '2020-01-01 00:00:00',
                updated_at: '2020-01-01 00:00:00',
            }
        }
    },
    arts: {
        data: {
            '1': {
                id: '1',
                quotation_id: '1',
                filename: '1.png',
                dpi: 300,
                height: 123,
                width: 456,
                created_at: '2020-01-01 00:00:00',
                updated_at: '2020-01-01 00:00:00',
            }
        }
    },
    art_fragments: {
        data: {
            '1': {
                id: '1',
                art_id: '1',
                data: '<canvas>',
                x: 0,
                y: 0,
                height: 12,
                width: 34,
                created_at: '2020-01-01 00:00:00',
                updated_at: '2020-01-01 00:00:00',
            }
        }
    },
    configurations: {
        next_id: 2,
        data: {
            '1': {
                id: '1',
                quote_id: '1',
                next_cliche_id: 2,
                next_cliche_group_id: 2,
                next_foil_id: 2,
                description: 'Configuration 1',
                arts: {
                    '1': {
                        id: '1',
                        art_id: '1',
                        steps: {
                            '1': {
                                id: '1',
                                cliches: {
                                    data: {
                                        '1': {
                                            id: '1',
                                            group_id: '1',
                                            art_fragments_ids: ['1'],
                                            x: 0,
                                            y: 0,
                                            height: 12,
                                            width: 34,
                                        }
                                    }
                                },
                                foils: {
                                    data: {
                                        '1': {
                                            id: '1',
                                            foil_type_id: '1',
                                            cliches_ids: ['1'],
                                            x: 10,
                                            width: 50,
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    },
    foil_types: {
        next_id: 2,
        data: {
            '1': {
                id: '1',
                description: 'Golden',
                color: '#ffff00',
                width: 123,
                length: 12200,
                price: 123,
            }
        }
    }
};
