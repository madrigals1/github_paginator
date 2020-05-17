const testCases = [
    {
        'name': 'Empty Data',
        'input': {},
        'output': []
    },
    {
        'name': 'Github Test Case',
        'input': {
            '0': [
                {
                    'id': 10,
                    'title': 'House',
                    'level': 0,
                    'children': [],
                    'parent_id': null
                }
            ],
            '1': [
                {
                    'id': 12,
                    'title': 'Red Roof',
                    'level': 1,
                    'children': [],
                    'parent_id': 10
                },
                {
                    'id': 18,
                    'title': 'Blue Roof',
                    'level': 1,
                    'children': [],
                    'parent_id': 10
                },
                {
                    'id': 13,
                    'title': 'Wall',
                    'level': 1,
                    'children': [],
                    'parent_id': 10
                }
            ],
            '2': [
                {
                    'id': 17,
                    'title': 'Blue Window',
                    'level': 2,
                    'children': [],
                    'parent_id': 12
                },
                {
                    'id': 16,
                    'title': 'Door',
                    'level': 2,
                    'children': [],
                    'parent_id': 13
                },
                {
                    'id': 15,
                    'title': 'Red Window',
                    'level': 2,
                    'children': [],
                    'parent_id': 12
                }
            ]
        },
        'output': [
            {
                'id': 10,
                'title': 'House',
                'level': 0,
                'children': [
                    {
                        'id': 12,
                        'title': 'Red Roof',
                        'level': 1,
                        'children': [
                            {
                                'id': 15,
                                'title': 'Red Window',
                                'level': 2,
                                'children': [],
                                'parent_id': 12
                            },
                            {
                                'id': 17,
                                'title': 'Blue Window',
                                'level': 2,
                                'children': [],
                                'parent_id': 12
                            }
                        ],
                        'parent_id': 10
                    },
                    {
                        'id': 13,
                        'title': 'Wall',
                        'level': 1,
                        'children': [
                            {
                                'id': 16,
                                'title': 'Door',
                                'level': 2,
                                'children': [],
                                'parent_id': 13
                            }
                        ],
                        'parent_id': 10
                    },
                    {
                        'id': 18,
                        'title': 'Blue Roof',
                        'level': 1,
                        'children': [],
                        'parent_id': 10
                    }
                ],
                'parent_id': null
            }
        ]
    },
    {
        'name': 'Hierarchy Test',
        'input': {
            '0': [
                {
                    'id': 10,
                    'title': 'House',
                    'level': 0,
                    'children': [],
                    'parent_id': null
                },
                {
                    'id': 11,
                    'title': 'Car',
                    'level': 0,
                    'children': [],
                    'parent_id': null
                },
                {
                    'id': 12,
                    'title': 'Tree',
                    'level': 0,
                    'children': [],
                    'parent_id': null
                }
            ]
        },
        'output': [
            {
                'id': 10,
                'title': 'House',
                'level': 0,
                'children': [],
                'parent_id': null
            },
            {
                'id': 11,
                'title': 'Car',
                'level': 0,
                'children': [],
                'parent_id': null
            },
            {
                'id': 12,
                'title': 'Tree',
                'level': 0,
                'children': [],
                'parent_id': null
            }
        ],
    },
    {
        'name': 'Hierarchy Test 2',
        'input': {
            '0': [
                {
                    'id': 10,
                    'title': 'House',
                    'level': 0,
                    'children': [],
                    'parent_id': null
                },
                {
                    'id': 11,
                    'title': 'Car',
                    'level': 0,
                    'children': [],
                    'parent_id': null
                },
                {
                    'id': 12,
                    'title': 'Tree',
                    'level': 0,
                    'children': [],
                    'parent_id': null
                }
            ],
            '1': [
                {
                    'id': 13,
                    'title': 'House 1',
                    'level': 1,
                    'children': [],
                    'parent_id': 10
                },
                {
                    'id': 14,
                    'title': 'Car 1',
                    'level': 1,
                    'children': [],
                    'parent_id': 11
                },
                {
                    'id': 15,
                    'title': 'Tree 1',
                    'level': 1,
                    'children': [],
                    'parent_id': 12
                }
            ],
            '2': [
                {
                    'id': 16,
                    'title': 'House 2',
                    'level': 2,
                    'children': [],
                    'parent_id': 13
                },
                {
                    'id': 17,
                    'title': 'Car 2',
                    'level': 2,
                    'children': [],
                    'parent_id': 14
                },
                {
                    'id': 18,
                    'title': 'Tree 2',
                    'level': 2,
                    'children': [],
                    'parent_id': 15
                }
            ]
        },
        'output': [
            {
                'id': 10,
                'title': 'House',
                'level': 0,
                'children': [
                    {
                        'id': 13,
                        'title': 'House 1',
                        'level': 1,
                        'children': [
                            {
                                'id': 16,
                                'title': 'House 2',
                                'level': 2,
                                'children': [],
                                'parent_id': 13
                            }
                        ],
                        'parent_id': 10
                    }
                ],
                'parent_id': null
            },
            {
                'id': 11,
                'title': 'Car',
                'level': 0,
                'children': [
                    {
                        'id': 14,
                        'title': 'Car 1',
                        'level': 1,
                        'children': [
                            {
                                'id': 17,
                                'title': 'Car 2',
                                'level': 2,
                                'children': [],
                                'parent_id': 14
                            }
                        ],
                        'parent_id': 11
                    }
                ],
                'parent_id': null
            },
            {
                'id': 12,
                'title': 'Tree',
                'level': 0,
                'children': [
                    {
                        'id': 15,
                        'title': 'Tree 1',
                        'level': 1,
                        'children': [
                            {
                                'id': 18,
                                'title': 'Tree 2',
                                'level': 2,
                                'children': [],
                                'parent_id': 15
                            }
                        ],
                        'parent_id': 12
                    }
                ],
                'parent_id': null
            }
        ],
    }
];

module.exports = {testCases};