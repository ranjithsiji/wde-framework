/**
 * WikidataEditor — Wikipedia User Script
 * ==========================================
 * Config-driven Wikidata property editor.
 *
 * TABLE COLUMNS:  Property (label + PID in brackets, linked)  |  Value  |  Status
 *
 * CONFIG:
 *   The script uses the embedded RAW_CONFIG by default.
 *   To load config from a wiki page instead, set this variable in your
 *   common.js BEFORE loading this script:
 *
 *       var WDE_CONFIG_PAGE = 'User:YourName/wikidata-editor-config.json';
 *       mw.loader.load('//en.wikipedia.org/w/index.php?title=User:YourName/wikidata-editor.js&action=raw&ctype=text/javascript');
 *
 *   If WDE_CONFIG_PAGE is set, it takes priority over the embedded config.
 *   The page must contain valid JSON in the same format as configs.json.
 *
 * Shortcut: Alt+Shift+E
 */
/* global mediaWiki, jQuery */
(function (mw, $) {
    'use strict';
    if (!mw || !$) return;

    // ─────────────────────────────────────────────────────────────────
    //  EMBEDDED CONFIG  (fallback — used when WDE_CONFIG_PAGE is not set)
    // ─────────────────────────────────────────────────────────────────
    const RAW_CONFIG = { "AdmEntity": { "id": "AdmEntity", "linkText": "AdmEntity", "description": "Administrative entities: countries, states, cities", "dialogTitle": "Administrative entity \u2014 WE-Framework", "newEntityInstanceOf": "Q486972", "recommendedClasses": ["Q486972", "Q1048835"], "tabs": [{ "label": "general", "specials": [{ "type": "LabelsAndDescriptionArea" }], "fields": [{ "property": "P31" }, { "property": "P131" }, { "property": "P361" }, { "property": "P17" }, { "property": "P1336" }], "fieldsets": [{ "labelEntityId": "P1448", "fields": [{ "property": "P1448" }] }, { "fields": [{ "property": "P37" }, { "property": "P38" }, { "property": "P856" }] }] }, { "label": "Media", "fieldsets": [{ "labelEntityId": "Q14660", "fields": [{ "property": "P163" }, { "property": "P41" }] }, { "labelEntityId": "Q14659", "fields": [{ "property": "P237" }, { "property": "P94" }] }], "fields": [{ "property": "P18" }, { "property": "P85" }, { "property": "P242" }, { "property": "P373" }] }, { "labelEntityId": "Q309", "fieldsets": [{ "fields": [{ "property": "P571" }, { "property": "P1365" }, { "property": "P1366" }] }, { "labelEntityId": "P138", "fields": [{ "property": "P138" }] }, { "labelEntityId": "P793", "fields": [{ "property": "P793" }] }] }, { "labelEntityId": "Q1071", "fieldsets": [{ "fields": [{ "property": "P625" }, { "property": "P242" }, { "property": "P30" }, { "property": "P206" }, { "property": "P2046" }, { "property": "P2044" }, { "property": "P610" }] }, { "fields": [{ "property": "P36" }, { "property": "P1376" }, { "property": "P421" }] }, { "labelEntityId": "P47", "fields": [{ "property": "P47" }] }] }, { "labelEntityId": "Q7163", "fieldsets": [{ "fields": [{ "property": "P122" }, { "property": "P194" }, { "property": "P209" }, { "property": "P6" }, { "property": "P1313" }, { "property": "P1304" }] }] }, { "labelEntityId": "P527", "fieldsets": [{ "fields": [{ "property": "P150" }] }] }, { "labelEntityId": "Q37732", "fieldsets": [{ "fields": [{ "property": "P1125" }, { "property": "P1082" }] }] }, { "labelEntityId": "P190", "fieldsets": [{ "fields": [{ "property": "P190" }] }] }, { "labelEntityId": "P463", "fieldsets": [{ "fields": [{ "property": "P463" }] }] }, { "labelEntityId": "Q4167836", "fieldsets": [{ "fields": [{ "property": "P910" }, { "property": "P1464" }, { "property": "P1465" }, { "property": "P1791" }, { "property": "P1792" }] }] }, { "labelEntityId": "Q853614", "fieldsets": [{ "fields": [{ "property": "P281" }, { "property": "P395" }, { "property": "P473" }] }, { "labelEntityId": "Q106487", "fields": [{ "property": "P297" }, { "property": "P298" }, { "property": "P299" }, { "property": "P300" }, { "property": "P773" }] }] }, { "labelEntityId": "Q36524", "specials": [{ "type": "SparqlPropertyGroup", "sparql": "SELECT DISTINCT ?property WHERE { ?property wdt:P31/wdt:P279* wd:Q55977691 . {?property wikibase:propertyType wikibase:ExternalId} UNION {?property wikibase:propertyType wikibase:String} . }" }] }] }, "Article": { "id": "Article", "linkText": "Article", "description": "Scientific and newspapers articles", "dialogTitle": "Scientific or newspaper article \u2014 WE-Framework", "newEntityInstanceOf": "Q191067", "recommendedClasses": ["Q191067"], "tabs": [{ "label": "general", "specials": [{ "type": "LabelsAndDescriptionArea" }], "fieldsets": [{ "fields": [{ "property": "P31" }] }, { "fields": [{ "property": "P50" }, { "property": "P767" }] }, { "fields": [{ "property": "P1476" }, { "property": "P1680" }, { "property": "P407" }, { "property": "P571" }, { "property": "P921" }] }, { "fields": [{ "property": "P1433" }, { "property": "P953" }] }] }, { "labelEntityId": "Q36524", "specials": [{ "type": "SparqlPropertyGroup", "sparql": "SELECT DISTINCT ?property WHERE { ?property wdt:P31/wdt:P279* wd:Q29548341 . ?property wikibase:propertyType wikibase:ExternalId . }" }] }] }, "Award": { "id": "Award", "linkText": "Award", "description": "Awards", "dialogTitle": "Scientific or newspaper article \u2014 WE-Framework", "newEntityInstanceOf": "Q618779", "recommendedClasses": ["Q4189293", "Q618779"], "tabs": [{ "label": "general", "specials": [{ "type": "LabelsAndDescriptionArea" }], "fieldsets": [{ "fields": [{ "property": "P31" }, { "property": "P279" }, { "property": "P361" }] }, { "fields": [{ "property": "P1705" }, { "property": "P17" }, { "property": "P571" }, { "property": "P3729" }, { "property": "P3730" }] }, { "fields": [{ "property": "P1451" }, { "property": "P18" }, { "property": "P2425" }, { "property": "P2910" }, { "property": "P1114" }] }] }, { "labelEntityId": "P527", "fields": [{ "property": "P527" }] }, { "labelEntityId": "Q3568028", "fields": [{ "property": "P373" }, { "property": "P1424" }, { "property": "P2517" }] }, { "labelEntityId": "P1343", "fields": [{ "property": "P1343" }] }] }, "Book": { "id": "Book", "linkText": "Book / Journal", "description": "Printed and electronic books and journals", "dialogTitle": "Book or journal \u2014 WE-Framework", "newEntityInstanceOf": "Q571", "recommendedClasses": ["Q571", "Q41298"], "tabs": [{ "label": "general", "specials": [{ "type": "LabelsAndDescriptionArea" }], "fieldsets": [{ "fields": [{ "property": "P31" }, { "property": "P1476" }, { "property": "P1680" }, { "property": "P1160" }, { "property": "P407" }, { "property": "P571" }, { "property": "P393" }] }, { "fields": [{ "property": "P50" }, { "property": "P767" }, { "property": "P98" }, { "property": "P110" }, { "property": "P655" }] }, { "fields": [{ "property": "P361" }, { "property": "P478" }, { "property": "P433" }, { "property": "P1104" }] }] }, { "label": "general", "fieldsets": [{ "fields": [{ "property": "P291" }, { "property": "P123" }, { "property": "P577" }, { "property": "P872" }] }, { "fields": [{ "property": "P953" }, { "property": "P996" }, { "property": "P1957" }] }] }, { "labelEntityId": "Q36524", "specials": [{ "type": "SparqlPropertyGroup", "sparql": "SELECT DISTINCT ?property WHERE { ?property wdt:P31/wdt:P279* wd:Q29547399 . ?property wikibase:propertyType wikibase:ExternalId . }" }] }] }, "Entity": { "id": "Entity", "linkText": "Entity", "description": "Generic and simple editor", "dialogTitle": "Entity \u2014 WE-Framework", "newEntityInstanceOf": "Q35120", "tabs": [{ "label": "general", "specials": [{ "type": "LabelsAndDescriptionArea" }], "fields": [{ "property": "P31" }, { "property": "P279" }] }, { "labelEntityId": "P1343", "fields": [{ "property": "P1343" }] }] }, "ExternalLinks": { "id": "ExternalLinks", "linkText": "External IDs", "description": "External IDs and authoritative control", "dialogTitle": "External IDs and links \u2014 WE-Framework", "tabs": [{ "labelEntityId": "Q6576792", "specials": [{ "type": "SparqlPropertyGroup", "sparql": "SELECT DISTINCT ?property WHERE { ?property wdt:P31/wdt:P279* wd:Q30041186 . ?property wikibase:propertyType wikibase:ExternalId . }" }] }, { "labelEntityId": "Q1415395", "specials": [{ "type": "SparqlPropertyGroup", "sparql": "SELECT DISTINCT ?property WHERE { ?property wdt:P31/wdt:P279* wd:Q22964274 . ?property wikibase:propertyType wikibase:ExternalId . }" }] }, { "labelEntityId": "Q47307", "specials": [{ "type": "SparqlPropertyGroup", "sparql": "SELECT DISTINCT ?property WHERE { ?property wdt:P31/wdt:P279* wd:Q56249073 . ?property wikibase:propertyType wikibase:ExternalId . }" }] }, { "labelEntityId": "Q638", "specials": [{ "type": "SparqlPropertyGroup", "sparql": "SELECT DISTINCT ?property WHERE { ?property wdt:P31/wdt:P279* wd:Q27525351 . ?property wikibase:propertyType wikibase:ExternalId . }" }] }, { "labelEntityId": "Q7991", "specials": [{ "type": "SparqlPropertyGroup", "sparql": "SELECT DISTINCT ?property WHERE { ?property wdt:P31/wdt:P279* wd:Q52425722 . ?property wikibase:propertyType wikibase:ExternalId . }" }] }, { "labelEntityId": "Q7163", "specials": [{ "type": "SparqlPropertyGroup", "sparql": "SELECT DISTINCT ?property WHERE { ?property wdt:P31/wdt:P279* wd:Q22984475 . ?property wikibase:propertyType wikibase:ExternalId . }" }] }, { "labelEntityId": "Q349", "specials": [{ "type": "SparqlPropertyGroup", "sparql": "SELECT DISTINCT ?property WHERE { ?property wdt:P31/wdt:P279* wd:Q21818626 . ?property wikibase:propertyType wikibase:ExternalId . }" }] }, { "labelEntityId": "Q7889", "specials": [{ "type": "SparqlPropertyGroup", "sparql": "SELECT DISTINCT ?property WHERE { ?property wdt:P31/wdt:P279* wd:Q28147643 . ?property wikibase:propertyType wikibase:ExternalId . }" }] }, { "labelEntityId": "Q5292", "specials": [{ "type": "SparqlPropertyGroup", "sparql": "SELECT DISTINCT ?property WHERE { ?property wdt:P31/wdt:P279* wd:Q55452870 . ?property wikibase:propertyType wikibase:ExternalId . }" }] }, { "labelEntityId": "Q54919", "fields": [{ "property": "P214" }], "specials": [{ "type": "SparqlPropertyGroup", "sparql": "SELECT DISTINCT ?property WHERE { ?property wdt:P31/wdt:P279* wd:Q55586529 . ?property wikibase:propertyType wikibase:ExternalId . }" }] }, { "labelEntityId": "Q36524", "specials": [{ "type": "SparqlPropertyGroup", "sparql": "SELECT DISTINCT ?property WHERE {  ?property wdt:P31/wdt:P279* wd:Q18614948 .  ?property wikibase:propertyType wikibase:ExternalId .  MINUS { ?property wdt:P31 wd:Q30041186 } .  MINUS { ?property wdt:P31/wdt:P279* wd:Q22964274 } .  MINUS { ?property wdt:P31/wdt:P279* wd:Q56249073 } .  MINUS { ?property wdt:P31/wdt:P279* wd:Q27525351 } .  MINUS { ?property wdt:P31/wdt:P279* wd:Q22984475 } .  MINUS { ?property wdt:P31/wdt:P279* wd:Q21818626 } .  MINUS { ?property wdt:P31/wdt:P279* wd:Q52425722 } .  MINUS { ?property wdt:P31/wdt:P279* wd:Q28147643 } .  MINUS { ?property wdt:P31/wdt:P279* wd:Q55452870 } .  MINUS { ?property wdt:P31/wdt:P279* wd:Q55586529 } . }" }] }] }, "FrbrEdition": { "id": "FrbrEdition", "linkText": "FRBR Edition", "dialogTitle": "FRBR Edition data \u2014 WE-Framework", "newEntityInstanceOf": "Q3331189", "recommendedClasses": ["Q3331189"], "tabs": [{ "label": "general", "specials": [{ "type": "LabelsAndDescriptionArea" }], "fieldsets": [{ "fields": [{ "property": "P31" }, { "property": "P18" }] }, { "fields": [{ "property": "P629" }, { "property": "P393" }, { "property": "P291" }, { "property": "P123" }, { "property": "P577" }, { "property": "P872" }] }, { "fields": [{ "property": "P407" }, { "property": "P1476" }, { "property": "P1680" }] }, { "fields": [{ "property": "P361" }, { "property": "P1433" }, { "property": "P155" }, { "property": "P156" }] }] }, { "labelEntityId": "Q1260632", "fieldsets": [{ "fields": [{ "property": "P50" }, { "property": "P655" }, { "property": "P98" }, { "property": "P110" }, { "property": "P767" }] }, { "fields": [{ "property": "P1104" }, { "property": "P1922" }, { "property": "P996" }, { "property": "P953" }] }] }, { "labelEntityId": "Q36524", "specials": [{ "type": "SparqlPropertyGroup", "sparql": "SELECT DISTINCT ?property WHERE { ?property wdt:P31 wd:Q29547399 . ?property wikibase:propertyType wikibase:ExternalId . }" }] }] }, "FrbrWork": { "id": "FrbrWork", "linkText": "FRBR Work", "dialogTitle": "FRBR Work data \u2014 WE-Framework", "newEntityInstanceOf": "Q386724", "recommendedClasses": ["Q386724"], "tabs": [{ "label": "general", "specials": [{ "type": "LabelsAndDescriptionArea" }], "fieldsets": [{ "fields": [{ "property": "P31" }, { "property": "P18" }] }, { "fields": [{ "property": "P50" }, { "property": "P767" }, { "property": "P98" }] }, { "fields": [{ "property": "P1476" }, { "property": "P1680" }, { "property": "P407" }, { "property": "P571" }, { "property": "P577" }] }] }, { "labelEntityId": "Q1260632", "fieldsets": [{ "fields": [{ "property": "P135" }, { "property": "P136" }, { "property": "P921" }, { "property": "P1922" }] }, { "fields": [{ "property": "P155" }, { "property": "P156" }, { "property": "P179" }] }, { "fields": [{ "property": "P144" }, { "property": "P941" }] }] }, { "labelEntityId": "P674", "fieldsets": [{ "labelEntityId": "P674", "fields": [{ "property": "P674" }] }] }, { "labelEntityId": "P166", "fieldsets": [{ "labelEntityId": "P166", "fields": [{ "property": "P166" }] }] }, { "labelEntityId": "P747", "fieldsets": [{ "labelEntityId": "P747", "fields": [{ "property": "P747" }] }] }, { "labelEntityId": "Q36524", "specials": [{ "type": "SparqlPropertyGroup", "sparql": "SELECT DISTINCT ?property WHERE { ?property wdt:P31 wd:Q19833377 . ?property wikibase:propertyType wikibase:ExternalId . }" }] }] }, "LegalInstrument": { "id": "LegalInstrument", "linkText": "Legal Act", "description": "Legal Instrument: executive orders, laws, court acts, etc.", "dialogTitle": "Legal Instrument \u2014 WE-Framework", "newEntityInstanceOf": "Q1428955", "recommendedClasses": ["Q1428955"], "tabs": [{ "label": "general", "specials": [{ "type": "LabelsAndDescriptionArea" }], "fieldsets": [{ "fields": [{ "property": "P31" }, { "property": "P1476" }, { "property": "P1680" }, { "property": "P571" }, { "property": "P1545" }, { "property": "P407" }, { "property": "P577" }] }, { "fields": [{ "property": "P50" }, { "property": "P767" }, { "property": "P98" }] }, { "fields": [{ "property": "P155" }, { "property": "P156" }] }, { "fields": [{ "property": "P1433" }, { "property": "P996" }, { "property": "P953" }] }] }] }, "Movie": { "id": "Movie", "linkText": "Movie", "description": "Animations and movies", "dialogTitle": "Animation and Movie  \u2014 WE-Framework", "newEntityInstanceOf": "Q11424", "recommendedClasses": ["Q2431196"], "tabs": [{ "label": "general", "specials": [{ "type": "LabelsAndDescriptionArea" }], "fields": [{ "property": "P31" }, { "property": "P18" }, { "property": "P1476" }, { "property": "P495" }, { "property": "P364" }, { "property": "P577" }, { "property": "P915" }, { "property": "P2130" }, { "property": "P2142" }, { "property": "P449" }, { "property": "P856" }, { "property": "P373" }] }, { "labelEntityId": "Q1260632", "fields": [{ "property": "P136" }, { "property": "P144" }, { "property": "P2061" }, { "property": "P2047" }, { "property": "P155" }, { "property": "P156" }, { "property": "P1811" }, { "property": "P1113" }, { "property": "P2437" }] }, { "labelEntityId": "Q3297652", "fields": [{ "property": "P170" }, { "property": "P57" }, { "property": "P344" }, { "property": "P58" }, { "property": "P162" }, { "property": "P1431" }, { "property": "P86" }, { "property": "P1809" }, { "property": "P272" }, { "property": "P750" }] }, { "labelEntityId": "P161", "fields": [{ "property": "P161" }, { "property": "P2438" }] }, { "labelEntityId": "P725", "fields": [{ "property": "P725" }] }, { "labelEntityId": "P166", "fields": [{ "property": "P166" }] }, { "labelEntityId": "Q36524", "specials": [{ "type": "SparqlPropertyGroup", "sparql": "SELECT DISTINCT ?property WHERE { ?property wdt:P31 wd:Q29542094 . ?property wikibase:propertyType wikibase:ExternalId . }" }] }] }, "Person": { "id": "Person", "linkText": "Person", "dialogTitle": "Person data \u2014 WE-Framework", "newEntityInstanceOf": "Q5", "recommendedClasses": ["Q215627"], "tabs": [{ "label": "general", "specials": [{ "type": "LabelsAndDescriptionArea" }], "fieldsets": [{ "fields": [{ "property": "P1559" }, { "property": "P1477" }, { "property": "P742" }, { "property": "P1449" }] }, { "fields": [{ "property": "P53" }, { "property": "P97" }, { "property": "P511" }] }, { "fields": [{ "property": "P31" }, { "property": "P21" }, { "property": "P91" }, { "property": "P27" }, { "property": "P551" }, { "property": "P103" }, { "property": "P1412" }, { "property": "P856" }] }] }, { "label": "birth & death", "fieldsets": [{ "fields": [{ "property": "P569" }, { "property": "P19" }, { "property": "P172" }, { "property": "P103" }] }, { "fields": [{ "property": "P1321" }, { "property": "P66" }] }, { "fields": [{ "property": "P1317" }] }, { "fields": [{ "property": "P1050" }, { "property": "P570" }, { "property": "P20" }, { "property": "P509" }, { "property": "P1196" }, { "property": "P157" }, { "property": "P119" }, { "property": "P535" }] }] }, { "label": "media", "fieldsets": [{ "fields": [{ "property": "P18" }, { "property": "P109" }, { "property": "P990" }, { "property": "P1442" }] }, { "labelEntityId": "P237", "fields": [{ "property": "P94" }, { "property": "P237" }] }, { "fields": [{ "property": "P373" }, { "property": "P1472" }] }] }, { "labelEntityId": "Q8436", "fields": [{ "property": "P22" }, { "property": "P25" }, { "property": "P1290" }, { "property": "P3373" }, { "property": "P26" }, { "property": "P451" }, { "property": "P1971" }, { "property": "P40" }, { "property": "P1038" }, { "property": "P3342" }] }, { "label": "education & science", "fieldsets": [{ "fields": [{ "property": "P1066" }, { "property": "P69" }, { "property": "P184" }, { "property": "P1026" }, { "property": "P512" }, { "property": "P803" }, { "property": "P802" }, { "property": "P185" }] }, { "fields": [{ "property": "P549" }, { "property": "P496" }, { "property": "P864" }, { "property": "P2456" }, { "property": "P1556" }, { "property": "P1960" }, { "property": "P1053" }, { "property": "P1153" }] }, { "fields": [{ "property": "P428" }, { "property": "P835" }] }] }, { "labelEntityId": "Q28640", "fieldsets": [{ "fields": [{ "property": "P106" }, { "property": "P101" }, { "property": "P108" }, { "property": "P263" }] }, { "labelEntityId": "P39", "fields": [{ "property": "P39" }] }, { "labelEntityId": "P463", "fields": [{ "property": "P463" }] }] }, { "labelEntityId": "Q309", "fieldsets": [{ "labelEntityId": "P551", "fields": [{ "property": "P551" }] }, { "labelEntityId": "P7153", "fields": [{ "property": "P7153" }] }, { "labelEntityId": "P793", "fields": [{ "property": "P793" }] }, { "labelEntityId": "P1344", "fields": [{ "property": "P1344" }] }] }, { "labelEntityId": "Q8473", "fields": [{ "property": "P241" }, { "property": "P410" }, { "property": "P598" }, { "property": "P607" }] }, { "labelEntityId": "Q20978643", "fieldsets": [{ "labelEntityId": "P102", "fields": [{ "property": "P102" }] }, { "fields": [{ "property": "P140" }, { "property": "P411" }, { "property": "P841" }] }] }, { "labelEntityId": "Q349", "fields": [{ "property": "P2416" }, { "property": "P54" }, { "property": "P413" }, { "property": "P423" }, { "property": "P741" }, { "property": "P468" }, { "property": "P2415" }], "fieldsets": [{ "fields": [{ "property": "P1317" }, { "property": "P2031" }, { "property": "P2032" }, { "property": "P937" }] }] }, { "labelEntityId": "Q11042", "fields": [{ "property": "P135" }, { "property": "P136" }, { "property": "P412" }, { "property": "P1303" }, { "property": "P800" }, { "property": "P358" }], "fieldsets": [{ "fields": [{ "property": "P1317" }, { "property": "P2031" }, { "property": "P2032" }, { "property": "P937" }] }] }, { "labelEntityId": "P166", "fieldsets": [{ "labelEntityId": "P166", "fields": [{ "property": "P166" }] }] }, { "labelEntityId": "P1830", "fieldsets": [{ "labelEntityId": "P1830", "fields": [{ "property": "P1830" }] }] }, { "labelEntityId": "P1343", "fieldsets": [{ "labelEntityId": "P1343", "fields": [{ "property": "P1343" }] }] }] }, "Software": { "id": "Software", "linkText": "Software", "description": "Software, including games and operation systems", "dialogTitle": "Software \u2014 WE-Framework", "newEntityInstanceOf": "Q7397", "recommendedClasses": ["Q7397"], "tabs": [{ "label": "general", "key": "general", "specials": [{ "type": "LabelsAndDescriptionArea" }], "fieldsets": [{ "fields": [{ "property": "P154" }, { "property": "P18" }, { "property": "P373" }] }, { "fields": [{ "property": "P31" }, { "property": "P112" }, { "property": "P170" }, { "property": "P178" }, { "property": "P275" }, { "property": "P856" }] }, { "fields": [{ "property": "P400" }, { "property": "P306" }, { "property": "P277" }, { "property": "P1414" }, { "property": "P407" }] }] }, { "labelEntityId": "P348", "key": "versions", "fields": [{ "property": "P348" }] }, { "labelEntityId": "Q235557", "key": "fileFormats", "fieldsets": [{ "labelEntityId": "P1072", "fields": [{ "property": "P1072" }] }, { "labelEntityId": "P1073", "fields": [{ "property": "P1073" }] }] }, { "labelEntityId": "Q36524", "key": "authoritycontrol", "fields": [{ "property": "P3381" }, { "property": "P646" }, { "property": "P3417" }, { "property": "P3984" }] }] }, "Taxon": { "id": "Taxon", "linkText": "Taxon", "dialogTitle": "Taxon data \u2014 WE-Framework", "newEntityInstanceOf": "Q16521", "recommendedClasses": ["Q16521"], "tabs": [{ "label": "general", "specials": [{ "type": "LabelsAndDescriptionArea" }], "fieldsets": [{ "fields": [{ "property": "P31" }] }, { "fields": [{ "property": "P225" }, { "property": "P566" }, { "property": "P1403" }, { "property": "P694" }, { "property": "P1420" }, { "property": "P697" }, { "property": "P944" }] }, { "fields": [{ "property": "P18" }] }] }, { "labelEntityId": "Q420", "fieldsets": [{ "fields": [{ "property": "P105" }, { "property": "P171" }] }, { "fields": [{ "property": "P141" }] }, { "fields": [{ "property": "P181" }, { "property": "P183" }, { "property": "P1425" }, { "property": "P523" }, { "property": "P524" }] }] }, { "labelEntityId": "Q36524", "specials": [{ "type": "SparqlPropertyGroup", "sparql": "SELECT DISTINCT ?property WHERE { ?property wdt:P31 wd:Q42396390 . ?property wikibase:propertyType wikibase:ExternalId . }" }] }] }, "TransInfra": { "id": "TransInfra", "linkText": "Trans. Infra", "description": "Transport Infrastructure", "dialogTitle": "Transport Infrastructure \u2014 WE-Framework", "newEntityInstanceOf": "Q376799", "recommendedClasses": ["Q719456"], "tabs": [{ "label": "general", "specials": [{ "type": "LabelsAndDescriptionArea" }], "fields": [{ "property": "P31" }, { "property": "P131" }, { "property": "P931" }, { "property": "P361" }, { "property": "P17" }, { "property": "P421" }, { "property": "P127" }, { "property": "P137" }], "fieldsets": [{ "labelEntityId": "P1448", "fields": [{ "property": "P1448" }] }, { "fields": [{ "property": "P1329" }, { "property": "P856" }] }] }, { "label": "media", "fields": [{ "property": "P154" }, { "property": "P18" }, { "property": "P242" }, { "property": "P15" }, { "property": "P373" }, { "property": "P935" }, { "property": "P948" }] }, { "labelEntityId": "Q309", "fieldsets": [{ "fields": [{ "property": "P571" }, { "property": "P1619" }, { "property": "P84" }, { "property": "P138" }] }, { "labelEntityId": "P793", "fields": [{ "property": "P793" }] }] }, { "labelEntityId": "Q1071", "fieldsets": [{ "fields": [{ "property": "P625" }, { "property": "P242" }, { "property": "P30" }, { "property": "P206" }, { "property": "P610" }, { "property": "P2046" }] }] }, { "labelEntityId": "Q1757562", "fields": [{ "property": "P529" }], "specials": [{ "type": "SparqlPropertyGroup", "sparql": "SELECT DISTINCT ?property WHERE { ?property wdt:P31/wdt:P279* wd:Q61052867 . ?property wikibase:propertyType wikibase:ExternalId. }" }] }, { "labelEntityId": "P527", "fieldsets": [{ "fields": [{ "property": "P527" }] }] }, { "labelEntityId": "Q11369842", "fieldsets": [{ "fields": [{ "property": "P1373" }, { "property": "P3872" }] }] }, { "labelEntityId": "Q36524", "specials": [{ "type": "SparqlPropertyGroup", "sparql": "SELECT DISTINCT ?property WHERE { ?property wdt:P31/wdt:P279* wd:Q22984363 . ?property wikibase:propertyType wikibase:ExternalId. }" }] }] } };

    // ─────────────────────────────────────────────────────────────────
    //  CONFIG PROCESSING
    // ─────────────────────────────────────────────────────────────────

    function extractPids(cfg) {
        const s = new Set();
        (cfg.tabs || []).forEach(tab => {
            (tab.fields || []).forEach(f => s.add(f.property));
            (tab.fieldsets || []).forEach(fs =>
                (fs.fields || []).forEach(f => s.add(f.property))
            );
        });
        return [...s].sort();
    }

    function buildEntityTypes(raw) {
        const out = {};
        Object.entries(raw).forEach(([key, cfg]) => {
            // Merge recommendedClasses + newEntityInstanceOf so that, e.g.,
            // a Person item with P31=Q5 (Human) matches even though
            // recommendedClasses only lists Q215627 (physical person).
            const classes = new Set(cfg.recommendedClasses || []);
            if (cfg.newEntityInstanceOf) classes.add(cfg.newEntityInstanceOf);
            out[key] = {
                id: key,
                label: cfg.dialogTitle || cfg.linkText || key,
                desc: cfg.description || '',
                classes: [...classes],
                pids: extractPids(cfg)
            };
        });
        return out;
    }

    let ENTITY_TYPES = buildEntityTypes(RAW_CONFIG);

    // ─────────────────────────────────────────────────────────────────
    //  RUNTIME CONSTANTS
    // ─────────────────────────────────────────────────────────────────
    const WD_API = 'https://www.wikidata.org/w/api.php';
    const MW_API = mw.util.wikiScript('api');
    const PAGE_QID = mw.config.get('wgWikibaseItemId');
    const PAGE_LANG = mw.config.get('wgUserLanguage') || 'en';
    const IS_LOGGED_IN = !!mw.config.get('wgUserId');

    // ─────────────────────────────────────────────────────────────────
    //  WIKIDATA API HELPERS
    // ─────────────────────────────────────────────────────────────────

    function wdApi(params) {
        return $.ajax({
            url: WD_API,
            data: Object.assign({ format: 'json', origin: '*' }, params),
            dataType: 'json'
        });
    }

    async function fetchEntityFull(qid) {
        const d = await wdApi({
            action: 'wbgetentities',
            ids: qid,
            props: 'labels|descriptions|claims',
            languages: PAGE_LANG + '|en'
        });
        if (d.error) throw new Error(d.error.info);
        const e = d.entities[qid];
        if (!e || e.missing !== undefined) throw new Error(qid + ' not found.');
        return e;
    }

    async function batchLabels(ids) {
        if (!ids.length) return {};
        const out = {};
        for (let i = 0; i < ids.length; i += 50) {
            const d = await wdApi({
                action: 'wbgetentities',
                ids: ids.slice(i, i + 50).join('|'),
                props: 'labels',
                languages: PAGE_LANG + '|en'
            });
            Object.entries(d.entities || {}).forEach(([id, ent]) => {
                out[id] = ((ent.labels || {})[PAGE_LANG] ||
                    (ent.labels || {}).en || { value: id }).value;
            });
        }
        return out;
    }

    // mw.ForeignApi handles Wikimedia Central Auth automatically so
    // postWithToken('csrf') gives a *logged-in* token — same as wef-codex.js.
    const wdForeignApi = new mw.ForeignApi(WD_API);

    async function addClaim(qid, pid, valueObj) {
        const d = await wdForeignApi.postWithToken('csrf', {
            action: 'wbcreateclaim',
            entity: qid,
            property: pid,
            snaktype: 'value',
            value: JSON.stringify(valueObj),
            summary: 'Edit claims via Codex WDE',
            format: 'json'
        });
        if (d.error) throw new Error(d.error.info);
        return d;
    }

    async function editClaim(guid, valueObj) {
        const d = await wdForeignApi.postWithToken('csrf', {
            action: 'wbsetclaimvalue',
            claim: guid,
            snaktype: 'value',
            value: JSON.stringify(valueObj),
            summary: 'Edit claims via Codex WDE',
            format: 'json'
        });
        if (d.error) throw new Error(d.error.info);
        return d;
    }

    async function deleteClaim(guid) {
        const d = await wdForeignApi.postWithToken('csrf', {
            action: 'wbremoveclaims',
            claim: guid,
            summary: 'Remove claim via Codex WDE',
            format: 'json'
        });
        if (d.error) throw new Error(d.error.info);
        return d;
    }

    // ─────────────────────────────────────────────────────────────────
    //  CONFIG FETCH  (called at boot if WDE_CONFIG_PAGE is defined)
    //  Uses the local MediaWiki API — no cross-origin issues.
    // ─────────────────────────────────────────────────────────────────

    async function fetchConfigPage(title) {
        // Build the raw-content URL: /w/index.php?title=<page>&action=raw
        // This is the most reliable way to get plain JSON even for .json subpages.
        const server = mw.config.get('wgServer') || '';
        const script = mw.config.get('wgScript') || '/w/index.php';
        const rawUrl = server + script +
            '?title=' + encodeURIComponent(title) + '&action=raw';

        const text = await $.ajax({
            url: rawUrl,
            dataType: 'text'
        });

        if (!text || !text.trim()) {
            throw new Error('Config page "' + title + '" is empty or does not exist.');
        }
        return JSON.parse(text);
    }

    // ─────────────────────────────────────────────────────────────────
    //  ENTITY TYPE MATCHING
    // ─────────────────────────────────────────────────────────────────

    function matchEntityType(p31Values) {
        const set = new Set(p31Values);
        let best = null, top = 0;
        Object.entries(ENTITY_TYPES).forEach(([key, et]) => {
            const score = et.classes.filter(c => set.has(c)).length;
            if (score > top) { top = score; best = key; }
        });
        return best;
    }

    // ─────────────────────────────────────────────────────────────────
    //  VALUE DISPLAY (read-only)
    // ─────────────────────────────────────────────────────────────────

    function snakHtml(snak, entLabels) {
        if (!snak || snak.snaktype === 'novalue') return '<em class="wde-nv">no value</em>';
        if (snak.snaktype === 'somevalue') return '<em class="wde-nv">unknown</em>';
        const dv = snak.datavalue;
        if (!dv) return '<em class="wde-nv">—</em>';
        switch (dv.type) {
            case 'string':
                if (/^https?:\/\//i.test(dv.value))
                    return '<a class="wde-extlink" href="' + mw.html.escape(dv.value) +
                        '" target="_blank" rel="noopener">' +
                        mw.html.escape(dv.value.length > 60
                            ? dv.value.slice(0, 57) + '…' : dv.value) + '</a>';
                return '<span class="wde-str">' + mw.html.escape(dv.value) + '</span>';
            case 'monolingualtext':
                return '<span class="wde-str">' + mw.html.escape(dv.value.text) +
                    '</span> <span class="wde-meta">[' +
                    mw.html.escape(dv.value.language) + ']</span>';
            case 'quantity':
                return '<span class="wde-num">' +
                    mw.html.escape(dv.value.amount.replace(/^\+/, '')) + '</span>';
            case 'time': {
                const raw = dv.value.time.replace(/^\+/, '');
                const p = dv.value.precision;
                const s = p >= 11 ? raw.slice(0, 10)
                    : p === 10 ? raw.slice(0, 7)
                        : raw.slice(0, 4);
                return '<span class="wde-time">' + mw.html.escape(s) + '</span>';
            }
            case 'globecoordinate':
                return '<span class="wde-geo">' +
                    mw.html.escape(dv.value.latitude.toFixed(4) + ', ' +
                        dv.value.longitude.toFixed(4)) + '</span>';
            case 'wikibase-entityid': {
                const id = dv.value.id || ('Q' + dv.value['numeric-id']);
                const lbl = entLabels[id] || id;
                const path = id.startsWith('P') ? 'Property:' + id : id;
                return '<a class="wde-entlink" href="https://www.wikidata.org/wiki/' +
                    mw.html.escape(path) + '" target="_blank" rel="noopener">' +
                    mw.html.escape(lbl) + '</a>' +
                    ' <span class="wde-meta">' + mw.html.escape(id) + '</span>';
            }
            default:
                return mw.html.escape(JSON.stringify(dv.value).slice(0, 80));
        }
    }

    // ─────────────────────────────────────────────────────────────────
    //  VALUE BUILDER (for wbcreateclaim)
    // ─────────────────────────────────────────────────────────────────

    function buildValueObj(type, raw, lang) {
        const v = raw.trim();
        if (!v) throw new Error('Value cannot be empty.');
        switch (type) {
            case 'string': return v;
            case 'item': {
                const m = v.toUpperCase().match(/^Q(\d+)$/);
                if (!m) throw new Error('Must be a QID like Q42.');
                return { 'entity-type': 'item', 'numeric-id': parseInt(m[1], 10) };
            }
            case 'time': {
                let time, precision;
                if (/^\d{4}$/.test(v)) { time = '+' + v + '-01-01T00:00:00Z'; precision = 9; }
                else if (/^\d{4}-\d{2}$/.test(v)) { time = '+' + v + '-01T00:00:00Z'; precision = 10; }
                else if (/^\d{4}-\d{2}-\d{2}$/.test(v)) { time = '+' + v + 'T00:00:00Z'; precision = 11; }
                else throw new Error('Date must be YYYY, YYYY-MM or YYYY-MM-DD.');
                return {
                    time, timezone: 0, before: 0, after: 0, precision,
                    calendarmodel: 'http://www.wikidata.org/entity/Q1985727'
                };
            }
            case 'quantity':
                if (isNaN(parseFloat(v))) throw new Error('Must be a number.');
                return { amount: (parseFloat(v) >= 0 ? '+' : '') + v, unit: '1' };
            case 'monolingual': {
                const l = (lang || '').trim() || PAGE_LANG;
                if (!l) throw new Error('Language code required.');
                return { text: v, language: l };
            }
            default: return v;
        }
    }

    // ─────────────────────────────────────────────────────────────────
    //  TABLE ROW:  Property (label + (PID))  |  Value  |  Status
    // ─────────────────────────────────────────────────────────────────

    function propRowHtml(pid, propLabel, claimList, entLabels, qid) {
        const has = claimList && claimList.length > 0;
        const sCls = has ? 'wde-present' : 'wde-missing';
        const sLbl = has ? 'Present' : 'Missing';

        // Property cell — bold label, then (PID) as a linked monospace annotation
        const propCell =
            '<td class="wde-cell wde-col-prop">' +
            '<span class="wde-prop-name">' + mw.html.escape(propLabel) + '</span>' +
            ' <span class="wde-prop-pid">(<a class="wde-pid-link"' +
            ' href="https://www.wikidata.org/wiki/Property:' + pid +
            '" target="_blank" rel="noopener">' + pid + '</a>)</span>' +
            '</td>';

        // Value cell
        let valInner;
        if (has) {
            const items = claimList.slice(0, 6).map(c => {
                const snak = c.mainsnak;
                const dv = snak.datavalue || {};
                // Encode enough info for edit form to pre-populate itself
                const dtype = dv.type || 'string';
                let rawVal = '', rawLang = '';
                if (dtype === 'string') { rawVal = dv.value || ''; }
                else if (dtype === 'wikibase-entityid') {
                    rawVal = dv.value ? (dv.value.id || ('Q' + dv.value['numeric-id'])) : '';
                } else if (dtype === 'time') {
                    const t = (dv.value && dv.value.time) ? dv.value.time.replace(/^\+/, '') : '';
                    const p = dv.value ? dv.value.precision : 11;
                    rawVal = p >= 11 ? t.slice(0, 10) : p === 10 ? t.slice(0, 7) : t.slice(0, 4);
                } else if (dtype === 'quantity') { rawVal = dv.value ? dv.value.amount.replace(/^\+/, '') : ''; }
                else if (dtype === 'monolingualtext') {
                    rawVal = dv.value ? dv.value.text : '';
                    rawLang = dv.value ? dv.value.language : '';
                } else { rawVal = JSON.stringify(dv.value || ''); }

                const editBtns = IS_LOGGED_IN
                    ? ' <button class="wde-editbtn" title="Edit this value"' +
                    ' data-guid="' + mw.html.escape(c.id || '') + '"' +
                    ' data-dtype="' + mw.html.escape(dtype) + '"' +
                    ' data-raw="' + mw.html.escape(rawVal) + '"' +
                    ' data-lang="' + mw.html.escape(rawLang) + '">✎</button>' +
                    ' <button class="wde-delbtn" title="Delete this value"' +
                    ' data-guid="' + mw.html.escape(c.id || '') + '">✕</button>'
                    : '';
                return '<li data-guid="' + mw.html.escape(c.id || '') + '">' +
                    snakHtml(snak, entLabels) + editBtns + '</li>';
            }).join('');
            const more = claimList.length > 6
                ? '<li class="wde-overflow">+' + (claimList.length - 6) + ' more…</li>' : '';
            valInner = '<ul class="wde-vlist">' + items + more + '</ul>';
        } else {
            valInner = '<span class="wde-empty">—</span>';
        }
        const addBtn = IS_LOGGED_IN
            ? '<button class="wde-addbtn cdx-button cdx-button--weight-normal"' +
            ' data-pid="' + mw.html.escape(pid) + '"' +
            ' data-qid="' + mw.html.escape(qid) + '">' +
            (has ? '+ Add another' : '+ Add value') + '</button>'
            : '<span class="wde-loginnote">Log in to edit</span>';
        const valCell =
            '<td class="wde-cell wde-col-val">' +
            '<div class="wde-val-display">' + valInner + '</div>' +
            '<div class="wde-val-action">' + addBtn + '</div>' +
            '<div class="wde-val-form"></div>' +
            '</td>';

        // Status cell
        const statusCell =
            '<td class="wde-cell wde-col-status">' +
            '<span class="wde-status-chip ' + sCls + '">' + sLbl + '</span>' +
            '</td>';

        return '<tr class="wde-row" data-pid="' + mw.html.escape(pid) + '">' +
            propCell + valCell + statusCell + '</tr>';
    }

    // ─────────────────────────────────────────────────────────────────
    //  INLINE ADD-VALUE FORM
    // ─────────────────────────────────────────────────────────────────

    function addFormHtml(pid) {
        return '<div class="wde-form" data-pid="' + mw.html.escape(pid) + '">' +
            // Row 1: type selector + optional lang input
            '<div class="wde-form-row wde-form-row-type">' +
            '<select class="wde-type-sel cdx-select" aria-label="Value type">' +
            '<option value="string">String / ID</option>' +
            '<option value="item">Wikidata item</option>' +
            '<option value="time">Date (YYYY / YYYY-MM / YYYY-MM-DD)</option>' +
            '<option value="quantity">Quantity</option>' +
            '<option value="monolingual">Monolingual text</option>' +
            '</select>' +
            '<input class="wde-lang-input cdx-text-input__input wde-hidden" type="text"' +
            ' placeholder="Language code e.g. en" maxlength="10" />' +
            '</div>' +
            // Row 2: value input + action buttons
            '<div class="wde-form-row wde-form-row-val">' +
            '<div class="wde-ac-wrap">' +
            '<input class="wde-val-input cdx-text-input__input" type="text"' +
            ' placeholder="Enter value\u2026" autocomplete="off" />' +
            '<div class="wde-ac-drop" hidden></div>' +
            '</div>' +
            '<button class="wde-save-btn cdx-button cdx-button--action-progressive' +
            ' cdx-button--weight-primary">Save</button>' +
            '<button class="wde-cancel-btn cdx-button cdx-button--weight-quiet">Cancel</button>' +
            '</div>' +
            '<div class="wde-form-msg" hidden></div>' +
            '</div>';
    }

    // ─────────────────────────────────────────────────────────────────
    //  MAIN DIALOG
    // ─────────────────────────────────────────────────────────────────

    function buildDialog() {
        const html = [
            '<div id="wde-overlay" role="dialog" aria-modal="true" aria-labelledby="wde-title">',
            '<div id="wde-dialog">',

            // ── Header ──────────────────────────────────────────────
            '<div id="wde-header">',
            '<span class="wde-logo" aria-hidden="true">',
            '<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">',
            '<path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75z"/>',
            '<path d="M20.71 7.04a1 1 0 0 0 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0',
            'l-1.84 1.83 3.75 3.75 1.84-1.83z"/>',
            '</svg>',
            '</span>',
            '<div class="wde-htxt">',
            '<h2 id="wde-title">Wikidata Editor</h2>',
            '<span id="wde-subtitle" class="wde-subtitle"></span>',
            '</div>',
            '<div class="wde-htools">',
            '<span id="wde-qid-chip"  class="wde-chip"          hidden></span>',
            '<span id="wde-type-chip" class="wde-chip wde-chip-type" hidden></span>',
            '<button id="wde-close" class="cdx-button cdx-button--weight-quiet" aria-label="Close">',
            '<svg viewBox="0 0 20 20" width="14" height="14" fill="currentColor">',
            '<path d="M4.34 2.93 2.93 4.34 8.59 10l-5.66 5.66 1.41 1.41L10 11.41',
            'l5.66 5.66 1.41-1.41L11.41 10l5.66-5.66-1.41-1.41L10 8.59z"/>',
            '</svg>',
            '</button>',
            '</div>',
            '</div>',

            // ── Filter bar ───────────────────────────────────────────
            '<div id="wde-filterbar">',
            '<div class="wde-fg">',
            '<button class="wde-fbtn wde-active" data-f="all">All</button>',
            '<button class="wde-fbtn" data-f="present">',
            '<span class="wde-dot wde-dot-p"></span>Present',
            '</button>',
            '<button class="wde-fbtn" data-f="missing">',
            '<span class="wde-dot wde-dot-m"></span>Missing',
            '</button>',
            '</div>',
            '<input id="wde-search" class="cdx-text-input__input wde-search-input"',
            ' type="search" placeholder="Filter by property name or PID…" autocomplete="off" />',
            '<div id="wde-summary" class="wde-summary"></div>',
            '</div>',

            // ── Body ─────────────────────────────────────────────────
            '<div id="wde-body">',
            '<div id="wde-status">',
            '<span class="wde-spinner"></span>',
            '<span id="wde-stxt">Loading…</span>',
            '</div>',
            '<div id="wde-content" hidden>',
            '<div class="wde-table-wrap">',
            '<table id="wde-table" class="wde-table">',
            '<thead><tr>',
            '<th class="wde-th wde-th-prop">Property</th>',
            '<th class="wde-th wde-th-val">Value</th>',
            '<th class="wde-th wde-th-status">Status</th>',
            '</tr></thead>',
            '<tbody id="wde-tbody"></tbody>',
            '</table>',
            '</div>',
            '</div>',
            '</div>',

            '</div>',  // #wde-dialog
            '</div>'   // #wde-overlay
        ].join('');

        const $overlay = $(html).appendTo('body');
        const overlay = $overlay[0];

        // DOM refs
        const $status = $('#wde-status');
        const $stxt = $('#wde-stxt');
        const $content = $('#wde-content');
        const $tbody = $('#wde-tbody');
        const $summary = $('#wde-summary');

        let activeFilter = 'all';
        let searchTerm = '';

        // ── Open / close ─────────────────────────────────────────────
        function openDialog(qid) {
            // Reset state
            showLoading('Loading…');
            $tbody.empty();
            $('#wde-qid-chip').prop('hidden', true);
            $('#wde-type-chip').prop('hidden', true);
            $('#wde-subtitle').text('');
            $summary.text('');
            activeFilter = 'all';
            searchTerm = '';
            $('#wde-search').val('');
            $('.wde-fbtn').removeClass('wde-active');
            $('.wde-fbtn[data-f="all"]').addClass('wde-active');

            overlay.classList.add('wde-visible');
            loadItem(qid);
        }

        function closeDialog() { overlay.classList.remove('wde-visible'); }

        $('#wde-close').on('click', closeDialog);
        $overlay.on('click', e => { if (e.target === overlay) closeDialog(); });
        $(document).on('keydown', e => {
            if (e.key === 'Escape' && overlay.classList.contains('wde-visible')) closeDialog();
        });

        // ── Filter bar ───────────────────────────────────────────────
        $('#wde-filterbar').on('click', '.wde-fbtn', function () {
            $('.wde-fbtn').removeClass('wde-active');
            $(this).addClass('wde-active');
            activeFilter = $(this).data('f');
            applyFilter();
        });
        $('#wde-search').on('input', function () {
            searchTerm = $(this).val().toLowerCase();
            applyFilter();
        });

        function applyFilter() {
            $tbody.find('tr.wde-row').each(function () {
                const $r = $(this);
                const isPresent = $r.find('.wde-status-chip').hasClass('wde-present');
                const status = isPresent ? 'present' : 'missing';
                const name = $r.find('.wde-prop-name').text().toLowerCase();
                const pid = ($r.data('pid') || '').toLowerCase();
                const mf = activeFilter === 'all' || activeFilter === status;
                const ms = !searchTerm || name.includes(searchTerm) || pid.includes(searchTerm);
                $r.toggle(mf && ms);
            });
        }

        // ── Load & render ────────────────────────────────────────────
        async function loadItem(qid) {
            try {
                showLoading('Fetching ' + qid + '…');
                const entity = await fetchEntityFull(qid);
                const claims = entity.claims || {};

                // Match entity type from P31 values
                const p31 = (claims.P31 || [])
                    .filter(c => c.mainsnak &&
                        c.mainsnak.snaktype === 'value' &&
                        c.mainsnak.datavalue &&
                        c.mainsnak.datavalue.type === 'wikibase-entityid')
                    .map(c => c.mainsnak.datavalue.value.id ||
                        'Q' + c.mainsnak.datavalue.value['numeric-id']);

                const typeKey = matchEntityType(p31);
                const et = typeKey ? ENTITY_TYPES[typeKey] : null;
                const cfgPids = et ? et.pids : Object.keys(claims).sort();

                showLoading('Resolving ' + cfgPids.length + ' property labels…');

                // Collect entity QIDs that appear as values, for label resolution
                const entQids = new Set();
                cfgPids.forEach(pid => {
                    (claims[pid] || []).forEach(c => {
                        const snak = c.mainsnak;
                        if (snak && snak.snaktype === 'value' &&
                            snak.datavalue && snak.datavalue.type === 'wikibase-entityid') {
                            entQids.add(snak.datavalue.value.id ||
                                'Q' + snak.datavalue.value['numeric-id']);
                        }
                    });
                });

                const [propLabels, entLabels] = await Promise.all([
                    batchLabels(cfgPids),
                    batchLabels([...entQids])
                ]);

                // Header info
                const itemLabel = ((entity.labels || {})[PAGE_LANG] ||
                    (entity.labels || {}).en ||
                    { value: qid }).value;
                const itemDesc = ((entity.descriptions || {})[PAGE_LANG] ||
                    (entity.descriptions || {}).en || {}).value || '';
                const nPresent = cfgPids.filter(p => claims[p] && claims[p].length).length;
                const nMissing = cfgPids.length - nPresent;

                $('#wde-qid-chip').text(qid).prop('hidden', false);
                if (et) $('#wde-type-chip').text(et.id).prop('hidden', false);
                $('#wde-subtitle').text(itemLabel + (itemDesc ? ' — ' + itemDesc : ''));
                $summary.html(
                    '<span class="wde-sp">' + nPresent + ' present</span>' +
                    ' · <span class="wde-sm">' + nMissing + ' missing</span>' +
                    ' of ' + cfgPids.length
                );

                // Render rows
                $tbody.html(cfgPids.map(pid =>
                    propRowHtml(pid, propLabels[pid] || pid,
                        claims[pid] || [], entLabels, qid)
                ).join(''));

                $status.hide();
                $content.prop('hidden', false);
                wireFormEvents(qid);

            } catch (err) {
                showError(err.message || 'An error occurred.');
            }
        }

        // ── Wikidata entity search (for autocomplete) ─────────────────
        let acTimer = null;
        async function searchEntities(query) {
            const d = await $.ajax({
                url: WD_API,
                dataType: 'json',
                data: {
                    action: 'wbsearchentities',
                    search: query,
                    language: PAGE_LANG,
                    uselang: PAGE_LANG,
                    type: 'item',
                    limit: 8,
                    format: 'json',
                    origin: '*'
                }
            });
            return d.search || [];
        }

        function renderAcDrop($drop, results, $input) {
            if (!results.length) { $drop.prop('hidden', true).empty(); return; }
            $drop.empty();
            results.forEach(function (r) {
                const label = r.label || r.id;
                const desc = r.description || '';
                const id = r.id;
                const $item = $(
                    '<div class="wde-ac-item" tabindex="-1">' +
                    '<div class="wde-ac-top">' +
                    '<span class="wde-ac-label">' + mw.html.escape(label) + '</span>' +
                    '<span class="wde-ac-qid">' + mw.html.escape(id) + '</span>' +
                    '</div>' +
                    (desc ? '<div class="wde-ac-desc">' + mw.html.escape(desc) + '</div>' : '') +
                    '</div>'
                );
                $item.on('mousedown', function (e) {
                    e.preventDefault(); // keep input focused
                    $input.val(label).data('qid', id);
                    $drop.prop('hidden', true).empty();
                });
                $drop.append($item);
            });
            $drop.prop('hidden', false);
        }

        function attachAutocomplete($fc) {
            const $input = $fc.find('.wde-val-input');
            const $wrap = $fc.find('.wde-ac-wrap');
            const $drop = $fc.find('.wde-ac-drop');

            $input.on('input.wdeac', function () {
                const q = $(this).val().trim();
                $input.removeData('qid'); // clear stored QID on new typing
                clearTimeout(acTimer);
                if (q.length < 2) { $drop.prop('hidden', true).empty(); return; }
                acTimer = setTimeout(async function () {
                    try {
                        const results = await searchEntities(q);
                        renderAcDrop($drop, results, $input);
                    } catch (_) { /* silent */ }
                }, 280);
            });

            // Close dropdown when focus leaves the wrap
            $input.on('blur.wdeac', function () {
                setTimeout(function () { $drop.prop('hidden', true).empty(); }, 200);
            });

            $wrap.addClass('wde-ac-active');
        }

        function detachAutocomplete($fc) {
            $fc.find('.wde-val-input').off('.wdeac');
            $fc.find('.wde-ac-wrap').removeClass('wde-ac-active');
            $fc.find('.wde-ac-drop').prop('hidden', true).empty();
        }

        // ── Inline add-value form events ─────────────────────────────
        function wireFormEvents(qid) {
            $tbody.off('click.wde').on('click.wde', '.wde-addbtn', function () {
                const pid = $(this).data('pid');
                const $row = $(this).closest('tr.wde-row');
                const $fc = $row.find('.wde-val-form');

                // Toggle off if already open
                if ($fc.children().length) { $fc.empty(); return; }
                // Close any other open form
                $tbody.find('.wde-val-form').empty();

                $fc.html(addFormHtml(pid));

                const $typeSel = $fc.find('.wde-type-sel');
                const $valInput = $fc.find('.wde-val-input');

                // Type selector — update placeholder, lang toggle, autocomplete
                $typeSel.on('change', function () {
                    const t = $(this).val();
                    $fc.find('.wde-lang-input').toggleClass('wde-hidden', t !== 'monolingual');
                    if (t === 'item') {
                        $valInput.attr('placeholder', 'Search Wikidata…');
                        attachAutocomplete($fc);
                    } else {
                        const ph = t === 'time' ? 'YYYY or YYYY-MM or YYYY-MM-DD'
                            : t === 'quantity' ? 'Number e.g. 42'
                                : t === 'monolingual' ? 'Text in chosen language'
                                    : 'Enter value…';
                        $valInput.attr('placeholder', ph);
                        detachAutocomplete($fc);
                    }
                });

                $fc.find('.wde-cancel-btn').on('click', () => {
                    clearTimeout(acTimer);
                    $fc.empty();
                });

                $fc.find('.wde-save-btn').on('click', async () => {
                    const type = $typeSel.val();
                    // For item type: prefer the QID stored by autocomplete,
                    // otherwise fall back to whatever the user typed (e.g. "Q42").
                    const storedQid = (type === 'item') ? $valInput.data('qid') : null;
                    const raw = storedQid || $valInput.val();
                    const display = $valInput.val() || raw; // label or raw, for UI update
                    const lang = $fc.find('.wde-lang-input').val();
                    const $msg = $fc.find('.wde-form-msg');
                    const $sav = $fc.find('.wde-save-btn');

                    $msg.prop('hidden', true).removeClass('wde-ok wde-err');

                    let valueObj;
                    try { valueObj = buildValueObj(type, raw, lang); }
                    catch (e) { showMsg($msg, e.message, 'wde-err'); return; }

                    $sav.prop('disabled', true).text('Saving…');
                    try {
                        await addClaim(qid, pid, valueObj);
                        showMsg($msg, '✓ Saved to Wikidata!', 'wde-ok');

                        // Update row status + value display
                        $row.find('.wde-status-chip')
                            .removeClass('wde-missing').addClass('wde-present')
                            .text('Present');
                        $row.find('.wde-val-display').html(
                            '<ul class="wde-vlist"><li>' +
                            '<span class="wde-str">' + mw.html.escape(display) + '</span>' +
                            ' <em class="wde-saved">(reload for full value)</em>' +
                            '</li></ul>'
                        );

                        // Retally summary
                        const np = $tbody.find('.wde-present').length;
                        const nm = $tbody.find('.wde-missing').length;
                        $summary.html(
                            '<span class="wde-sp">' + np + ' present</span>' +
                            ' · <span class="wde-sm">' + nm + ' missing</span>'
                        );

                        clearTimeout(acTimer);
                        setTimeout(() => $fc.empty(), 2000);
                    } catch (e) {
                        showMsg($msg, '⚠ ' + e.message, 'wde-err');
                        $sav.prop('disabled', false).text('Save');
                    }
                });
                // ── Delete button ─────────────────────────────────────────────
                $tbody.on('click.wde-del', '.wde-delbtn', async function () {
                    const guid = $(this).data('guid');
                    const $li = $(this).closest('li');
                    const $row = $(this).closest('tr.wde-row');
                    if (!guid) return;
                    if (!confirm('Delete this value from Wikidata?')) return;
                    $(this).prop('disabled', true).text('…');
                    try {
                        await deleteClaim(guid);
                        $li.fadeOut(200, function () {
                            $(this).remove();
                            // If no claims left, show dash
                            const $vlist = $row.find('.wde-vlist');
                            if (!$vlist.find('li:not(.wde-overflow)').length) {
                                $vlist.replaceWith('<span class="wde-empty">—</span>');
                                $row.find('.wde-status-chip')
                                    .removeClass('wde-present').addClass('wde-missing').text('Missing');
                                $row.find('.wde-addbtn').text('+ Add value');
                                retally();
                            }
                        });
                    } catch (e) {
                        alert('⚠ Could not delete: ' + e.message);
                        $(this).prop('disabled', false).text('✕');
                    }
                });

                // ── Edit button ───────────────────────────────────────────────
                $tbody.on('click.wde-edit', '.wde-editbtn', function () {
                    const $btn = $(this);
                    const guid = $btn.data('guid');
                    const dtype = $btn.data('dtype');  // wikibase-entityid | string | time | etc.
                    const rawVal = $btn.data('raw');
                    const rawLang = $btn.data('lang') || '';
                    const $li = $btn.closest('li');
                    const $row = $btn.closest('tr.wde-row');
                    const pid = $row.data('pid');

                    // Map datavalue type → form type
                    const typeMap = {
                        'wikibase-entityid': 'item',
                        'time': 'time',
                        'quantity': 'quantity',
                        'monolingualtext': 'monolingual',
                        'string': 'string'
                    };
                    const formType = typeMap[dtype] || 'string';

                    // Close any open form first
                    $tbody.find('.wde-val-form').empty();
                    $tbody.find('.wde-edit-inline').remove();

                    // Build inline edit form right after the <li>
                    const $eform = $('<div class="wde-form wde-edit-inline"></div>');

                    // Row 1: type selector (locked to detected type)
                    $eform.append(
                        $('<div class="wde-form-row wde-form-row-type"></div>').append(
                            $('<select class="wde-type-sel cdx-select"></select>').append(
                                $('<option>', { value: 'string', text: 'String / ID' }),
                                $('<option>', { value: 'item', text: 'Wikidata item' }),
                                $('<option>', { value: 'time', text: 'Date' }),
                                $('<option>', { value: 'quantity', text: 'Quantity' }),
                                $('<option>', { value: 'monolingual', text: 'Monolingual text' })
                            ).val(formType),
                            $('<input class="wde-lang-input cdx-text-input__input' +
                                (formType === 'monolingual' ? '' : ' wde-hidden') + '"' +
                                ' type="text" placeholder="Language code e.g. en" maxlength="10" />')
                                .val(rawLang)
                        )
                    );

                    // Row 2: value input + Save + Cancel
                    const $acWrap = $('<div class="wde-ac-wrap"></div>');
                    const $valInput = $('<input class="wde-val-input cdx-text-input__input"' +
                        ' type="text" autocomplete="off" />').val(rawVal);
                    const $acDrop = $('<div class="wde-ac-drop" hidden></div>');
                    $acWrap.append($valInput, $acDrop);

                    const $valRow = $('<div class="wde-form-row wde-form-row-val"></div>').append(
                        $acWrap,
                        $('<button class="wde-save-btn cdx-button cdx-button--action-progressive' +
                            ' cdx-button--weight-primary">Update</button>'),
                        $('<button class="wde-cancel-btn cdx-button cdx-button--weight-quiet">Cancel</button>')
                    );
                    $eform.append($valRow);
                    $eform.append($('<div class="wde-form-msg" hidden></div>'));

                    $li.after($eform);

                    // Set placeholder and autocomplete based on detected type
                    const $typeSel = $eform.find('.wde-type-sel');
                    if (formType === 'item') {
                        $valInput.attr('placeholder', 'Search Wikidata…');
                        attachAutocomplete($eform);
                        // Pre-store the QID so save works immediately without re-selecting
                        $valInput.data('qid', rawVal);
                    } else {
                        $valInput.attr('placeholder',
                            formType === 'time' ? 'YYYY or YYYY-MM or YYYY-MM-DD' :
                                formType === 'quantity' ? 'Number e.g. 42' :
                                    formType === 'monolingual' ? 'Text in chosen language' : 'Enter value…');
                    }

                    // Type selector changes
                    $typeSel.on('change', function () {
                        const t = $(this).val();
                        $eform.find('.wde-lang-input').toggleClass('wde-hidden', t !== 'monolingual');
                        if (t === 'item') {
                            $valInput.attr('placeholder', 'Search Wikidata…');
                            attachAutocomplete($eform);
                        } else {
                            $valInput.attr('placeholder',
                                t === 'time' ? 'YYYY or YYYY-MM or YYYY-MM-DD' :
                                    t === 'quantity' ? 'Number e.g. 42' :
                                        t === 'monolingual' ? 'Text in chosen language' : 'Enter value…');
                            detachAutocomplete($eform);
                        }
                    });

                    $eform.find('.wde-cancel-btn').on('click', () => {
                        clearTimeout(acTimer);
                        $eform.remove();
                    });

                    $eform.find('.wde-save-btn').on('click', async () => {
                        const type = $typeSel.val();
                        const stored = (type === 'item') ? $valInput.data('qid') : null;
                        const raw = stored || $valInput.val();
                        const display = $valInput.val() || raw;
                        const lang = $eform.find('.wde-lang-input').val();
                        const $msg = $eform.find('.wde-form-msg');
                        const $sav = $eform.find('.wde-save-btn');

                        $msg.prop('hidden', true).removeClass('wde-ok wde-err');

                        let valueObj;
                        try { valueObj = buildValueObj(type, raw, lang); }
                        catch (e) { showMsg($msg, e.message, 'wde-err'); return; }

                        $sav.prop('disabled', true).text('Saving…');
                        try {
                            await editClaim(guid, valueObj);
                            showMsg($msg, '✓ Updated on Wikidata!', 'wde-ok');
                            // Update the displayed value in the <li>
                            $li.find('.wde-str, .wde-entlink, .wde-time, .wde-num, .wde-meta').remove();
                            $li.prepend('<span class="wde-str">' + mw.html.escape(display) +
                                '</span> <em class="wde-saved">(reload for full value)</em> ');
                            // Update data attrs on edit button for next edit
                            $btn.data('raw', raw).data('dtype', dtype);
                            clearTimeout(acTimer);
                            setTimeout(() => $eform.remove(), 2000);
                        } catch (e) {
                            showMsg($msg, '⚠ ' + e.message, 'wde-err');
                            $sav.prop('disabled', false).text('Update');
                        }
                    });
                });
            }

        function retally() {
                    const np = $tbody.find('.wde-present').length;
                    const nm = $tbody.find('.wde-missing').length;
                    $summary.html(
                        '<span class="wde-sp">' + np + ' present</span>' +
                        ' · <span class="wde-sm">' + nm + ' missing</span>'
                    );
                }

        function showMsg($m, txt, cls) {
                    $m.text(txt).addClass(cls).prop('hidden', false);
                }

        // ── Status helpers ───────────────────────────────────────────
        function showLoading(msg) {
                    $status.show().removeClass('wde-err');
                    $stxt.text(msg);
                    $status.find('.wde-spinner').show();
                    $content.prop('hidden', true);
                }
        function showError(msg) {
                    $content.prop('hidden', true);
                    $status.show().addClass('wde-err');
                    $status.find('.wde-spinner').hide();
                    $stxt.text('⚠ ' + msg);
                }

        return openDialog;
        }

        // ─────────────────────────────────────────────────────────────────
        //  STYLES
        // ─────────────────────────────────────────────────────────────────

        function injectStyles() {
            $('<style>').prop('id', 'wde-styles').text(`
/* ── Overlay & dialog ─────────────────────────── */
#wde-overlay {
    display:none; position:fixed; inset:0; z-index:10000;
    background:rgba(0,0,0,.5);
    align-items:center; justify-content:center;
    padding:16px; box-sizing:border-box;
}
#wde-overlay.wde-visible { display:flex; }
#wde-dialog {
    background:var(--background-color-base,#fff);
    border:1px solid var(--border-color-base,#a2a9b1);
    border-radius:4px;
    box-shadow:0 16px 56px rgba(0,0,0,.34);
    width:min(980px,100%);
    max-height:min(92vh,760px);
    display:flex; flex-direction:column; overflow:hidden;
    font-family:var(--font-family-base,-apple-system,'Linux Libertine',Georgia,serif);
    animation:wde-pop .15s ease-out;
}
@keyframes wde-pop {
    from { opacity:0; transform:translateY(-10px) scale(.97); }
    to   { opacity:1; transform:none; }
}

/* ── Header ───────────────────────────────────── */
#wde-header {
    display:flex; align-items:center; gap:8px; flex-shrink:0;
    padding:9px 14px;
    background:var(--background-color-interactive-subtle,#eaecf0);
    border-bottom:1px solid var(--border-color-base,#a2a9b1);
}
.wde-logo { color:var(--color-progressive,#3366cc); display:flex; align-items:center; }
.wde-htxt { flex:1; min-width:0; }
#wde-title {
    margin:0; padding:0; border:none; background:none;
    font-size:1rem; font-weight:700; color:var(--color-base,#202122);
}
.wde-subtitle {
    display:block; font-size:.78rem; color:var(--color-subtle,#54595d);
    white-space:nowrap; overflow:hidden; text-overflow:ellipsis; max-width:460px;
}
.wde-htools { display:flex; align-items:center; gap:5px; flex-shrink:0; }
.wde-chip {
    display:inline-flex; align-items:center;
    padding:1px 8px; border-radius:2px;
    font-size:.77rem; font-weight:700; font-family:monospace;
    background:var(--background-color-progressive-subtle,#eaf3ff);
    color:var(--color-progressive,#3366cc);
    border:1px solid #6699cc;
}
.wde-chip-type { background:#fef8e7; color:#7a5c00; border-color:#c8a000; font-family:inherit; }

/* ── Codex-style buttons ──────────────────────── */
.cdx-button {
    display:inline-flex; align-items:center; gap:5px; cursor:pointer;
    padding:5px 11px; border-radius:2px; border:1px solid transparent;
    font-size:.875rem; font-weight:700; line-height:1.4;
    transition:background .1s; white-space:nowrap;
}
.cdx-button--weight-quiet { background:transparent; color:var(--color-base,#202122); }
.cdx-button--weight-quiet:hover { background:#f0f0f0; }
.cdx-button--weight-normal {
    background:var(--background-color-interactive-subtle,#f8f9fa);
    border-color:var(--border-color-base,#a2a9b1); color:var(--color-base,#202122);
}
.cdx-button--weight-normal:hover { background:#eaecf0; }
.cdx-button--action-progressive.cdx-button--weight-primary {
    background:var(--color-progressive,#3366cc);
    border-color:var(--color-progressive,#3366cc); color:#fff;
}
.cdx-button--action-progressive.cdx-button--weight-primary:hover { background:#2a4b8d; }
.cdx-button:disabled { opacity:.5; cursor:not-allowed; }
#wde-close { padding:4px 6px; }

/* ── Inputs ───────────────────────────────────── */
.cdx-text-input__input, .cdx-select {
    box-sizing:border-box; width:100%; padding:5px 9px;
    border:1px solid var(--border-color-base,#a2a9b1); border-radius:2px;
    font-size:.875rem; color:var(--color-base,#202122);
    background:var(--background-color-base,#fff);
}
.cdx-text-input__input:focus, .cdx-select:focus {
    outline:none;
    border-color:var(--color-progressive,#3366cc);
    box-shadow:0 0 0 2px rgba(51,102,204,.18);
}
/* Clean custom arrow — removes the ugly browser-native pattern */
.cdx-select {
    cursor:pointer;
    -webkit-appearance:none;
    appearance:none;
    background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 20 20' fill='%2354595d'%3E%3Cpath d='M5 7l5 5 5-5z'/%3E%3C/svg%3E");
    background-repeat:no-repeat;
    background-position:right 6px center;
    padding-right:26px;
}

/* ── Autocomplete wrapper ─────────────────────── */
.wde-ac-wrap { position:relative; flex:1; min-width:140px; }
.wde-ac-wrap .cdx-text-input__input { width:100%; }
/* Blue border when Wikidata-item mode is active */
.wde-ac-active .cdx-text-input__input {
    border-color:#3366cc;
    box-shadow:0 0 0 2px rgba(51,102,204,.15);
}
.wde-ac-drop {
    position:absolute; top:calc(100% + 2px); left:0; right:0;
    z-index:20000;
    background:#fff;
    border:1px solid #3366cc;
    border-radius:3px;
    max-height:260px; overflow-y:auto;
    box-shadow:0 6px 18px rgba(0,0,0,.16);
}
.wde-ac-item {
    padding:7px 11px; cursor:pointer;
    border-bottom:1px solid #f0f4ff;
    line-height:1.4;
}
.wde-ac-item:last-child { border-bottom:none; }
.wde-ac-item:hover, .wde-ac-item:focus { background:#eaf3ff; outline:none; }
.wde-ac-top { display:flex; align-items:baseline; justify-content:space-between; gap:6px; }
.wde-ac-label { font-weight:600; color:#202122; flex:1; min-width:0;
    white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
.wde-ac-qid {
    font-family:monospace; font-size:.73rem;
    color:#fff; background:#3366cc;
    padding:1px 5px; border-radius:2px; flex-shrink:0;
}
.wde-ac-desc { font-size:.78rem; color:#72777d; margin-top:1px;
    white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }

/* ── Filter bar ───────────────────────────────── */
#wde-filterbar {
    display:flex; align-items:center; gap:10px; flex-wrap:wrap; flex-shrink:0;
    padding:6px 14px;
    background:var(--background-color-base,#fff);
    border-bottom:1px solid var(--border-color-base,#a2a9b1);
}
.wde-fg { display:flex; gap:4px; }
.wde-fbtn {
    display:inline-flex; align-items:center; gap:5px; cursor:pointer;
    padding:3px 10px; border-radius:12px; font-size:.81rem; font-weight:600;
    border:1px solid var(--border-color-base,#a2a9b1);
    background:transparent; color:var(--color-subtle,#54595d); transition:all .1s;
}
.wde-fbtn:hover { background:#f0f0f0; color:var(--color-base,#202122); }
.wde-fbtn.wde-active {
    background:var(--color-progressive,#3366cc);
    border-color:var(--color-progressive,#3366cc); color:#fff;
}
.wde-dot { width:7px; height:7px; border-radius:50%; flex-shrink:0; }
.wde-dot-p { background:#3366cc; }
.wde-dot-m { background:#e67700; }
.wde-search-input { flex:1; min-width:130px; max-width:270px; }
.wde-summary { font-size:.8rem; color:var(--color-subtle,#54595d); margin-left:auto; }
.wde-sp { color:#3366cc; font-weight:700; }
.wde-sm { color:#e67700; font-weight:700; }

/* ── Body / status ────────────────────────────── */
#wde-body { flex:1; overflow-y:auto; padding:12px 14px; }
#wde-status {
    display:flex; align-items:center; gap:10px;
    padding:36px 0; justify-content:center;
    font-size:.9rem; color:var(--color-subtle,#54595d);
}
#wde-status.wde-err { color:var(--color-error,#d73333); }
.wde-spinner {
    width:20px; height:20px; flex-shrink:0;
    border:3px solid #c8ccd1; border-top-color:#3366cc;
    border-radius:50%; animation:wde-spin .65s linear infinite;
}
@keyframes wde-spin { to { transform:rotate(360deg); } }

/* ── Table ────────────────────────────────────── */
.wde-table-wrap { overflow-x:auto; }
.wde-table { width:100%; border-collapse:collapse; font-size:.875rem; }
.wde-th {
    padding:7px 10px; text-align:left; font-weight:700; white-space:nowrap;
    background:var(--background-color-interactive-subtle,#eaecf0);
    border:1px solid var(--border-color-base,#a2a9b1);
}
.wde-th-prop   { width:30%; }
.wde-th-val    { width:55%; }
.wde-th-status { width:15%; }
.wde-cell {
    padding:7px 10px;
    border:1px solid var(--border-color-base,#a2a9b1);
    vertical-align:top;
}
.wde-row:nth-child(even) .wde-cell { background:#f8f9fa; }
.wde-row:hover .wde-cell { background:#eaf3ff; }

/* ── Property column ──────────────────────────── */
.wde-prop-name { font-weight:600; color:var(--color-base,#202122); }
.wde-prop-pid  { font-size:.78rem; color:var(--color-subtle,#72777d); }
.wde-pid-link  {
    font-family:monospace; color:var(--color-subtle,#54595d); text-decoration:none;
}
.wde-pid-link:hover { text-decoration:underline; }

/* ── Value column ─────────────────────────────── */
.wde-vlist { margin:0; padding:0; list-style:none; }
.wde-vlist li { padding:1px 0; line-height:1.5; }
.wde-vlist li + li { border-top:1px dashed #eaecf0; padding-top:3px; margin-top:2px; }
.wde-entlink { color:#3366cc; text-decoration:none; }
.wde-entlink:hover { text-decoration:underline; }
.wde-extlink { color:#3366cc; text-decoration:none; word-break:break-all; }
.wde-extlink:hover { text-decoration:underline; }
.wde-meta     { font-family:monospace; font-size:.74rem; color:#72777d; }
.wde-str, .wde-num, .wde-time { color:var(--color-base,#202122); }
.wde-geo      { font-family:monospace; font-size:.82rem; }
.wde-nv       { color:#a2a9b1; }
.wde-empty    { color:#a2a9b1; font-style:italic; }
.wde-overflow { font-size:.78rem; color:#72777d; font-style:italic; }
.wde-saved    { font-size:.76rem; color:#14623d; font-style:italic; }
.wde-val-action { margin-top:5px; }
.wde-addbtn   { font-size:.79rem; padding:2px 9px; }
.wde-loginnote { font-size:.79rem; color:#72777d; }
.wde-val-form { margin-top:7px; }

/* ── Status column ────────────────────────────── */
.wde-col-status { text-align:center; white-space:nowrap; }
.wde-status-chip {
    display:inline-flex; align-items:center;
    padding:2px 9px; border-radius:2px;
    font-size:.76rem; font-weight:700; white-space:nowrap;
}
.wde-present { background:#d5fdf4; color:#14623d; border:1px solid #71d9b3; }
.wde-missing { background:#fef0d5; color:#7a3f00; border:1px solid #f0a050; }

/* ── Add-value form ───────────────────────────── */
.wde-form {
    background:#f8f9fa;
    border:1px solid var(--border-color-base,#a2a9b1);
    border-radius:3px; padding:9px 11px;
}
/* Row 1: type selector (+ lang when monolingual) */
.wde-form-row-type { display:flex; align-items:center; gap:7px; margin-bottom:6px; }
.wde-form-row-type .cdx-select { flex:1; }
.wde-form-row-type .wde-lang-input { width:130px; flex-shrink:0; }
/* Row 2: value input + Save + Cancel */
.wde-form-row-val { display:flex; align-items:flex-start; gap:7px; }
.wde-form-row-val .wde-ac-wrap { flex:1; min-width:0; }
.wde-hidden { display:none !important; }
.wde-form-msg { margin-top:5px; font-size:.83rem; padding:3px 8px; border-radius:2px; }
.wde-ok  { background:#d5fdf4; color:#14623d; border:1px solid #71d9b3; }
.wde-err { background:#fce8e8; color:#b32424; border:1px solid #e87c7c; }
` ).appendTo('head');
        }

        // ─────────────────────────────────────────────────────────────────
        //  TOOLS MENU LINK
        // ─────────────────────────────────────────────────────────────────

        function addToolsLink(openDialog) {
            const portlet = document.getElementById('p-cactions') ? 'p-cactions' : 'p-tb';
            const $link = $(mw.util.addPortletLink(
                portlet, '#', 'Wikidata editor', 't-wikidata-editor',
                'Edit Wikidata statements for this article (Alt+Shift+E)', 'E'
            ));
            if (!$link.length) return;
            $link.on('click', e => {
                e.preventDefault();
                if (!PAGE_QID) {
                    mw.notify('No Wikidata item is linked to this page.',
                        { type: 'error', tag: 'wde' });
                    return;
                }
                openDialog(PAGE_QID);
            });
        }

        // ─────────────────────────────────────────────────────────────────
        //  BOOT
        //  If window.WDE_CONFIG_PAGE is set (from common.js), fetch that
        //  page's JSON and use it instead of the embedded RAW_CONFIG.
        // ─────────────────────────────────────────────────────────────────

        async function boot() {
            // Check for external config page declared in common.js
            const configPage = (typeof window.WDE_CONFIG_PAGE === 'string')
                ? window.WDE_CONFIG_PAGE.trim() : '';

            if (configPage) {
                try {
                    const raw = await fetchConfigPage(configPage);
                    ENTITY_TYPES = buildEntityTypes(raw);
                    mw.log('[WikidataEditor] Config loaded from "' + configPage + '".');
                } catch (e) {
                    mw.log.warn('[WikidataEditor] Could not load config from "' +
                        configPage + '": ' + e.message +
                        ' — falling back to embedded config.');
                }
            }

            injectStyles();
            const openDialog = buildDialog();
            addToolsLink(openDialog);
        }

        mw.loader.using(['codex-styles', 'mediawiki.ForeignApi'])
            .then(boot)
            .catch(() => {
                // ForeignApi is critical for logged-in saves; log if missing
                mw.log.warn('[WikidataEditor] mediawiki.ForeignApi not available; edits may be anonymous.');
                $('<link>', {
                    rel: 'stylesheet',
                    href: '/w/load.php?modules=codex-styles&only=styles'
                }).appendTo('head');
                boot();
            });

    } (mediaWiki, jQuery));