const testCases = [
    {
        'name': 'Empty Data',
        'input': {},
        'output': []
    },
    {
        'name': 'Github Test Case',
        'input': {
            "0": [
                {
                    "id": 10,
                    "title": "House",
                    "level": 0,
                    "children": [],
                    "parent_id": null
                }
            ],
            "1": [
                {
                    "id": 12,
                    "title": "Red Roof",
                    "level": 1,
                    "children": [],
                    "parent_id": 10
                },
                {
                    "id": 18,
                    "title": "Blue Roof",
                    "level": 1,
                    "children": [],
                    "parent_id": 10
                },
                {
                    "id": 13,
                    "title": "Wall",
                    "level": 1,
                    "children": [],
                    "parent_id": 10
                }
            ],
            "2": [
                {
                    "id": 17,
                    "title": "Blue Window",
                    "level": 2,
                    "children": [],
                    "parent_id": 12
                },
                {
                    "id": 16,
                    "title": "Door",
                    "level": 2,
                    "children": [],
                    "parent_id": 13
                },
                {
                    "id": 15,
                    "title": "Red Window",
                    "level": 2,
                    "children": [],
                    "parent_id": 12
                }
            ]
        },
        'output': [
            {
                "id": 10,
                "title": "House",
                "level": 0,
                "children": [
                    {
                        "id": 12,
                        "title": "Red Roof",
                        "level": 1,
                        "children": [
                            {
                                "id": 15,
                                "title": "Red Window",
                                "level": 2,
                                "children": [],
                                "parent_id": 12
                            },
                            {
                                "id": 17,
                                "title": "Blue Window",
                                "level": 2,
                                "children": [],
                                "parent_id": 12
                            }
                        ],
                        "parent_id": 10
                    },
                    {
                        "id": 13,
                        "title": "Wall",
                        "level": 1,
                        "children": [
                            {
                                "id": 16,
                                "title": "Door",
                                "level": 2,
                                "children": [],
                                "parent_id": 13
                            }
                        ],
                        "parent_id": 10
                    },
                    {
                        "id": 18,
                        "title": "Blue Roof",
                        "level": 1,
                        "children": [],
                        "parent_id": 10
                    }
                ],
                "parent_id": null
            }
        ]
    }
];

module.exports = {testCases};