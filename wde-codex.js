/*
 * WE-Framework migrated to Vue 3 and Wikimedia Codex
 */
(function () {
    'use strict';

    window.addEventListener('error', function (e) {
        if (e.message && e.message.indexOf('ResizeObserver') !== -1) {
            e.stopImmediatePropagation();
        }
    });

    mw.loader.using([
        'vue',
        '@wikimedia/codex',
        'mediawiki.api',
        'mediawiki.util',
        'mediawiki.ForeignApi'
    ]).then(function (require) {
        const Vue = require('vue');
        const Codex = require('@wikimedia/codex');

        // We get Vue functionality from the global Vue object or requirement
        const { createApp, ref, reactive, computed, onMounted } = Vue;
        const {
            CdxDialog,
            CdxButton,
            CdxTextInput,
            CdxLookup,
            CdxSelect,
            CdxMessage,
            CdxIcon
        } = Codex;

        // All Editor Configs
        const editorConfigs = {
            "AdmEntity": {
                "id": "AdmEntity",
                "linkText": "AdmEntity",
                "description": "Administrative entities: countries, states, cities",
                "dialogTitle": "Administrative entity — WE-Framework",
                "newEntityInstanceOf": "Q486972",
                "recommendedClasses": [
                    "Q486972",
                    "Q1048835"
                ],
                "tabs": [
                    {
                        "label": "general",
                        "specials": [
                            {
                                "type": "LabelsAndDescriptionArea"
                            }
                        ],
                        "fields": [
                            {
                                "property": "P31"
                            },
                            {
                                "property": "P131"
                            },
                            {
                                "property": "P361"
                            },
                            {
                                "property": "P17"
                            },
                            {
                                "property": "P1336"
                            }
                        ],
                        "fieldsets": [
                            {
                                "labelEntityId": "P1448",
                                "fields": [
                                    {
                                        "property": "P1448"
                                    }
                                ]
                            },
                            {
                                "fields": [
                                    {
                                        "property": "P37"
                                    },
                                    {
                                        "property": "P38"
                                    },
                                    {
                                        "property": "P856"
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        "label": "Media",
                        "fieldsets": [
                            {
                                "labelEntityId": "Q14660",
                                "fields": [
                                    {
                                        "property": "P163"
                                    },
                                    {
                                        "property": "P41"
                                    }
                                ]
                            },
                            {
                                "labelEntityId": "Q14659",
                                "fields": [
                                    {
                                        "property": "P237"
                                    },
                                    {
                                        "property": "P94"
                                    }
                                ]
                            }
                        ],
                        "fields": [
                            {
                                "property": "P18"
                            },
                            {
                                "property": "P85"
                            },
                            {
                                "property": "P242"
                            },
                            {
                                "property": "P373"
                            }
                        ]
                    },
                    {
                        "labelEntityId": "Q309",
                        "fieldsets": [
                            {
                                "fields": [
                                    {
                                        "property": "P571"
                                    },
                                    {
                                        "property": "P1365"
                                    },
                                    {
                                        "property": "P1366"
                                    }
                                ]
                            },
                            {
                                "labelEntityId": "P138",
                                "fields": [
                                    {
                                        "property": "P138"
                                    }
                                ]
                            },
                            {
                                "labelEntityId": "P793",
                                "fields": [
                                    {
                                        "property": "P793"
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        "labelEntityId": "Q1071",
                        "fieldsets": [
                            {
                                "fields": [
                                    {
                                        "property": "P625"
                                    },
                                    {
                                        "property": "P242"
                                    },
                                    {
                                        "property": "P30"
                                    },
                                    {
                                        "property": "P206"
                                    },
                                    {
                                        "property": "P2046"
                                    },
                                    {
                                        "property": "P2044"
                                    },
                                    {
                                        "property": "P610"
                                    }
                                ]
                            },
                            {
                                "fields": [
                                    {
                                        "property": "P36"
                                    },
                                    {
                                        "property": "P1376"
                                    },
                                    {
                                        "property": "P421"
                                    }
                                ]
                            },
                            {
                                "labelEntityId": "P47",
                                "fields": [
                                    {
                                        "property": "P47"
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        "labelEntityId": "Q7163",
                        "fieldsets": [
                            {
                                "fields": [
                                    {
                                        "property": "P122"
                                    },
                                    {
                                        "property": "P194"
                                    },
                                    {
                                        "property": "P209"
                                    },
                                    {
                                        "property": "P6"
                                    },
                                    {
                                        "property": "P1313"
                                    },
                                    {
                                        "property": "P1304"
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        "labelEntityId": "P527",
                        "fieldsets": [
                            {
                                "fields": [
                                    {
                                        "property": "P150"
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        "labelEntityId": "Q37732",
                        "fieldsets": [
                            {
                                "fields": [
                                    {
                                        "property": "P1125"
                                    },
                                    {
                                        "property": "P1082"
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        "labelEntityId": "P190",
                        "fieldsets": [
                            {
                                "fields": [
                                    {
                                        "property": "P190"
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        "labelEntityId": "P463",
                        "fieldsets": [
                            {
                                "fields": [
                                    {
                                        "property": "P463"
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        "labelEntityId": "Q4167836",
                        "fieldsets": [
                            {
                                "fields": [
                                    {
                                        "property": "P910"
                                    },
                                    {
                                        "property": "P1464"
                                    },
                                    {
                                        "property": "P1465"
                                    },
                                    {
                                        "property": "P1791"
                                    },
                                    {
                                        "property": "P1792"
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        "labelEntityId": "Q853614",
                        "fieldsets": [
                            {
                                "fields": [
                                    {
                                        "property": "P281"
                                    },
                                    {
                                        "property": "P395"
                                    },
                                    {
                                        "property": "P473"
                                    }
                                ]
                            },
                            {
                                "labelEntityId": "Q106487",
                                "fields": [
                                    {
                                        "property": "P297"
                                    },
                                    {
                                        "property": "P298"
                                    },
                                    {
                                        "property": "P299"
                                    },
                                    {
                                        "property": "P300"
                                    },
                                    {
                                        "property": "P773"
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        "labelEntityId": "Q36524",
                        "specials": [
                            {
                                "type": "SparqlPropertyGroup",
                                "sparql": "SELECT DISTINCT ?property WHERE { ?property wdt:P31/wdt:P279* wd:Q55977691 . {?property wikibase:propertyType wikibase:ExternalId} UNION {?property wikibase:propertyType wikibase:String} . }"
                            }
                        ]
                    }
                ]
            },
            "Article": {
                "id": "Article",
                "linkText": "Article",
                "description": "Scientific and newspapers articles",
                "dialogTitle": "Scientific or newspaper article — WE-Framework",
                "newEntityInstanceOf": "Q191067",
                "recommendedClasses": [
                    "Q191067"
                ],
                "tabs": [
                    {
                        "label": "general",
                        "specials": [
                            {
                                "type": "LabelsAndDescriptionArea"
                            }
                        ],
                        "fieldsets": [
                            {
                                "fields": [
                                    {
                                        "property": "P31"
                                    }
                                ]
                            },
                            {
                                "fields": [
                                    {
                                        "property": "P50"
                                    },
                                    {
                                        "property": "P767"
                                    }
                                ]
                            },
                            {
                                "fields": [
                                    {
                                        "property": "P1476"
                                    },
                                    {
                                        "property": "P1680"
                                    },
                                    {
                                        "property": "P407"
                                    },
                                    {
                                        "property": "P571"
                                    },
                                    {
                                        "property": "P921"
                                    }
                                ]
                            },
                            {
                                "fields": [
                                    {
                                        "property": "P1433"
                                    },
                                    {
                                        "property": "P953"
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        "labelEntityId": "Q36524",
                        "specials": [
                            {
                                "type": "SparqlPropertyGroup",
                                "sparql": "SELECT DISTINCT ?property WHERE { ?property wdt:P31/wdt:P279* wd:Q29548341 . ?property wikibase:propertyType wikibase:ExternalId . }"
                            }
                        ]
                    }
                ]
            },
            "Award": {
                "id": "Award",
                "linkText": "Award",
                "description": "Awards",
                "dialogTitle": "Scientific or newspaper article — WE-Framework",
                "newEntityInstanceOf": "Q618779",
                "recommendedClasses": [
                    "Q4189293",
                    "Q618779"
                ],
                "tabs": [
                    {
                        "label": "general",
                        "specials": [
                            {
                                "type": "LabelsAndDescriptionArea"
                            }
                        ],
                        "fieldsets": [
                            {
                                "fields": [
                                    {
                                        "property": "P31"
                                    },
                                    {
                                        "property": "P279"
                                    },
                                    {
                                        "property": "P361"
                                    }
                                ]
                            },
                            {
                                "fields": [
                                    {
                                        "property": "P1705"
                                    },
                                    {
                                        "property": "P17"
                                    },
                                    {
                                        "property": "P571"
                                    },
                                    {
                                        "property": "P3729"
                                    },
                                    {
                                        "property": "P3730"
                                    }
                                ]
                            },
                            {
                                "fields": [
                                    {
                                        "property": "P1451"
                                    },
                                    {
                                        "property": "P18"
                                    },
                                    {
                                        "property": "P2425"
                                    },
                                    {
                                        "property": "P2910"
                                    },
                                    {
                                        "property": "P1114"
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        "labelEntityId": "P527",
                        "fields": [
                            {
                                "property": "P527"
                            }
                        ]
                    },
                    {
                        "labelEntityId": "Q3568028",
                        "fields": [
                            {
                                "property": "P373"
                            },
                            {
                                "property": "P1424"
                            },
                            {
                                "property": "P2517"
                            }
                        ]
                    },
                    {
                        "labelEntityId": "P1343",
                        "fields": [
                            {
                                "property": "P1343"
                            }
                        ]
                    }
                ]
            },
            "Book": {
                "id": "Book",
                "linkText": "Book / Journal",
                "description": "Printed and electronic books and journals",
                "dialogTitle": "Book or journal — WE-Framework",
                "newEntityInstanceOf": "Q571",
                "recommendedClasses": [
                    "Q571",
                    "Q41298"
                ],
                "tabs": [
                    {
                        "label": "general",
                        "specials": [
                            {
                                "type": "LabelsAndDescriptionArea"
                            }
                        ],
                        "fieldsets": [
                            {
                                "fields": [
                                    {
                                        "property": "P31"
                                    },
                                    {
                                        "property": "P1476"
                                    },
                                    {
                                        "property": "P1680"
                                    },
                                    {
                                        "property": "P1160"
                                    },
                                    {
                                        "property": "P407"
                                    },
                                    {
                                        "property": "P571"
                                    },
                                    {
                                        "property": "P393"
                                    }
                                ]
                            },
                            {
                                "fields": [
                                    {
                                        "property": "P50"
                                    },
                                    {
                                        "property": "P767"
                                    },
                                    {
                                        "property": "P98"
                                    },
                                    {
                                        "property": "P110"
                                    },
                                    {
                                        "property": "P655"
                                    }
                                ]
                            },
                            {
                                "fields": [
                                    {
                                        "property": "P361"
                                    },
                                    {
                                        "property": "P478"
                                    },
                                    {
                                        "property": "P433"
                                    },
                                    {
                                        "property": "P1104"
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        "label": "general",
                        "fieldsets": [
                            {
                                "fields": [
                                    {
                                        "property": "P291"
                                    },
                                    {
                                        "property": "P123"
                                    },
                                    {
                                        "property": "P577"
                                    },
                                    {
                                        "property": "P872"
                                    }
                                ]
                            },
                            {
                                "fields": [
                                    {
                                        "property": "P953"
                                    },
                                    {
                                        "property": "P996"
                                    },
                                    {
                                        "property": "P1957"
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        "labelEntityId": "Q36524",
                        "specials": [
                            {
                                "type": "SparqlPropertyGroup",
                                "sparql": "SELECT DISTINCT ?property WHERE { ?property wdt:P31/wdt:P279* wd:Q29547399 . ?property wikibase:propertyType wikibase:ExternalId . }"
                            }
                        ]
                    }
                ]
            },
            "Entity": {
                "id": "Entity",
                "linkText": "Entity",
                "description": "Generic and simple editor",
                "dialogTitle": "Entity — WE-Framework",
                "newEntityInstanceOf": "Q35120",
                "tabs": [
                    {
                        "label": "general",
                        "specials": [
                            {
                                "type": "LabelsAndDescriptionArea"
                            }
                        ],
                        "fields": [
                            {
                                "property": "P31"
                            },
                            {
                                "property": "P279"
                            }
                        ]
                    },
                    {
                        "labelEntityId": "P1343",
                        "fields": [
                            {
                                "property": "P1343"
                            }
                        ]
                    }
                ]
            },
            "ExternalLinks": {
                "id": "ExternalLinks",
                "linkText": "External IDs",
                "description": "External IDs and authoritative control",
                "dialogTitle": "External IDs and links — WE-Framework",
                "tabs": [
                    {
                        "labelEntityId": "Q6576792",
                        "specials": [
                            {
                                "type": "SparqlPropertyGroup",
                                "sparql": "SELECT DISTINCT ?property WHERE { ?property wdt:P31/wdt:P279* wd:Q30041186 . ?property wikibase:propertyType wikibase:ExternalId . }"
                            }
                        ]
                    },
                    {
                        "labelEntityId": "Q1415395",
                        "specials": [
                            {
                                "type": "SparqlPropertyGroup",
                                "sparql": "SELECT DISTINCT ?property WHERE { ?property wdt:P31/wdt:P279* wd:Q22964274 . ?property wikibase:propertyType wikibase:ExternalId . }"
                            }
                        ]
                    },
                    {
                        "labelEntityId": "Q47307",
                        "specials": [
                            {
                                "type": "SparqlPropertyGroup",
                                "sparql": "SELECT DISTINCT ?property WHERE { ?property wdt:P31/wdt:P279* wd:Q56249073 . ?property wikibase:propertyType wikibase:ExternalId . }"
                            }
                        ]
                    },
                    {
                        "labelEntityId": "Q638",
                        "specials": [
                            {
                                "type": "SparqlPropertyGroup",
                                "sparql": "SELECT DISTINCT ?property WHERE { ?property wdt:P31/wdt:P279* wd:Q27525351 . ?property wikibase:propertyType wikibase:ExternalId . }"
                            }
                        ]
                    },
                    {
                        "labelEntityId": "Q7991",
                        "specials": [
                            {
                                "type": "SparqlPropertyGroup",
                                "sparql": "SELECT DISTINCT ?property WHERE { ?property wdt:P31/wdt:P279* wd:Q52425722 . ?property wikibase:propertyType wikibase:ExternalId . }"
                            }
                        ]
                    },
                    {
                        "labelEntityId": "Q7163",
                        "specials": [
                            {
                                "type": "SparqlPropertyGroup",
                                "sparql": "SELECT DISTINCT ?property WHERE { ?property wdt:P31/wdt:P279* wd:Q22984475 . ?property wikibase:propertyType wikibase:ExternalId . }"
                            }
                        ]
                    },
                    {
                        "labelEntityId": "Q349",
                        "specials": [
                            {
                                "type": "SparqlPropertyGroup",
                                "sparql": "SELECT DISTINCT ?property WHERE { ?property wdt:P31/wdt:P279* wd:Q21818626 . ?property wikibase:propertyType wikibase:ExternalId . }"
                            }
                        ]
                    },
                    {
                        "labelEntityId": "Q7889",
                        "specials": [
                            {
                                "type": "SparqlPropertyGroup",
                                "sparql": "SELECT DISTINCT ?property WHERE { ?property wdt:P31/wdt:P279* wd:Q28147643 . ?property wikibase:propertyType wikibase:ExternalId . }"
                            }
                        ]
                    },
                    {
                        "labelEntityId": "Q5292",
                        "specials": [
                            {
                                "type": "SparqlPropertyGroup",
                                "sparql": "SELECT DISTINCT ?property WHERE { ?property wdt:P31/wdt:P279* wd:Q55452870 . ?property wikibase:propertyType wikibase:ExternalId . }"
                            }
                        ]
                    },
                    {
                        "labelEntityId": "Q54919",
                        "fields": [
                            {
                                "property": "P214"
                            }
                        ],
                        "specials": [
                            {
                                "type": "SparqlPropertyGroup",
                                "sparql": "SELECT DISTINCT ?property WHERE { ?property wdt:P31/wdt:P279* wd:Q55586529 . ?property wikibase:propertyType wikibase:ExternalId . }"
                            }
                        ]
                    },
                    {
                        "labelEntityId": "Q36524",
                        "specials": [
                            {
                                "type": "SparqlPropertyGroup",
                                "sparql": "SELECT DISTINCT ?property WHERE {  ?property wdt:P31/wdt:P279* wd:Q18614948 .  ?property wikibase:propertyType wikibase:ExternalId .  MINUS { ?property wdt:P31 wd:Q30041186 } .  MINUS { ?property wdt:P31/wdt:P279* wd:Q22964274 } .  MINUS { ?property wdt:P31/wdt:P279* wd:Q56249073 } .  MINUS { ?property wdt:P31/wdt:P279* wd:Q27525351 } .  MINUS { ?property wdt:P31/wdt:P279* wd:Q22984475 } .  MINUS { ?property wdt:P31/wdt:P279* wd:Q21818626 } .  MINUS { ?property wdt:P31/wdt:P279* wd:Q52425722 } .  MINUS { ?property wdt:P31/wdt:P279* wd:Q28147643 } .  MINUS { ?property wdt:P31/wdt:P279* wd:Q55452870 } .  MINUS { ?property wdt:P31/wdt:P279* wd:Q55586529 } . }"
                            }
                        ]
                    }
                ]
            },
            "FrbrEdition": {
                "id": "FrbrEdition",
                "linkText": "FRBR Edition",
                "dialogTitle": "FRBR Edition data — WE-Framework",
                "newEntityInstanceOf": "Q3331189",
                "recommendedClasses": [
                    "Q3331189"
                ],
                "tabs": [
                    {
                        "label": "general",
                        "specials": [
                            {
                                "type": "LabelsAndDescriptionArea"
                            }
                        ],
                        "fieldsets": [
                            {
                                "fields": [
                                    {
                                        "property": "P31"
                                    },
                                    {
                                        "property": "P18"
                                    }
                                ]
                            },
                            {
                                "fields": [
                                    {
                                        "property": "P629"
                                    },
                                    {
                                        "property": "P393"
                                    },
                                    {
                                        "property": "P291"
                                    },
                                    {
                                        "property": "P123"
                                    },
                                    {
                                        "property": "P577"
                                    },
                                    {
                                        "property": "P872"
                                    }
                                ]
                            },
                            {
                                "fields": [
                                    {
                                        "property": "P407"
                                    },
                                    {
                                        "property": "P1476"
                                    },
                                    {
                                        "property": "P1680"
                                    }
                                ]
                            },
                            {
                                "fields": [
                                    {
                                        "property": "P361"
                                    },
                                    {
                                        "property": "P1433"
                                    },
                                    {
                                        "property": "P155"
                                    },
                                    {
                                        "property": "P156"
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        "labelEntityId": "Q1260632",
                        "fieldsets": [
                            {
                                "fields": [
                                    {
                                        "property": "P50"
                                    },
                                    {
                                        "property": "P655"
                                    },
                                    {
                                        "property": "P98"
                                    },
                                    {
                                        "property": "P110"
                                    },
                                    {
                                        "property": "P767"
                                    }
                                ]
                            },
                            {
                                "fields": [
                                    {
                                        "property": "P1104"
                                    },
                                    {
                                        "property": "P1922"
                                    },
                                    {
                                        "property": "P996"
                                    },
                                    {
                                        "property": "P953"
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        "labelEntityId": "Q36524",
                        "specials": [
                            {
                                "type": "SparqlPropertyGroup",
                                "sparql": "SELECT DISTINCT ?property WHERE { ?property wdt:P31 wd:Q29547399 . ?property wikibase:propertyType wikibase:ExternalId . }"
                            }
                        ]
                    }
                ]
            },
            "FrbrWork": {
                "id": "FrbrWork",
                "linkText": "FRBR Work",
                "dialogTitle": "FRBR Work data — WE-Framework",
                "newEntityInstanceOf": "Q386724",
                "recommendedClasses": [
                    "Q386724"
                ],
                "tabs": [
                    {
                        "label": "general",
                        "specials": [
                            {
                                "type": "LabelsAndDescriptionArea"
                            }
                        ],
                        "fieldsets": [
                            {
                                "fields": [
                                    {
                                        "property": "P31"
                                    },
                                    {
                                        "property": "P18"
                                    }
                                ]
                            },
                            {
                                "fields": [
                                    {
                                        "property": "P50"
                                    },
                                    {
                                        "property": "P767"
                                    },
                                    {
                                        "property": "P98"
                                    }
                                ]
                            },
                            {
                                "fields": [
                                    {
                                        "property": "P1476"
                                    },
                                    {
                                        "property": "P1680"
                                    },
                                    {
                                        "property": "P407"
                                    },
                                    {
                                        "property": "P571"
                                    },
                                    {
                                        "property": "P577"
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        "labelEntityId": "Q1260632",
                        "fieldsets": [
                            {
                                "fields": [
                                    {
                                        "property": "P135"
                                    },
                                    {
                                        "property": "P136"
                                    },
                                    {
                                        "property": "P921"
                                    },
                                    {
                                        "property": "P1922"
                                    }
                                ]
                            },
                            {
                                "fields": [
                                    {
                                        "property": "P155"
                                    },
                                    {
                                        "property": "P156"
                                    },
                                    {
                                        "property": "P179"
                                    }
                                ]
                            },
                            {
                                "fields": [
                                    {
                                        "property": "P144"
                                    },
                                    {
                                        "property": "P941"
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        "labelEntityId": "P674",
                        "fieldsets": [
                            {
                                "labelEntityId": "P674",
                                "fields": [
                                    {
                                        "property": "P674"
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        "labelEntityId": "P166",
                        "fieldsets": [
                            {
                                "labelEntityId": "P166",
                                "fields": [
                                    {
                                        "property": "P166"
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        "labelEntityId": "P747",
                        "fieldsets": [
                            {
                                "labelEntityId": "P747",
                                "fields": [
                                    {
                                        "property": "P747"
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        "labelEntityId": "Q36524",
                        "specials": [
                            {
                                "type": "SparqlPropertyGroup",
                                "sparql": "SELECT DISTINCT ?property WHERE { ?property wdt:P31 wd:Q19833377 . ?property wikibase:propertyType wikibase:ExternalId . }"
                            }
                        ]
                    }
                ]
            },
            "LegalInstrument": {
                "id": "LegalInstrument",
                "linkText": "Legal Act",
                "description": "Legal Instrument: executive orders, laws, court acts, etc.",
                "dialogTitle": "Legal Instrument — WE-Framework",
                "newEntityInstanceOf": "Q1428955",
                "recommendedClasses": [
                    "Q1428955"
                ],
                "tabs": [
                    {
                        "label": "general",
                        "specials": [
                            {
                                "type": "LabelsAndDescriptionArea"
                            }
                        ],
                        "fieldsets": [
                            {
                                "fields": [
                                    {
                                        "property": "P31"
                                    },
                                    {
                                        "property": "P1476"
                                    },
                                    {
                                        "property": "P1680"
                                    },
                                    {
                                        "property": "P571"
                                    },
                                    {
                                        "property": "P1545"
                                    },
                                    {
                                        "property": "P407"
                                    },
                                    {
                                        "property": "P577"
                                    }
                                ]
                            },
                            {
                                "fields": [
                                    {
                                        "property": "P50"
                                    },
                                    {
                                        "property": "P767"
                                    },
                                    {
                                        "property": "P98"
                                    }
                                ]
                            },
                            {
                                "fields": [
                                    {
                                        "property": "P155"
                                    },
                                    {
                                        "property": "P156"
                                    }
                                ]
                            },
                            {
                                "fields": [
                                    {
                                        "property": "P1433"
                                    },
                                    {
                                        "property": "P996"
                                    },
                                    {
                                        "property": "P953"
                                    }
                                ]
                            }
                        ]
                    }
                ]
            },
            "Movie": {
                "id": "Movie",
                "linkText": "Movie",
                "description": "Animations and movies",
                "dialogTitle": "Animation and Movie  — WE-Framework",
                "newEntityInstanceOf": "Q11424",
                "recommendedClasses": [
                    "Q2431196"
                ],
                "tabs": [
                    {
                        "label": "general",
                        "specials": [
                            {
                                "type": "LabelsAndDescriptionArea"
                            }
                        ],
                        "fields": [
                            {
                                "property": "P31"
                            },
                            {
                                "property": "P18"
                            },
                            {
                                "property": "P1476"
                            },
                            {
                                "property": "P495"
                            },
                            {
                                "property": "P364"
                            },
                            {
                                "property": "P577"
                            },
                            {
                                "property": "P915"
                            },
                            {
                                "property": "P2130"
                            },
                            {
                                "property": "P2142"
                            },
                            {
                                "property": "P449"
                            },
                            {
                                "property": "P856"
                            },
                            {
                                "property": "P373"
                            }
                        ]
                    },
                    {
                        "labelEntityId": "Q1260632",
                        "fields": [
                            {
                                "property": "P136"
                            },
                            {
                                "property": "P144"
                            },
                            {
                                "property": "P2061"
                            },
                            {
                                "property": "P2047"
                            },
                            {
                                "property": "P155"
                            },
                            {
                                "property": "P156"
                            },
                            {
                                "property": "P1811"
                            },
                            {
                                "property": "P1113"
                            },
                            {
                                "property": "P2437"
                            }
                        ]
                    },
                    {
                        "labelEntityId": "Q3297652",
                        "fields": [
                            {
                                "property": "P170"
                            },
                            {
                                "property": "P57"
                            },
                            {
                                "property": "P344"
                            },
                            {
                                "property": "P58"
                            },
                            {
                                "property": "P162"
                            },
                            {
                                "property": "P1431"
                            },
                            {
                                "property": "P86"
                            },
                            {
                                "property": "P1809"
                            },
                            {
                                "property": "P272"
                            },
                            {
                                "property": "P750"
                            }
                        ]
                    },
                    {
                        "labelEntityId": "P161",
                        "fields": [
                            {
                                "property": "P161"
                            },
                            {
                                "property": "P2438"
                            }
                        ]
                    },
                    {
                        "labelEntityId": "P725",
                        "fields": [
                            {
                                "property": "P725"
                            }
                        ]
                    },
                    {
                        "labelEntityId": "P166",
                        "fields": [
                            {
                                "property": "P166"
                            }
                        ]
                    },
                    {
                        "labelEntityId": "Q36524",
                        "specials": [
                            {
                                "type": "SparqlPropertyGroup",
                                "sparql": "SELECT DISTINCT ?property WHERE { ?property wdt:P31 wd:Q29542094 . ?property wikibase:propertyType wikibase:ExternalId . }"
                            }
                        ]
                    }
                ]
            },
            "Person": {
                "id": "Person",
                "linkText": "Person",
                "dialogTitle": "Person data — WE-Framework",
                "newEntityInstanceOf": "Q5",
                "recommendedClasses": [
                    "Q215627"
                ],
                "tabs": [
                    {
                        "label": "general",
                        "specials": [
                            {
                                "type": "LabelsAndDescriptionArea"
                            }
                        ],
                        "fieldsets": [
                            {
                                "fields": [
                                    {
                                        "property": "P1559"
                                    },
                                    {
                                        "property": "P1477"
                                    },
                                    {
                                        "property": "P742"
                                    },
                                    {
                                        "property": "P1449"
                                    }
                                ]
                            },
                            {
                                "fields": [
                                    {
                                        "property": "P53"
                                    },
                                    {
                                        "property": "P97"
                                    },
                                    {
                                        "property": "P511"
                                    }
                                ]
                            },
                            {
                                "fields": [
                                    {
                                        "property": "P31"
                                    },
                                    {
                                        "property": "P21"
                                    },
                                    {
                                        "property": "P91"
                                    },
                                    {
                                        "property": "P27"
                                    },
                                    {
                                        "property": "P551"
                                    },
                                    {
                                        "property": "P103"
                                    },
                                    {
                                        "property": "P1412"
                                    },
                                    {
                                        "property": "P856"
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        "label": "birth & death",
                        "fieldsets": [
                            {
                                "fields": [
                                    {
                                        "property": "P569"
                                    },
                                    {
                                        "property": "P19"
                                    },
                                    {
                                        "property": "P172"
                                    },
                                    {
                                        "property": "P103"
                                    }
                                ]
                            },
                            {
                                "fields": [
                                    {
                                        "property": "P1321"
                                    },
                                    {
                                        "property": "P66"
                                    }
                                ]
                            },
                            {
                                "fields": [
                                    {
                                        "property": "P1317"
                                    }
                                ]
                            },
                            {
                                "fields": [
                                    {
                                        "property": "P1050"
                                    },
                                    {
                                        "property": "P570"
                                    },
                                    {
                                        "property": "P20"
                                    },
                                    {
                                        "property": "P509"
                                    },
                                    {
                                        "property": "P1196"
                                    },
                                    {
                                        "property": "P157"
                                    },
                                    {
                                        "property": "P119"
                                    },
                                    {
                                        "property": "P535"
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        "label": "media",
                        "fieldsets": [
                            {
                                "fields": [
                                    {
                                        "property": "P18"
                                    },
                                    {
                                        "property": "P109"
                                    },
                                    {
                                        "property": "P990"
                                    },
                                    {
                                        "property": "P1442"
                                    }
                                ]
                            },
                            {
                                "labelEntityId": "P237",
                                "fields": [
                                    {
                                        "property": "P94"
                                    },
                                    {
                                        "property": "P237"
                                    }
                                ]
                            },
                            {
                                "fields": [
                                    {
                                        "property": "P373"
                                    },
                                    {
                                        "property": "P1472"
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        "labelEntityId": "Q8436",
                        "fields": [
                            {
                                "property": "P22"
                            },
                            {
                                "property": "P25"
                            },
                            {
                                "property": "P1290"
                            },
                            {
                                "property": "P3373"
                            },
                            {
                                "property": "P26"
                            },
                            {
                                "property": "P451"
                            },
                            {
                                "property": "P1971"
                            },
                            {
                                "property": "P40"
                            },
                            {
                                "property": "P1038"
                            },
                            {
                                "property": "P3342"
                            }
                        ]
                    },
                    {
                        "label": "education & science",
                        "fieldsets": [
                            {
                                "fields": [
                                    {
                                        "property": "P1066"
                                    },
                                    {
                                        "property": "P69"
                                    },
                                    {
                                        "property": "P184"
                                    },
                                    {
                                        "property": "P1026"
                                    },
                                    {
                                        "property": "P512"
                                    },
                                    {
                                        "property": "P803"
                                    },
                                    {
                                        "property": "P802"
                                    },
                                    {
                                        "property": "P185"
                                    }
                                ]
                            },
                            {
                                "fields": [
                                    {
                                        "property": "P549"
                                    },
                                    {
                                        "property": "P496"
                                    },
                                    {
                                        "property": "P864"
                                    },
                                    {
                                        "property": "P2456"
                                    },
                                    {
                                        "property": "P1556"
                                    },
                                    {
                                        "property": "P1960"
                                    },
                                    {
                                        "property": "P1053"
                                    },
                                    {
                                        "property": "P1153"
                                    }
                                ]
                            },
                            {
                                "fields": [
                                    {
                                        "property": "P428"
                                    },
                                    {
                                        "property": "P835"
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        "labelEntityId": "Q28640",
                        "fieldsets": [
                            {
                                "fields": [
                                    {
                                        "property": "P106"
                                    },
                                    {
                                        "property": "P101"
                                    },
                                    {
                                        "property": "P108"
                                    },
                                    {
                                        "property": "P263"
                                    }
                                ]
                            },
                            {
                                "labelEntityId": "P39",
                                "fields": [
                                    {
                                        "property": "P39"
                                    }
                                ]
                            },
                            {
                                "labelEntityId": "P463",
                                "fields": [
                                    {
                                        "property": "P463"
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        "labelEntityId": "Q309",
                        "fieldsets": [
                            {
                                "labelEntityId": "P551",
                                "fields": [
                                    {
                                        "property": "P551"
                                    }
                                ]
                            },
                            {
                                "labelEntityId": "P7153",
                                "fields": [
                                    {
                                        "property": "P7153"
                                    }
                                ]
                            },
                            {
                                "labelEntityId": "P793",
                                "fields": [
                                    {
                                        "property": "P793"
                                    }
                                ]
                            },
                            {
                                "labelEntityId": "P1344",
                                "fields": [
                                    {
                                        "property": "P1344"
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        "labelEntityId": "Q8473",
                        "fields": [
                            {
                                "property": "P241"
                            },
                            {
                                "property": "P410"
                            },
                            {
                                "property": "P598"
                            },
                            {
                                "property": "P607"
                            }
                        ]
                    },
                    {
                        "labelEntityId": "Q20978643",
                        "fieldsets": [
                            {
                                "labelEntityId": "P102",
                                "fields": [
                                    {
                                        "property": "P102"
                                    }
                                ]
                            },
                            {
                                "fields": [
                                    {
                                        "property": "P140"
                                    },
                                    {
                                        "property": "P411"
                                    },
                                    {
                                        "property": "P841"
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        "labelEntityId": "Q349",
                        "fields": [
                            {
                                "property": "P2416"
                            },
                            {
                                "property": "P54"
                            },
                            {
                                "property": "P413"
                            },
                            {
                                "property": "P423"
                            },
                            {
                                "property": "P741"
                            },
                            {
                                "property": "P468"
                            },
                            {
                                "property": "P2415"
                            }
                        ],
                        "fieldsets": [
                            {
                                "fields": [
                                    {
                                        "property": "P1317"
                                    },
                                    {
                                        "property": "P2031"
                                    },
                                    {
                                        "property": "P2032"
                                    },
                                    {
                                        "property": "P937"
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        "labelEntityId": "Q11042",
                        "fields": [
                            {
                                "property": "P135"
                            },
                            {
                                "property": "P136"
                            },
                            {
                                "property": "P412"
                            },
                            {
                                "property": "P1303"
                            },
                            {
                                "property": "P800"
                            },
                            {
                                "property": "P358"
                            }
                        ],
                        "fieldsets": [
                            {
                                "fields": [
                                    {
                                        "property": "P1317"
                                    },
                                    {
                                        "property": "P2031"
                                    },
                                    {
                                        "property": "P2032"
                                    },
                                    {
                                        "property": "P937"
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        "labelEntityId": "P166",
                        "fieldsets": [
                            {
                                "labelEntityId": "P166",
                                "fields": [
                                    {
                                        "property": "P166"
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        "labelEntityId": "P1830",
                        "fieldsets": [
                            {
                                "labelEntityId": "P1830",
                                "fields": [
                                    {
                                        "property": "P1830"
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        "labelEntityId": "P1343",
                        "fieldsets": [
                            {
                                "labelEntityId": "P1343",
                                "fields": [
                                    {
                                        "property": "P1343"
                                    }
                                ]
                            }
                        ]
                    }
                ]
            },
            "Software": {
                "id": "Software",
                "linkText": "Software",
                "description": "Software, including games and operation systems",
                "dialogTitle": "Software — WE-Framework",
                "newEntityInstanceOf": "Q7397",
                "recommendedClasses": [
                    "Q7397"
                ],
                "tabs": [
                    {
                        "label": "general",
                        "key": "general",
                        "specials": [
                            {
                                "type": "LabelsAndDescriptionArea"
                            }
                        ],
                        "fieldsets": [
                            {
                                "fields": [
                                    {
                                        "property": "P154"
                                    },
                                    {
                                        "property": "P18"
                                    },
                                    {
                                        "property": "P373"
                                    }
                                ]
                            },
                            {
                                "fields": [
                                    {
                                        "property": "P31"
                                    },
                                    {
                                        "property": "P112"
                                    },
                                    {
                                        "property": "P170"
                                    },
                                    {
                                        "property": "P178"
                                    },
                                    {
                                        "property": "P275"
                                    },
                                    {
                                        "property": "P856"
                                    }
                                ]
                            },
                            {
                                "fields": [
                                    {
                                        "property": "P400"
                                    },
                                    {
                                        "property": "P306"
                                    },
                                    {
                                        "property": "P277"
                                    },
                                    {
                                        "property": "P1414"
                                    },
                                    {
                                        "property": "P407"
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        "labelEntityId": "P348",
                        "key": "versions",
                        "fields": [
                            {
                                "property": "P348"
                            }
                        ]
                    },
                    {
                        "labelEntityId": "Q235557",
                        "key": "fileFormats",
                        "fieldsets": [
                            {
                                "labelEntityId": "P1072",
                                "fields": [
                                    {
                                        "property": "P1072"
                                    }
                                ]
                            },
                            {
                                "labelEntityId": "P1073",
                                "fields": [
                                    {
                                        "property": "P1073"
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        "labelEntityId": "Q36524",
                        "key": "authoritycontrol",
                        "fields": [
                            {
                                "property": "P3381"
                            },
                            {
                                "property": "P646"
                            },
                            {
                                "property": "P3417"
                            },
                            {
                                "property": "P3984"
                            }
                        ]
                    }
                ]
            },
            "Taxon": {
                "id": "Taxon",
                "linkText": "Taxon",
                "dialogTitle": "Taxon data — WE-Framework",
                "newEntityInstanceOf": "Q16521",
                "recommendedClasses": [
                    "Q16521"
                ],
                "tabs": [
                    {
                        "label": "general",
                        "specials": [
                            {
                                "type": "LabelsAndDescriptionArea"
                            }
                        ],
                        "fieldsets": [
                            {
                                "fields": [
                                    {
                                        "property": "P31"
                                    }
                                ]
                            },
                            {
                                "fields": [
                                    {
                                        "property": "P225"
                                    },
                                    {
                                        "property": "P566"
                                    },
                                    {
                                        "property": "P1403"
                                    },
                                    {
                                        "property": "P694"
                                    },
                                    {
                                        "property": "P1420"
                                    },
                                    {
                                        "property": "P697"
                                    },
                                    {
                                        "property": "P944"
                                    }
                                ]
                            },
                            {
                                "fields": [
                                    {
                                        "property": "P18"
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        "labelEntityId": "Q420",
                        "fieldsets": [
                            {
                                "fields": [
                                    {
                                        "property": "P105"
                                    },
                                    {
                                        "property": "P171"
                                    }
                                ]
                            },
                            {
                                "fields": [
                                    {
                                        "property": "P141"
                                    }
                                ]
                            },
                            {
                                "fields": [
                                    {
                                        "property": "P181"
                                    },
                                    {
                                        "property": "P183"
                                    },
                                    {
                                        "property": "P1425"
                                    },
                                    {
                                        "property": "P523"
                                    },
                                    {
                                        "property": "P524"
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        "labelEntityId": "Q36524",
                        "specials": [
                            {
                                "type": "SparqlPropertyGroup",
                                "sparql": "SELECT DISTINCT ?property WHERE { ?property wdt:P31 wd:Q42396390 . ?property wikibase:propertyType wikibase:ExternalId . }"
                            }
                        ]
                    }
                ]
            },
            "TransInfra": {
                "id": "TransInfra",
                "linkText": "Trans. Infra",
                "description": "Transport Infrastructure",
                "dialogTitle": "Transport Infrastructure — WE-Framework",
                "newEntityInstanceOf": "Q376799",
                "recommendedClasses": [
                    "Q719456"
                ],
                "tabs": [
                    {
                        "label": "general",
                        "specials": [
                            {
                                "type": "LabelsAndDescriptionArea"
                            }
                        ],
                        "fields": [
                            {
                                "property": "P31"
                            },
                            {
                                "property": "P131"
                            },
                            {
                                "property": "P931"
                            },
                            {
                                "property": "P361"
                            },
                            {
                                "property": "P17"
                            },
                            {
                                "property": "P421"
                            },
                            {
                                "property": "P127"
                            },
                            {
                                "property": "P137"
                            }
                        ],
                        "fieldsets": [
                            {
                                "labelEntityId": "P1448",
                                "fields": [
                                    {
                                        "property": "P1448"
                                    }
                                ]
                            },
                            {
                                "fields": [
                                    {
                                        "property": "P1329"
                                    },
                                    {
                                        "property": "P856"
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        "label": "media",
                        "fields": [
                            {
                                "property": "P154"
                            },
                            {
                                "property": "P18"
                            },
                            {
                                "property": "P242"
                            },
                            {
                                "property": "P15"
                            },
                            {
                                "property": "P373"
                            },
                            {
                                "property": "P935"
                            },
                            {
                                "property": "P948"
                            }
                        ]
                    },
                    {
                        "labelEntityId": "Q309",
                        "fieldsets": [
                            {
                                "fields": [
                                    {
                                        "property": "P571"
                                    },
                                    {
                                        "property": "P1619"
                                    },
                                    {
                                        "property": "P84"
                                    },
                                    {
                                        "property": "P138"
                                    }
                                ]
                            },
                            {
                                "labelEntityId": "P793",
                                "fields": [
                                    {
                                        "property": "P793"
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        "labelEntityId": "Q1071",
                        "fieldsets": [
                            {
                                "fields": [
                                    {
                                        "property": "P625"
                                    },
                                    {
                                        "property": "P242"
                                    },
                                    {
                                        "property": "P30"
                                    },
                                    {
                                        "property": "P206"
                                    },
                                    {
                                        "property": "P610"
                                    },
                                    {
                                        "property": "P2046"
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        "labelEntityId": "Q1757562",
                        "fields": [
                            {
                                "property": "P529"
                            }
                        ],
                        "specials": [
                            {
                                "type": "SparqlPropertyGroup",
                                "sparql": "SELECT DISTINCT ?property WHERE { ?property wdt:P31/wdt:P279* wd:Q61052867 . ?property wikibase:propertyType wikibase:ExternalId. }"
                            }
                        ]
                    },
                    {
                        "labelEntityId": "P527",
                        "fieldsets": [
                            {
                                "fields": [
                                    {
                                        "property": "P527"
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        "labelEntityId": "Q11369842",
                        "fieldsets": [
                            {
                                "fields": [
                                    {
                                        "property": "P1373"
                                    },
                                    {
                                        "property": "P3872"
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        "labelEntityId": "Q36524",
                        "specials": [
                            {
                                "type": "SparqlPropertyGroup",
                                "sparql": "SELECT DISTINCT ?property WHERE { ?property wdt:P31/wdt:P279* wd:Q22984363 . ?property wikibase:propertyType wikibase:ExternalId. }"
                            }
                        ]
                    }
                ]
            }
        };

        // Component: EntityLookup
        const EntityLookup = {
            components: { CdxLookup },
            props: ['modelValue'],
            template: `
               <cdx-lookup
                  :selected="selectedItem"
                  :menu-items="menuItems"
                  @input="onInput"
                  @update:selected="onSelected"
                  placeholder="Search Wikidata item..."
                  :clearable="true"
               >
                  <template #menu-item="{ menuItem }">
                     <strong>{{ menuItem.label }}</strong>
                     <span style="display:block; font-size: 0.8em; color: gray;">{{ menuItem.description }}</span>
                  </template>
               </cdx-lookup>
            `,
            setup(props, { emit }) {
                const menuItems = ref([]);
                const selectedItem = ref(null);
                const wdApi = new mw.ForeignApi('https://www.wikidata.org/w/api.php');
                let debounceTimeout = null;

                onMounted(() => {
                    if (props.modelValue) {
                        selectedItem.value = props.modelValue;
                        menuItems.value = [{ value: props.modelValue, label: props.modelValue }];
                    }
                });

                const onInput = (value) => {
                    if (debounceTimeout) clearTimeout(debounceTimeout);
                    if (!value) {
                        menuItems.value = [];
                        return;
                    }

                    debounceTimeout = setTimeout(async () => {
                        try {
                            const res = await wdApi.get({
                                action: 'wbsearchentities',
                                search: value,
                                language: mw.config.get('wgUserLanguage') || 'en',
                                format: 'json',
                                limit: 10
                            });
                            if (res && res.search) {
                                menuItems.value = res.search.map(s => ({
                                    value: s.id,
                                    label: s.label || s.id,
                                    description: (s.description ? s.description + ' (' + s.id + ')' : s.id)
                                }));
                            }
                        } catch (e) { }
                    }, 300);
                };

                const onSelected = (value) => {
                    selectedItem.value = value;
                    emit('update:modelValue', value);
                };

                return {
                    menuItems,
                    selectedItem,
                    onInput,
                    onSelected
                };
            }
        };

        // Component: App
        const App = {
            template: `
        <div style="width:800px !important;">
          <style>
             .cdx-dialog__document, .cdx-dialog-document {
                  max-width: 800px !important;
                  width: 90vw !important;
             }
             .cdx-dialog {
                 --cdx-dialog-max-width: 800px;
                 --cdx-dialog-min-width: 400px;
             }
          </style>
          <div v-for="(config, name) in editorConfigs" :key="name">
            <cdx-button @click="openDialog(config)" weight="primary" style="margin-top: 10px;">
              {{ config.linkText }}
            </cdx-button>
          </div>

          <cdx-dialog
            v-if="activeConfig"
            :open="isDialogOpen"
            @update:open="isDialogOpen = $event"
            :title="activeConfig.dialogTitle"
            close-button-label="Close"
            :primary-action="primaryAction"
            :default-action="defaultAction"
            @primary="saveData"
            @default="isDialogOpen = false"
          >
            <div v-if="loading">
               <cdx-message type="notice">Loading Wikidata entity data...</cdx-message>
            </div>
            <div v-else-if="entityData" style="min-width: 600px; max-width: 90vw; max-height: 80vh; overflow-y: auto; padding-right: 15px;">
               <div style="display:flex; flex-wrap:wrap; gap:10px; margin-bottom:20px; border-bottom:1px solid #ccc; padding-bottom:10px;">
                  <cdx-button 
                     v-for="(tab, index) in activeConfig.tabs"
                     :key="index"
                     :weight="activeTab === index ? 'primary' : 'quiet'"
                     @click="activeTab = index"
                  >
                    {{ tab.label || propertyLabels[tab.labelEntityId] || tab.labelEntityId || 'Tab' }}
                  </cdx-button>
               </div>
               
               <div v-if="activeConfig.tabs[activeTab]">
                  <div v-for="prop in getActiveTabFields" :key="prop" style="margin-bottom:15px;">
                     <strong>{{ propertyLabels[prop] || prop }}</strong>
                     
                     <!-- Render claims -->
                     <ul style="list-style-type:none; padding:0; margin-top:5px;">
                       <li v-for="(claim, cIdx) in (entityClaims[prop] || [])" :key="cIdx" style="display:flex; gap:10px; margin-bottom:5px;">
                         
                         <!-- String Input -->
                         <cdx-text-input 
                            v-if="claim.mainsnak.datatype === 'string' || claim.mainsnak.datatype === 'monolingualtext'"
                            v-model="claim.mainsnak.datavalue.value" 
                            style="flex-grow:1" 
                         />
                         
                         <!-- Item/Entity (Lookup) -->
                         <div v-else-if="claim.mainsnak.datatype === 'wikibase-item'" style="display: flex; flex-direction: column; flex-grow:1;">
                           <entity-lookup 
                              v-model="claim.mainsnak.datavalue.value.id" 
                           />
                         </div>

                         <!-- Time -->
                         <cdx-text-input 
                            v-else-if="claim.mainsnak.datatype === 'time'"
                            v-model="claim.mainsnak.datavalue.value.time" 
                            style="flex-grow:1" 
                         />
                         
                         <cdx-text-input 
                            v-else
                            disabled
                            :value="JSON.stringify(claim.mainsnak.datavalue.value)" 
                            style="flex-grow:1" 
                         />
                         
                         <cdx-button weight="quiet" action="destructive" @click="removeClaim(prop, cIdx)">Remove</cdx-button>
                       </li>
                     </ul>

                     <!-- Add new claim button -->
                     <cdx-button size="small" weight="quiet" @click="addClaim(prop)">+ Add Value</cdx-button>
                  </div>
               </div>

               <cdx-message v-if="successMessage" type="success" style="margin-top:20px;">
                 {{ successMessage }}
               </cdx-message>
               <cdx-message v-if="errorMessage" type="error" style="margin-top:20px;">
                 {{ errorMessage }}
               </cdx-message>
            </div>
            <div v-else>
               <cdx-message type="error">Could not fetch data for this item (No Q-ID linked?).</cdx-message>
            </div>
          </cdx-dialog>
        </div>
      `,
            components: {
                CdxDialog,
                CdxButton,
                CdxTextInput,
                CdxMessage,
                CdxLookup,
                EntityLookup
            },
            setup() {
                const isDialogOpen = ref(false);
                const activeConfig = ref(null);
                const activeTab = ref(0);

                const loading = ref(false);
                const entityData = ref(null);
                const entityClaims = ref({});
                const originalClaimsJson = ref('');
                const propertyLabels = ref({});

                const successMessage = ref('');
                const errorMessage = ref('');

                const wdApi = new mw.ForeignApi('https://www.wikidata.org/w/api.php');

                const getActiveTabFields = computed(() => {
                    if (!activeConfig.value) return [];
                    const tab = activeConfig.value.tabs[activeTab.value];
                    if (!tab) return [];
                    let props = [];
                    if (tab.fields) {
                        tab.fields.forEach(f => props.push(f.property));
                    }
                    if (tab.fieldsets) {
                        tab.fieldsets.forEach(fs => {
                            if (fs.fields) {
                                fs.fields.forEach(f => props.push(f.property));
                            }
                        });
                    }
                    return props;
                });

                const primaryAction = {
                    label: 'Save Changes',
                    actionType: 'progressive'
                };

                const defaultAction = {
                    label: 'Cancel'
                };

                const openDialog = async (config) => {
                    activeConfig.value = config;
                    activeTab.value = 0;
                    isDialogOpen.value = true;
                    successMessage.value = '';
                    errorMessage.value = '';
                    await loadWikidataItem();
                    await fetchPropertyLabels(config);
                };

                const getQIdFromArticle = () => {
                    return mw.config.get('wgWikibaseItemId');
                };

                const fetchPropertyLabels = async (config) => {
                    const props = new Set();
                    config.tabs.forEach(tab => {
                        if (tab.labelEntityId) {
                            props.add(tab.labelEntityId);
                        }
                        if (tab.fields) {
                            tab.fields.forEach(f => props.add(f.property));
                        }
                        if (tab.fieldsets) {
                            tab.fieldsets.forEach(fs => {
                                if (fs.fields) fs.fields.forEach(f => props.add(f.property));
                            });
                        }
                    });

                    // Add entity IDs found in current claims
                    for (const prop in entityClaims.value) {
                        const claims = entityClaims.value[prop];
                        for (const claim of claims) {
                            if (claim && claim.mainsnak && claim.mainsnak.datatype === 'wikibase-item' && claim.mainsnak.datavalue && claim.mainsnak.datavalue.value) {
                                props.add(claim.mainsnak.datavalue.value.id);
                            }
                        }
                    }

                    const propArray = Array.from(props);

                    if (propArray.length === 0) return;

                    const labels = {};
                    const chunkSize = 50;

                    for (let i = 0; i < propArray.length; i += chunkSize) {
                        const chunk = propArray.slice(i, i + chunkSize);
                        try {
                            const data = await wdApi.get({
                                action: 'wbgetentities',
                                ids: chunk.join('|'),
                                props: 'labels',
                                languages: mw.config.get('wgUserLanguage') || 'en',
                                format: 'json'
                            });

                            if (data && data.entities) {
                                for (let prop in data.entities) {
                                    const entity = data.entities[prop];
                                    if (entity && entity.labels) {
                                        const lang = mw.config.get('wgUserLanguage') || 'en';
                                        labels[prop] = entity.labels[lang] ? entity.labels[lang].value : prop;
                                    }
                                }
                            }
                        } catch (e) {
                            console.error("Error fetching labels chunk", e);
                        }
                    }
                    propertyLabels.value = labels;
                };

                const loadWikidataItem = async () => {
                    loading.value = true;
                    entityData.value = null;
                    entityClaims.value = {};

                    const qid = getQIdFromArticle();
                    if (!qid) {
                        loading.value = false;
                        return; // No Wikidata item for this page
                    }

                    try {
                        const data = await wdApi.get({
                            action: 'wbgetentities',
                            ids: qid,
                            format: 'json'
                        });

                        if (data && data.entities && data.entities[qid]) {
                            entityData.value = data.entities[qid];
                            // Clone the claims so we can edit them
                            entityClaims.value = JSON.parse(JSON.stringify(data.entities[qid].claims || {}));
                            originalClaimsJson.value = JSON.stringify(entityClaims.value);
                        }
                    } catch (e) {
                        console.error('Failed to get Wikidata item', e);
                        errorMessage.value = 'Failed to load data from Wikidata.';
                    } finally {
                        loading.value = false;
                    }
                };

                const addClaim = (prop) => {
                    if (!entityClaims.value[prop]) {
                        entityClaims.value[prop] = [];
                    }
                    // determine datatype based on property config if possible. For now fallback.
                    // Ideally we fetch datatype from the property entity
                    entityClaims.value[prop].push({
                        mainsnak: {
                            snaktype: "value",
                            property: prop,
                            datatype: "string", // Placeholder, a real implementation needs to map properties to datatypes
                            datavalue: {
                                type: "string",
                                value: ""
                            }
                        },
                        type: "statement",
                        rank: "normal"
                    });
                };

                const removeClaim = (prop, index) => {
                    entityClaims.value[prop].splice(index, 1);
                };

                const saveData = async () => {
                    const qid = getQIdFromArticle();
                    if (!qid) return;

                    successMessage.value = '';
                    errorMessage.value = '';
                    loading.value = true;

                    try {
                        const originalClaims = JSON.parse(originalClaimsJson.value);
                        const currentClaims = entityClaims.value;
                        const modifiedClaims = {};
                        let hasChanges = false;

                        // Diff local state against remote Wikidata item
                        for (const prop in currentClaims) {
                            if (JSON.stringify(currentClaims[prop]) !== JSON.stringify(originalClaims[prop])) {
                                modifiedClaims[prop] = currentClaims[prop];
                                hasChanges = true;
                            }
                        }

                        if (!hasChanges) {
                            successMessage.value = 'No changes made. Everything is up to date.';
                            setTimeout(() => { isDialogOpen.value = false; }, 1500);
                            return;
                        }

                        const dataParam = JSON.stringify({
                            claims: modifiedClaims
                        });

                        await wdApi.postWithToken('csrf', {
                            action: 'wbeditentity',
                            id: qid,
                            data: dataParam,
                            summary: 'Edit claims via Codex WEF',
                            baserevid: entityData.value.lastrevid
                        });

                        successMessage.value = 'Claims successfully saved to Wikidata.';
                        setTimeout(() => {
                            isDialogOpen.value = false;
                        }, 2000);
                    } catch (e) {
                        errorMessage.value = 'Error saving to Wikidata: ' + e.message;
                    } finally {
                        loading.value = false;
                    }
                };

                return {
                    editorConfigs,
                    isDialogOpen,
                    activeConfig,
                    activeTab,
                    openDialog,
                    primaryAction,
                    defaultAction,
                    saveData,
                    loading,
                    entityData,
                    entityClaims,
                    propertyLabels,
                    successMessage,
                    errorMessage,
                    addClaim,
                    removeClaim,
                    getActiveTabFields
                };
            }
        };

        // Mount logic
        function mountVueApp() {
            // Only run on non-special pages with a wikibase item
            if (mw.config.get('wgNamespaceNumber') >= 0 && mw.config.get('wgWikibaseItemId')) {

                const toolsGroup = document.getElementById('p-tb');
                if (!toolsGroup) return;

                const wefContainer = document.createElement('div');
                wefContainer.id = 'we-framework-codex-app';

                // Insert into DOM gracefully
                if (toolsGroup.parentElement) {
                    const navWrap = document.createElement('div');
                    navWrap.className = 'vector-menu vector-menu-portal portal';
                    const header = document.createElement('h3');
                    header.textContent = 'WE-Framework (Codex)';
                    header.className = 'vector-menu-heading';
                    navWrap.appendChild(header);

                    const content = document.createElement('div');
                    content.className = 'vector-menu-content';
                    content.appendChild(wefContainer);
                    navWrap.appendChild(content);

                    toolsGroup.parentElement.insertBefore(navWrap, toolsGroup.nextSibling);

                    const app = createApp(App);
                    app.mount('#we-framework-codex-app');
                }
            }
        }

        $(document).ready(mountVueApp);
    });
})();
