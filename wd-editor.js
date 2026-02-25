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

    async function addQualifier(guid, qpid, valueObj) {
        const d = await wdForeignApi.postWithToken('csrf', {
            action: 'wbsetqualifier',
            claim: guid,
            property: qpid,
            snaktype: 'value',
            value: JSON.stringify(valueObj),
            summary: 'Add qualifier via Codex WDE',
            format: 'json'
        });
        if (d.error) throw new Error(d.error.info);
        return d;
    }

    async function editQualifier(guid, qpid, valueObj, snakhash) {
        const d = await wdForeignApi.postWithToken('csrf', {
            action: 'wbsetqualifier',
            claim: guid,
            property: qpid,
            snaktype: 'value',
            value: JSON.stringify(valueObj),
            snakhash: snakhash,
            summary: 'Edit qualifier via Codex WDE',
            format: 'json'
        });
        if (d.error) throw new Error(d.error.info);
        return d;
    }

    async function removeQualifier(guid, snakhash) {
        const d = await wdForeignApi.postWithToken('csrf', {
            action: 'wbremovequalifiers',
            claim: guid,
            qualifiers: snakhash,
            summary: 'Remove qualifier via Codex WDE',
            format: 'json'
        });
        if (d.error) throw new Error(d.error.info);
        return d;
    }

    async function addReference(guid, rpid, type, valueObj) {
        let dvType = 'string';
        if (type === 'item') dvType = 'wikibase-entityid';
        else if (type === 'time') dvType = 'time';
        else if (type === 'quantity') dvType = 'quantity';
        else if (type === 'monolingual') dvType = 'monolingualtext';

        const d = await wdForeignApi.postWithToken('csrf', {
            action: 'wbsetreference',
            statement: guid,
            snaks: JSON.stringify({
                [rpid]: [{
                    snaktype: 'value',
                    property: rpid,
                    datavalue: { type: dvType, value: valueObj }
                }]
            }),
            summary: 'Add reference via Codex WDE',
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

    function buildValueObj(type, raw, lang, unit) {
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
            case 'quantity': {
                if (isNaN(parseFloat(v))) throw new Error('Must be a number.');
                const unitQid = (unit || '').trim().toUpperCase();
                const unitUri = unitQid && /^Q\d+$/.test(unitQid)
                    ? 'http://www.wikidata.org/entity/' + unitQid
                    : '1';
                return { amount: (parseFloat(v) >= 0 ? '+' : '') + parseFloat(v), unit: unitUri };
            }
            case 'monolingual': {
                const l = (lang || '').trim() || PAGE_LANG;
                if (!l) throw new Error('Language code required.');
                return { text: v, language: l };
            }
            default: return v;
        }
    }

    // ─────────────────────────────────────────────────────────────────
    //  SHARED HELPER: render one claim <li> with qualifiers
    // ─────────────────────────────────────────────────────────────────

    function claimItemHtml(c, entLabels, propLabels) {
        const snak = c.mainsnak;
        const dv = snak.datavalue || {};
        const dtype = dv.type || 'string';
        const guid = c.id || '';

        // Extract editable raw value for the edit form
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
            ' data-guid="' + mw.html.escape(guid) + '"' +
            ' data-dtype="' + mw.html.escape(dtype) + '"' +
            ' data-raw="' + mw.html.escape(rawVal) + '"' +
            ' data-lang="' + mw.html.escape(rawLang) + '">✎</button>' +
            ' <button class="wde-delbtn" title="Delete this value"' +
            ' data-guid="' + mw.html.escape(guid) + '">✕</button>'
            : '';

        // ── Qualifiers sub-block ──────────────────────────────────────
        let qualsHtml = '';
        const order = c['qualifiers-order'] || Object.keys(c.qualifiers || {});
        if (order.length) {
            const rows = order.map(qpid => {
                const snaks = (c.qualifiers || {})[qpid] || [];
                return snaks.map(qs => {
                    const qdv = qs.datavalue || {};
                    const qdtype = qdv.type || 'string';
                    let qRaw = '', qLang = '';
                    if (qdtype === 'string') { qRaw = qdv.value || ''; }
                    else if (qdtype === 'wikibase-entityid') {
                        qRaw = qdv.value ? (qdv.value.id || ('Q' + qdv.value['numeric-id'])) : '';
                    } else if (qdtype === 'time') {
                        const qt = (qdv.value && qdv.value.time) ? qdv.value.time.replace(/^\+/, '') : '';
                        const qp = qdv.value ? qdv.value.precision : 11;
                        qRaw = qp >= 11 ? qt.slice(0, 10) : qp === 10 ? qt.slice(0, 7) : qt.slice(0, 4);
                    } else if (qdtype === 'quantity') { qRaw = qdv.value ? qdv.value.amount.replace(/^\+/, '') : ''; }
                    else if (qdtype === 'monolingualtext') {
                        qRaw = qdv.value ? qdv.value.text : '';
                        qLang = qdv.value ? qdv.value.language : '';
                    }
                    const qLabel = propLabels[qpid] || qpid;
                    const qBtns = IS_LOGGED_IN
                        ? ' <button class="wde-q-editbtn" title="Edit qualifier"' +
                        ' data-guid="' + mw.html.escape(guid) + '"' +
                        ' data-qpid="' + mw.html.escape(qpid) + '"' +
                        ' data-hash="' + mw.html.escape(qs.hash || '') + '"' +
                        ' data-dtype="' + mw.html.escape(qdtype) + '"' +
                        ' data-raw="' + mw.html.escape(qRaw) + '"' +
                        ' data-lang="' + mw.html.escape(qLang) + '">✎</button>' +
                        ' <button class="wde-q-delbtn" title="Delete qualifier"' +
                        ' data-guid="' + mw.html.escape(guid) + '"' +
                        ' data-hash="' + mw.html.escape(qs.hash || '') + '">✕</button>'
                        : '';
                    return '<tr class="wde-qual-row">' +
                        '<td class="wde-qprop">' + mw.html.escape(qLabel) + '</td>' +
                        '<td class="wde-qval">' + snakHtml(qs, entLabels) + qBtns + '</td>' +
                        '</tr>';
                }).join('');
            }).join('');

            const addQBtn = IS_LOGGED_IN
                ? '<tr class="wde-qual-addbtn-row"><td colspan="2">' +
                '<button class="wde-q-addbtn" data-guid="' + mw.html.escape(guid) + '">' +
                '+ Add qualifier</button></td></tr>'
                : '';

            qualsHtml =
                '<div class="wde-quals">' +
                '<table class="wde-quals-table">' +
                rows + addQBtn +
                '</table>' +
                '</div>';
        } else if (IS_LOGGED_IN) {
            qualsHtml =
                '<div class="wde-quals wde-quals-empty">' +
                '<button class="wde-q-addbtn" data-guid="' + mw.html.escape(guid) + '">' +
                '+ Add qualifier</button></div>';
        }

        // ── References sub-block ──────────────────────────────────────
        let refsHtml = '';
        if (c.references && c.references.length) {
            const refItems = c.references.map((ref, i) => {
                const order = ref['snaks-order'] || Object.keys(ref.snaks || {});
                const rows = order.map(rpid => {
                    const snaks = (ref.snaks || {})[rpid] || [];
                    return snaks.map(rs => {
                        const rLabel = propLabels[rpid] || rpid;
                        return '<tr class="wde-ref-row">' +
                            '<td class="wde-rprop">' + mw.html.escape(rLabel) + '</td>' +
                            '<td class="wde-rval">' + snakHtml(rs, entLabels) + '</td>' +
                            '</tr>';
                    }).join('');
                }).join('');
                return '<div class="wde-ref-item"><div class="wde-ref-head">Reference</div>' +
                    '<table class="wde-refs-table">' + rows + '</table></div>';
            }).join('');
            refsHtml = '<div class="wde-refs">' + refItems + '</div>';
        }

        return '<li data-guid="' + mw.html.escape(guid) + '">' +
            '<div class="wde-claim-main">' + snakHtml(snak, entLabels) + editBtns + '</div>' +
            qualsHtml + refsHtml +
            '</li>';
    }

    function propRowHtml(pid, propLabel, claimList, entLabels, qid, propLabels) {
        propLabels = propLabels || {};
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
            const items = claimList.slice(0, 6).map(
                c => claimItemHtml(c, entLabels, propLabels)
            ).join('');
            const more = claimList.length > 6
                ? '<li class="wde-overflow">+' + (claimList.length - 6) + ' more\u2026</li>' : '';
            valInner = '<ul class="wde-vlist">' + items + more + '</ul>';
        } else {
            valInner = '<span class="wde-empty">\u2014</span>';
        }
        const addBtn = IS_LOGGED_IN
            ? '<button class="wde-addbtn cdx-button cdx-button--weight-normal"' +
            ' data-pid="' + mw.html.escape(pid) + '"' +
            ' data-qid="' + mw.html.escape(qid) + '">' +
            (has ? '+ Add another' : '+ Add value') + '</button>'
            : '<span class="wde-loginnote">Log in to edit</span>';
        const refreshBtn =
            '<button class="wde-refreshbtn" title="Refresh values from Wikidata"' +
            ' data-pid="' + mw.html.escape(pid) + '"' +
            ' data-qid="' + mw.html.escape(qid) + '">&#8635;</button>';
        const guidsEscaped = (claimList && claimList.length) ? mw.html.escape(claimList.map(c => c.id).join(',')) : '';
        const refBtn = IS_LOGGED_IN && has
            ? '<button class="wde-refbtn" title="Add reference to all values" data-guids="' + guidsEscaped + '">&#128279;</button>'
            : '';
        const valCell =
            '<td class="wde-cell wde-col-val">' +
            '<div class="wde-val-display">' + valInner + '</div>' +
            '<div class="wde-val-action">' + addBtn + refreshBtn + refBtn + '</div>' +
            '<div class="wde-val-form"></div>' +
            '</td>';

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
            '<button id="wde-minimize" class="cdx-button cdx-button--weight-quiet" aria-label="Minimize">',
            '<svg viewBox="0 0 20 20" width="14" height="14" fill="currentColor"><path d="M4 9h12v2H4z"/></svg>',
            '</button>',
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
            (IS_LOGGED_IN ? '<button id="wde-custom-addbtn" class="cdx-button cdx-button--weight-normal wde-custom-addbtn">+ Add statement</button>' : ''),
            '<input id="wde-search" class="cdx-text-input__input wde-search-input"',
            ' type="search" placeholder="Filter by property name or PID…" autocomplete="off" />',
            '<div id="wde-summary" class="wde-summary"></div>',
            '</div>',

            // ── Body ─────────────────────────────────────────────────
            '<div id="wde-body">',
            '<div id="wde-status">',
            '<span class="wde-spinner"></span>',
            '<span id="wde-stxt">Loading Wikidata statements…</span>',
            '</div>',
            '<div id="wde-content" hidden>',

            (IS_LOGGED_IN ? [
                '<div class="wde-custom-statement-section wde-custom-top">',
                '<div id="wde-custom-form" class="wde-form wde-custom-form wde-hidden">',
                '<div class="wde-form-row wde-form-row-type wde-qpid-wrap">',
                '<input id="wde-custom-pid" class="wde-qpid-input cdx-text-input__input" type="text" placeholder="Search property (e.g. start time / P580)" />',
                '<div class="wde-ac-drop wde-qpid-drop" hidden></div>',
                '</div>',
                '<div class="wde-form-row wde-form-row-type">',
                '<select id="wde-custom-type" class="wde-type-sel cdx-select">',
                '<option value="item">Wikidata item</option>',
                '<option value="string">String / ID</option>',
                '<option value="time">Date</option>',
                '<option value="quantity">Quantity / Number</option>',
                '<option value="monolingual">Monolingual text</option>',
                '</select>',
                '<input id="wde-custom-lang" class="wde-lang-input cdx-text-input__input wde-hidden" type="text" placeholder="lang e.g. en" maxlength="10" />',
                '</div>',
                '<div class="wde-form-row wde-form-row-val">',
                '<div class="wde-ac-wrap">',
                '<input id="wde-custom-val" class="wde-val-input cdx-text-input__input" type="text" placeholder="Enter value…" autocomplete="off" />',
                '<div class="wde-ac-drop" hidden></div>',
                '</div>',
                '<div id="wde-custom-unit-wrap" class="wde-unit-wrap wde-hidden">',
                '<span class="wde-unit-label">Unit:</span>',
                '<div class="wde-ac-wrap wde-unit-ac-wrap">',
                '<input id="wde-custom-unit" class="wde-unit-input cdx-text-input__input" type="text" placeholder="Search unit" autocomplete="off" />',
                '<div class="wde-ac-drop wde-unit-drop" hidden></div>',
                '</div>',
                '</div>',
                '<button id="wde-custom-save" class="wde-save-btn cdx-button cdx-button--action-progressive cdx-button--weight-primary">Add claim</button>',
                '<button id="wde-custom-cancel" class="wde-cancel-btn cdx-button cdx-button--weight-quiet">Cancel</button>',
                '</div>',
                '<div id="wde-custom-msg" class="wde-form-msg" hidden></div>',
                '</div>'
            ].join('') : ''),

            '<div class="wde-table-wrap">',
            '<table id="wde-table" class="wde-table">',
            '<thead><tr>',
            '<th class="wde-th wde-th-prop">Property</th>',
            '<th class="wde-th wde-th-val">Value</th>',
            '<th class="wde-th wde-th-status">Status</th>',
            '</tr></thead>',
            '<tbody id="wde-tbody"></tbody>',
            '</table>',
            '</div>', // .wde-table-wrap

            '</div>', // #wde-content
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

        // ── Open / close / drag ──────────────────────────────────────
        let isDragging = false;
        let currentX, currentY, initialX, initialY;
        let xOffset = 0, yOffset = 0;

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

            xOffset = 0; yOffset = 0;
            $('#wde-dialog').css('transform', '').removeClass('wde-minimized');

            overlay.classList.add('wde-visible');
            loadItem(qid);
        }

        function closeDialog() { overlay.classList.remove('wde-visible'); }

        $('#wde-close').on('click', closeDialog);
        $('#wde-minimize').on('click', () => $('#wde-dialog').toggleClass('wde-minimized'));

        // Close on overlay click (if not dragging)
        $overlay.on('click', e => { if (e.target === overlay) closeDialog(); });
        $(document).on('keydown', e => {
            if (e.key === 'Escape' && overlay.classList.contains('wde-visible')) closeDialog();
        });

        $('#wde-header').on('mousedown', function (e) {
            if ($(e.target).closest('button, a').length) return;
            initialX = e.clientX - xOffset;
            initialY = e.clientY - yOffset;
            isDragging = true;
            $overlay.css('user-select', 'none');
            $('#wde-header').css('cursor', 'grabbing');
        });

        $(window).on('mousemove.wdedrag', function (e) {
            if (isDragging) {
                e.preventDefault();
                currentX = e.clientX - initialX;
                currentY = e.clientY - initialY;
                xOffset = currentX;
                yOffset = currentY;
                $('#wde-dialog').css('transform', 'translate3d(' + currentX + 'px, ' + currentY + 'px, 0)');
            }
        });

        $(window).on('mouseup.wdedrag', function () {
            if (isDragging) {
                initialX = currentX;
                initialY = currentY;
                isDragging = false;
                $overlay.css('user-select', '');
                $('#wde-header').css('cursor', 'grab');
            }
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

                // Collect all QIDs needed for label resolution:
                // - main snak entity values
                // - qualifier entity values
                // - qualifier property PIDs
                const entQids = new Set();
                const qualPids = new Set();
                cfgPids.forEach(pid => {
                    (claims[pid] || []).forEach(c => {
                        const snak = c.mainsnak;
                        if (snak && snak.snaktype === 'value' &&
                            snak.datavalue && snak.datavalue.type === 'wikibase-entityid') {
                            entQids.add(snak.datavalue.value.id ||
                                'Q' + snak.datavalue.value['numeric-id']);
                        }
                        // qualifier property PIDs and entity values
                        Object.keys(c.qualifiers || {}).forEach(qpid => {
                            qualPids.add(qpid);
                            (c.qualifiers[qpid] || []).forEach(qs => {
                                const qdv = qs.datavalue || {};
                                if (qdv.type === 'wikibase-entityid' && qdv.value) {
                                    entQids.add(qdv.value.id || ('Q' + qdv.value['numeric-id']));
                                }
                            });
                        });
                    });
                });

                const allPids = [...new Set([...cfgPids, ...qualPids])];
                const [propLabels, entLabels] = await Promise.all([
                    batchLabels(allPids),
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

                $('#wde-qid-chip').html(
                    '<a href="https://www.wikidata.org/wiki/' + mw.html.escape(qid) + '"' +
                    ' target="_blank" rel="noopener" class="wde-qid-link">' +
                    mw.html.escape(qid) + '</a>'
                ).prop('hidden', false);
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
                        claims[pid] || [], entLabels, qid, propLabels)
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
            const $wrap = $input.closest('.wde-ac-wrap');
            const $targetDrop = $wrap.find('.wde-ac-drop');

            $input.off('.wdeac').on('input.wdeac', function () {
                const q = $(this).val().trim();
                $input.removeData('qid'); // clear stored QID on new typing
                clearTimeout(acTimer);
                if (q.length < 2) { $targetDrop.prop('hidden', true).empty(); return; }
                acTimer = setTimeout(async function () {
                    try {
                        const results = await searchEntities(q);
                        renderAcDrop($targetDrop, results, $input);
                    } catch (_) { /* silent */ }
                }, 280);
            });

            // Close dropdown when focus leaves the wrap
            $input.off('blur.wdeac').on('blur.wdeac', function () {
                setTimeout(function () { $targetDrop.prop('hidden', true).empty(); }, 200);
            });

            $wrap.addClass('wde-ac-active');
        }

        function detachAutocomplete($fc) {
            const $input = $fc.find('.wde-val-input');
            $input.off('.wdeac');
            const $wrap = $input.closest('.wde-ac-wrap');
            $wrap.removeClass('wde-ac-active');
            $wrap.find('.wde-ac-drop').prop('hidden', true).empty();
        }

        // Property-PID autocomplete (searches wbsearchentities type=property)
        function attachPropAutocomplete($qf) {
            const $input = $qf.find('.wde-qpid-input');
            let $drop = $qf.find('.wde-qpid-drop');
            if (!$drop.length) {
                $drop = $('<div class="wde-ac-drop wde-qpid-drop" hidden></div>');
                $input.after($drop);
                $input.parent().css('position', 'relative');
            }
            $input.off('.wdepac').on('input.wdepac', function () {
                const q = $(this).val().trim();
                $input.removeData('resolved-pid');
                clearTimeout(acTimer);
                if (q.length < 2) { $drop.prop('hidden', true).empty(); return; }
                acTimer = setTimeout(async () => {
                    try {
                        const d = await $.ajax({
                            url: WD_API, dataType: 'json',
                            data: {
                                action: 'wbsearchentities', search: q,
                                language: PAGE_LANG, uselang: PAGE_LANG,
                                type: 'property', limit: 8, format: 'json',
                                origin: '*'
                            }
                        });
                        $drop.empty().prop('hidden', false);
                        (d.search || []).forEach(r => {
                            $('<div class="wde-ac-item"></div>')
                                .html('<strong>' + mw.html.escape(r.id) + '</strong> ' +
                                    mw.html.escape(r.label || r.id) +
                                    (r.description ? ' <em>' + mw.html.escape(r.description) + '</em>' : ''))
                                .on('mousedown', function (e) {
                                    e.preventDefault();
                                    $input.val(r.id).data('resolved-pid', r.id);
                                    $drop.prop('hidden', true).empty();
                                })
                                .appendTo($drop);
                        });
                        if (!d.search || !d.search.length) $drop.prop('hidden', true);
                    } catch (_) { /* silent */ }
                }, 280);
            });
            $input.on('blur.wdepac', () =>
                setTimeout(() => $drop.prop('hidden', true).empty(), 200)
            );
        }

        // Unit entity autocomplete (searches items, stores QID as data-unit-qid)
        function attachUnitAutocomplete($qf) {
            const $input = $qf.find('.wde-unit-input');
            const $drop = $qf.find('.wde-unit-drop');
            if (!$input.length) return;
            $input.off('.wdeunit').on('input.wdeunit', function () {
                const q = $(this).val().trim();
                $input.removeData('unit-qid');
                clearTimeout(acTimer);
                if (q.length < 2) { $drop.prop('hidden', true).empty(); return; }
                acTimer = setTimeout(async () => {
                    try {
                        const results = await searchEntities(q);
                        $drop.empty().prop('hidden', false);
                        results.forEach(r => {
                            $('<div class="wde-ac-item"></div>')
                                .html(mw.html.escape(r.label || r.id) +
                                    (r.description ? ' <em>' + mw.html.escape(r.description) + '</em>' : ''))
                                .on('mousedown', function (e) {
                                    e.preventDefault();
                                    $input.val(r.label || r.id).data('unit-qid', r.id);
                                    $drop.prop('hidden', true).empty();
                                })
                                .appendTo($drop);
                        });
                        if (!results.length) $drop.prop('hidden', true);
                    } catch (_) { /* silent */ }
                }, 280);
            });
            $input.on('blur.wdeunit', () =>
                setTimeout(() => $drop.prop('hidden', true).empty(), 200)
            );
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

                        // Re-fetch and fully re-render the value cell
                        await refreshPropValueDisplay(qid, pid, $row);

                        // Ensure the status chip is up to date
                        $row.find('.wde-status-chip')
                            .removeClass('wde-missing').addClass('wde-present')
                            .text('Present');
                        $row.find('.wde-addbtn').text('+ Add another');
                        retally();

                        clearTimeout(acTimer);
                        setTimeout(() => $fc.empty(), 2000);
                    } catch (e) {
                        showMsg($msg, '⚠ ' + e.message, 'wde-err');
                        $sav.prop('disabled', false).text('Save');
                    }
                });
            }); // end .wde-addbtn click

            // ── Refresh button ────────────────────────────────────
            $tbody.on('click.wde-refresh', '.wde-refreshbtn', async function () {
                const $btn = $(this);
                const pid = $btn.data('pid');
                const qid = $btn.data('qid');
                const $row = $btn.closest('tr.wde-row');
                $btn.addClass('wde-refreshbtn--spinning').prop('disabled', true);
                await refreshPropValueDisplay(qid, pid, $row);
                $btn.removeClass('wde-refreshbtn--spinning').prop('disabled', false);
                // Update status chip based on re-fetched content
                const hasVals = $row.find('.wde-vlist li:not(.wde-overflow)').length > 0;
                $row.find('.wde-status-chip')
                    .toggleClass('wde-present', hasVals)
                    .toggleClass('wde-missing', !hasVals)
                    .text(hasVals ? 'Present' : 'Missing');
                $row.find('.wde-addbtn').text(hasVals ? '+ Add another' : '+ Add value');
                retally();
            });

            // ── Helper: refresh the value display for one property by re-fetching ──
            async function refreshPropValueDisplay(qid, pid, $row) {
                try {
                    const d = await wdApi({
                        action: 'wbgetentities',
                        ids: qid,
                        props: 'claims|labels',
                        languages: PAGE_LANG + '|en'
                    });
                    const entity = (d.entities || {})[qid] || {};
                    const claims = entity.claims || {};
                    const claimList = claims[pid] || [];

                    // Gather all entity IDs needed for labels:
                    // 1. main snak values, 2. qualifier snak values
                    const ids = [];
                    claimList.forEach(c => {
                        const mdv = (c.mainsnak || {}).datavalue || {};
                        if (mdv.type === 'wikibase-entityid' && mdv.value)
                            ids.push(mdv.value.id || ('Q' + mdv.value['numeric-id']));
                        Object.values(c.qualifiers || {}).forEach(snaks =>
                            snaks.forEach(qs => {
                                const qdv = qs.datavalue || {};
                                if (qdv.type === 'wikibase-entityid' && qdv.value)
                                    ids.push(qdv.value.id || ('Q' + qdv.value['numeric-id']));
                            })
                        );
                    });

                    // Gather all qualifier property PIDs for label lookup
                    const qPids = [];
                    claimList.forEach(c =>
                        Object.keys(c.qualifiers || {}).forEach(p => {
                            if (!qPids.includes(p)) qPids.push(p);
                        })
                    );

                    const [entLabels, propLabels] = await Promise.all([
                        ids.length ? batchLabels(ids) : Promise.resolve({}),
                        qPids.length ? batchLabels(qPids) : Promise.resolve({})
                    ]);

                    let valInner;
                    if (claimList.length) {
                        const items = claimList.slice(0, 6).map(
                            c => claimItemHtml(c, entLabels, propLabels)
                        ).join('');
                        const more = claimList.length > 6
                            ? '<li class="wde-overflow">+' + (claimList.length - 6) + ' more\u2026</li>' : '';
                        valInner = '<ul class="wde-vlist">' + items + more + '</ul>';
                    } else {
                        valInner = '<span class="wde-empty">\u2014</span>';
                    }
                    $row.find('.wde-val-display').html(valInner);
                } catch (_e) { /* leave display as-is on error */ }
            }

            // \u2500\u2500 Qualifier: delete \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
            $tbody.on('click.wde-qdel', '.wde-q-delbtn', async function () {
                const $btn = $(this);
                const guid = $btn.data('guid');
                const hash = $btn.data('hash');
                const $row = $btn.closest('tr.wde-row');
                const pid = $row.data('pid');
                const qid = $('#wde-qid-chip a').text().trim() || PAGE_QID;
                if (!confirm('Delete this qualifier?')) return;
                $btn.prop('disabled', true).text('\u2026');
                try {
                    await removeQualifier(guid, hash);
                    await refreshPropValueDisplay(qid, pid, $row);
                } catch (e) {
                    alert('\u26a0 Could not delete qualifier: ' + e.message);
                    $btn.prop('disabled', false).text('\u2715');
                }
            });

            // \u2500\u2500 Qualifier: edit \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
            $tbody.on('click.wde-qedit', '.wde-q-editbtn', function () {
                const $btn = $(this);
                const guid = $btn.data('guid');
                const qpid = $btn.data('qpid');
                const hash = $btn.data('hash');
                const dtype = $btn.data('dtype');
                const rawVal = $btn.data('raw');
                const rawLang = $btn.data('lang') || '';
                const $td = $btn.closest('td.wde-qval');
                const $row = $btn.closest('tr.wde-row');
                const pid = $row.data('pid');

                $tbody.find('.wde-qual-inline').closest('tr.wde-qual-inline-row').remove();

                const typeMap = {
                    'wikibase-entityid': 'item', 'time': 'time',
                    'quantity': 'quantity', 'monolingualtext': 'monolingual', 'string': 'string'
                };
                const formType = typeMap[dtype] || 'string';

                const $qf = $('<div class="wde-form wde-qual-inline"></div>');

                // ── Row 1: type selector + lang ───────────────────────
                const $typeSel = $('<select class="wde-type-sel cdx-select"></select>').append(
                    $('<option>', { value: 'string', text: 'String / ID' }),
                    $('<option>', { value: 'item', text: 'Wikidata item' }),
                    $('<option>', { value: 'time', text: 'Date' }),
                    $('<option>', { value: 'quantity', text: 'Quantity / Number' }),
                    $('<option>', { value: 'monolingual', text: 'Monolingual text' })
                ).val(formType);
                const $langInput = $('<input class="wde-lang-input cdx-text-input__input wde-hidden"' +
                    ' type="text" placeholder="lang e.g. en" maxlength="10" />').val(rawLang);
                $qf.append(
                    $('<div class="wde-form-row wde-form-row-type"></div>')
                        .append($typeSel, $langInput)
                );

                // ── Row 2: value input (dynamic) + unit + buttons ─────
                const $valRow = $('<div class="wde-form-row wde-form-row-val"></div>');
                const $valAcWrap = $('<div class="wde-ac-wrap"></div>').append(
                    $('<input class="wde-val-input cdx-text-input__input" type="text" autocomplete="off" />')
                        .val(rawVal).data('qid', formType === 'item' ? rawVal : undefined),
                    $('<div class="wde-ac-drop" hidden></div>')
                );
                const $unitWrap = $('<div class="wde-unit-wrap wde-hidden"></div>').append(
                    $('<span class="wde-unit-label">Unit:</span>'),
                    $('<div class="wde-ac-wrap wde-unit-ac-wrap"></div>').append(
                        $('<input class="wde-unit-input cdx-text-input__input" type="text"' +
                            ' placeholder="Search unit (e.g. kilogram)" autocomplete="off" />'),
                        $('<div class="wde-ac-drop wde-unit-drop" hidden></div>')
                    )
                );
                $valRow.append(
                    $valAcWrap, $unitWrap,
                    $('<button class="wde-save-btn cdx-button cdx-button--action-progressive cdx-button--weight-primary">Update</button>'),
                    $('<button class="wde-cancel-btn cdx-button cdx-button--weight-quiet">Cancel</button>')
                );
                $qf.append($valRow, $('<div class="wde-form-msg" hidden></div>'));

                $td.closest('tr.wde-qual-row').after(
                    $('<tr class="wde-qual-inline-row"><td colspan="2"></td></tr>')
                        .find('td').append($qf).end()
                );

                const $valInput = $qf.find('.wde-val-input');

                // Helper: update val input type/placeholder and extra fields
                function updateValInputType(t) {
                    $langInput.toggleClass('wde-hidden', t !== 'monolingual');
                    $unitWrap.toggleClass('wde-hidden', t !== 'quantity');
                    if (t === 'item') {
                        $valInput.attr({ type: 'text', placeholder: 'Search Wikidata item…' });
                        attachAutocomplete($qf);
                        attachUnitAutocomplete($qf);
                    } else if (t === 'time') {
                        $valInput.attr({ type: 'date', placeholder: '' });
                        detachAutocomplete($qf);
                    } else if (t === 'quantity') {
                        $valInput.attr({ type: 'number', placeholder: 'Number e.g. 42', step: 'any' });
                        detachAutocomplete($qf);
                        attachUnitAutocomplete($qf);
                    } else if (t === 'monolingual') {
                        $valInput.attr({ type: 'text', placeholder: 'Text in chosen language' });
                        detachAutocomplete($qf);
                    } else {
                        $valInput.attr({ type: 'text', placeholder: 'Enter value…' });
                        detachAutocomplete($qf);
                    }
                }

                $typeSel.on('change', function () { updateValInputType($(this).val()); });
                updateValInputType($typeSel.val());

                $qf.find('.wde-cancel-btn').on('click', () => $qf.closest('tr').remove());

                $qf.find('.wde-save-btn').on('click', async () => {
                    const type = $typeSel.val();
                    const stored = type === 'item' ? $valInput.data('qid') : null;
                    const raw = stored || $valInput.val();
                    const lang = $langInput.val();
                    const unit = $qf.find('.wde-unit-input').data('unit-qid') ||
                        $qf.find('.wde-unit-input').val().trim();
                    const $msg = $qf.find('.wde-form-msg');
                    const $sav = $qf.find('.wde-save-btn');

                    $msg.prop('hidden', true).removeClass('wde-ok wde-err');
                    let vo;
                    try { vo = buildValueObj(type, raw, lang, unit); }
                    catch (e) { showMsg($msg, e.message, 'wde-err'); return; }

                    $sav.prop('disabled', true).text('Saving…');
                    try {
                        await editQualifier(guid, qpid, vo, hash);
                        showMsg($msg, '✓ Updated!', 'wde-ok');
                        setTimeout(async () => {
                            $qf.closest('tr').remove();
                            await refreshPropValueDisplay(
                                $('#wde-qid-chip a').text().trim() || PAGE_QID, pid, $row
                            );
                        }, 1200);
                    } catch (e) {
                        showMsg($msg, '⚠ ' + e.message, 'wde-err');
                        $sav.prop('disabled', false).text('Update');
                    }
                });
            });

            // \u2500\u2500 Qualifier: add \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
            $tbody.on('click.wde-qadd', '.wde-q-addbtn', function () {
                const guid = $(this).data('guid');
                const $li = $(this).closest('li');
                const $row = $(this).closest('tr.wde-row');
                const pid = $row.data('pid');

                $li.find('.wde-qual-new-form').remove();

                const $qf = $('<div class="wde-form wde-qual-new-form"></div>');

                // ── Row 0: property PID with autocomplete ─────────────
                const $pidWrap = $('<div class="wde-form-row wde-form-row-type wde-qpid-wrap"></div>');
                $pidWrap.append(
                    $('<input class="wde-qpid-input cdx-text-input__input" type="text"' +
                        ' placeholder="Qualifier property (e.g. start time / P580)" />')
                );
                $qf.append($pidWrap);

                // ── Row 1: type selector + lang ───────────────────────
                const $typeSel = $('<select class="wde-type-sel cdx-select"></select>').append(
                    $('<option>', { value: 'string', text: 'String / ID' }),
                    $('<option>', { value: 'item', text: 'Wikidata item' }),
                    $('<option>', { value: 'time', text: 'Date' }),
                    $('<option>', { value: 'quantity', text: 'Quantity / Number' }),
                    $('<option>', { value: 'monolingual', text: 'Monolingual text' })
                );
                const $langInput = $('<input class="wde-lang-input cdx-text-input__input wde-hidden"' +
                    ' type="text" placeholder="lang e.g. en" maxlength="10" />');
                $qf.append(
                    $('<div class="wde-form-row wde-form-row-type"></div>')
                        .append($typeSel, $langInput)
                );

                // ── Row 2: value input (dynamic) + unit + buttons ─────
                const $valRow = $('<div class="wde-form-row wde-form-row-val"></div>');
                const $valAcWrap = $('<div class="wde-ac-wrap"></div>').append(
                    $('<input class="wde-val-input cdx-text-input__input" type="text"' +
                        ' placeholder="Enter value…" autocomplete="off" />'),
                    $('<div class="wde-ac-drop" hidden></div>')
                );
                const $unitWrap = $('<div class="wde-unit-wrap wde-hidden"></div>').append(
                    $('<span class="wde-unit-label">Unit:</span>'),
                    $('<div class="wde-ac-wrap wde-unit-ac-wrap"></div>').append(
                        $('<input class="wde-unit-input cdx-text-input__input" type="text"' +
                            ' placeholder="Search unit (e.g. kilogram)" autocomplete="off" />'),
                        $('<div class="wde-ac-drop wde-unit-drop" hidden></div>')
                    )
                );
                $valRow.append(
                    $valAcWrap, $unitWrap,
                    $('<button class="wde-save-btn cdx-button cdx-button--action-progressive cdx-button--weight-primary">Add</button>'),
                    $('<button class="wde-cancel-btn cdx-button cdx-button--weight-quiet">Cancel</button>')
                );
                $qf.append($valRow, $('<div class="wde-form-msg" hidden></div>'));

                $li.find('.wde-quals').append($qf);

                // Wire property autocomplete
                attachPropAutocomplete($qf);

                const $valInput = $qf.find('.wde-val-input');

                // Helper: update val input type/placeholder and extra fields
                function updateValInputType(t) {
                    $langInput.toggleClass('wde-hidden', t !== 'monolingual');
                    $unitWrap.toggleClass('wde-hidden', t !== 'quantity');
                    if (t === 'item') {
                        $valInput.attr({ type: 'text', placeholder: 'Search Wikidata item…' });
                        attachAutocomplete($qf);
                        attachUnitAutocomplete($qf);
                    } else if (t === 'time') {
                        $valInput.attr({ type: 'date', placeholder: '' });
                        detachAutocomplete($qf);
                    } else if (t === 'quantity') {
                        $valInput.attr({ type: 'number', placeholder: 'Number e.g. 42', step: 'any' });
                        detachAutocomplete($qf);
                        attachUnitAutocomplete($qf);
                    } else if (t === 'monolingual') {
                        $valInput.attr({ type: 'text', placeholder: 'Text in chosen language' });
                        detachAutocomplete($qf);
                    } else {
                        $valInput.attr({ type: 'text', placeholder: 'Enter value…' });
                        detachAutocomplete($qf);
                    }
                }

                $typeSel.on('change', function () { updateValInputType($(this).val()); });
                updateValInputType($typeSel.val());
                $qf.find('.wde-cancel-btn').on('click', () => $qf.remove());

                $qf.find('.wde-save-btn').on('click', async () => {
                    const qpid = ($qf.find('.wde-qpid-input').data('resolved-pid') ||
                        $qf.find('.wde-qpid-input').val()).trim().toUpperCase();
                    const type = $typeSel.val();
                    const stored = type === 'item' ? $valInput.data('qid') : null;
                    const raw = stored || $valInput.val();
                    const lang = $langInput.val();
                    const unit = $qf.find('.wde-unit-input').data('unit-qid') ||
                        $qf.find('.wde-unit-input').val().trim();
                    const $msg = $qf.find('.wde-form-msg');
                    const $sav = $qf.find('.wde-save-btn');

                    if (!/^P\d+$/i.test(qpid)) {
                        showMsg($msg, 'Select or enter a property ID like P580.', 'wde-err'); return;
                    }
                    $msg.prop('hidden', true).removeClass('wde-ok wde-err');
                    let vo;
                    try { vo = buildValueObj(type, raw, lang, unit); }
                    catch (e) { showMsg($msg, e.message, 'wde-err'); return; }

                    $sav.prop('disabled', true).text('Saving…');
                    try {
                        await addQualifier(guid, qpid, vo);
                        showMsg($msg, '✓ Qualifier added!', 'wde-ok');
                        setTimeout(async () => {
                            $qf.remove();
                            await refreshPropValueDisplay(
                                $('#wde-qid-chip a').text().trim() || PAGE_QID, pid, $row
                            );
                        }, 1200);
                    } catch (e) {
                        showMsg($msg, '⚠ ' + e.message, 'wde-err');
                        $sav.prop('disabled', false).text('Add');
                    }
                });
            });

            // ── Reference: add ──────────────────────────────────────────
            $tbody.on('click.wde-refadd', '.wde-refbtn', function () {
                const guids = $(this).data('guids').toString().split(',');
                const $cell = $(this).closest('td.wde-col-val');
                const $row = $(this).closest('tr.wde-row');
                const pid = $row.data('pid');

                $cell.find('.wde-ref-new-form').remove();

                const $qf = $('<div class="wde-form wde-ref-new-form wde-val-form" style="margin-top:10px;"></div>');
                // Header
                $qf.append($('<strong style="font-size: 0.9em; display: inline-block; margin-bottom: 5px;">' +
                    'Add reference to all values</strong>'));

                // Row 1: property PID with autocomplete
                const $pidWrap = $('<div class="wde-form-row wde-form-row-type wde-qpid-wrap"></div>');
                $pidWrap.append(
                    $('<input class="wde-qpid-input cdx-text-input__input" type="text"' +
                        ' placeholder="Reference property (e.g. stated in / P248)" />'),
                    $('<div class="wde-ac-drop wde-qpid-drop" hidden></div>')
                );
                $qf.append($pidWrap);

                // Row 2: type selector + lang
                const $typeSel = $('<select class="wde-type-sel cdx-select"></select>').append(
                    $('<option>', { value: 'item', text: 'Wikidata item' }),
                    $('<option>', { value: 'string', text: 'String / ID' }),
                    $('<option>', { value: 'time', text: 'Date' }),
                    $('<option>', { value: 'quantity', text: 'Quantity / Number' }),
                    $('<option>', { value: 'monolingual', text: 'Monolingual text' })
                );
                const $langInput = $('<input class="wde-lang-input cdx-text-input__input wde-hidden"' +
                    ' type="text" placeholder="lang e.g. en" maxlength="10" />');
                $qf.append(
                    $('<div class="wde-form-row wde-form-row-type"></div>')
                        .append($typeSel, $langInput)
                );

                // Row 3: value input + unit + buttons
                const $valRow = $('<div class="wde-form-row wde-form-row-val"></div>');
                const $valAcWrap = $('<div class="wde-ac-wrap"></div>').append(
                    $('<input class="wde-val-input cdx-text-input__input" type="text"' +
                        ' placeholder="Enter reference value…" autocomplete="off" />'),
                    $('<div class="wde-ac-drop" hidden></div>')
                );
                const $unitWrap = $('<div class="wde-unit-wrap wde-hidden"></div>').append(
                    $('<span class="wde-unit-label">Unit:</span>'),
                    $('<div class="wde-ac-wrap wde-unit-ac-wrap"></div>').append(
                        $('<input class="wde-unit-input cdx-text-input__input" type="text"' +
                            ' placeholder="Search unit" autocomplete="off" />'),
                        $('<div class="wde-ac-drop wde-unit-drop" hidden></div>')
                    )
                );
                $valRow.append(
                    $valAcWrap, $unitWrap,
                    $('<button class="wde-save-btn cdx-button cdx-button--action-progressive cdx-button--weight-primary">Add</button>'),
                    $('<button class="wde-cancel-btn cdx-button cdx-button--weight-quiet">Cancel</button>')
                );
                $qf.append($valRow, $('<div class="wde-form-msg" hidden></div>'));

                $cell.append($qf);

                attachPropAutocomplete($qf);
                const $valInput = $qf.find('.wde-val-input');

                function updateValInputType(t) {
                    $langInput.toggleClass('wde-hidden', t !== 'monolingual');
                    $unitWrap.toggleClass('wde-hidden', t !== 'quantity');
                    if (t === 'item') {
                        $valInput.attr({ type: 'text', placeholder: 'Search Wikidata item…' });
                        attachAutocomplete($qf);
                        attachUnitAutocomplete($qf);
                    } else if (t === 'time') {
                        $valInput.attr({ type: 'date', placeholder: '' });
                        detachAutocomplete($qf);
                    } else if (t === 'quantity') {
                        $valInput.attr({ type: 'number', placeholder: 'Number e.g. 42', step: 'any' });
                        detachAutocomplete($qf);
                        attachUnitAutocomplete($qf);
                    } else if (t === 'monolingual') {
                        $valInput.attr({ type: 'text', placeholder: 'Text in chosen language' });
                        detachAutocomplete($qf);
                    } else {
                        $valInput.attr({ type: 'text', placeholder: 'Enter value…' });
                        detachAutocomplete($qf);
                    }
                }

                $typeSel.on('change', function () { updateValInputType($(this).val()); });
                updateValInputType($typeSel.val());
                $qf.find('.wde-cancel-btn').on('click', () => $qf.remove());

                $qf.find('.wde-save-btn').on('click', async () => {
                    const rpid = ($qf.find('.wde-qpid-input').data('resolved-pid') ||
                        $qf.find('.wde-qpid-input').val()).trim().toUpperCase();
                    const type = $typeSel.val();
                    const stored = type === 'item' ? $valInput.data('qid') : null;
                    const raw = stored || $valInput.val();
                    const lang = $langInput.val();
                    const unit = $qf.find('.wde-unit-input').data('unit-qid') ||
                        $qf.find('.wde-unit-input').val().trim();
                    const $msg = $qf.find('.wde-form-msg');
                    const $sav = $qf.find('.wde-save-btn');

                    if (!/^P\d+$/i.test(rpid)) {
                        showMsg($msg, 'Select or enter a property ID like P248.', 'wde-err'); return;
                    }
                    $msg.prop('hidden', true).removeClass('wde-ok wde-err');
                    let vo;
                    try { vo = buildValueObj(type, raw, lang, unit); }
                    catch (e) { showMsg($msg, e.message, 'wde-err'); return; }

                    $sav.prop('disabled', true).text('Saving…');
                    try {
                        for (let guid of guids) {
                            if (!guid) continue;
                            await addReference(guid, rpid, type, vo);
                        }
                        showMsg($msg, '✓ Reference added to all values!', 'wde-ok');
                        setTimeout(async () => {
                            $qf.remove();
                            // Optional: wait a moment for the new ref to settle or just refresh the property visually
                            await refreshPropValueDisplay(
                                $('#wde-qid-chip a').text().trim() || PAGE_QID, pid, $row
                            );
                        }, 1200);
                    } catch (e) {
                        showMsg($msg, '⚠ ' + e.message, 'wde-err');
                        $sav.prop('disabled', false).text('Add');
                    }
                });
            });

            // ── Delete button ─────────────────────────────────────────
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

            // ── Custom statement form events ─────────────────────────
            if (IS_LOGGED_IN) {
                const $qf = $('#wde-custom-form');
                const $addBtn = $('#wde-custom-addbtn');
                const $cancelBtn = $('#wde-custom-cancel');
                const $pidInput = $('#wde-custom-pid');
                const $typeSel = $('#wde-custom-type');
                const $langInput = $('#wde-custom-lang');
                const $valInput = $('#wde-custom-val');
                const $unitWrap = $('#wde-custom-unit-wrap');
                const $unitInput = $('#wde-custom-unit');
                const $saveBtn = $('#wde-custom-save');
                const $msg = $('#wde-custom-msg');

                attachPropAutocomplete($qf);

                $addBtn.off('click').on('click', () => {
                    $qf.removeClass('wde-hidden');
                    $addBtn.addClass('wde-hidden');
                    $pidInput.focus();
                });

                $cancelBtn.off('click').on('click', () => {
                    $qf.addClass('wde-hidden');
                    $addBtn.removeClass('wde-hidden');
                    $pidInput.val('').removeData('resolved-pid');
                    $valInput.val('').removeData('qid');
                    $unitInput.val('').removeData('unit-qid');
                    $msg.prop('hidden', true);
                });

                function updateCustomValInputType(t) {
                    $langInput.toggleClass('wde-hidden', t !== 'monolingual');
                    $unitWrap.toggleClass('wde-hidden', t !== 'quantity');
                    if (t === 'item') {
                        $valInput.attr({ type: 'text', placeholder: 'Search Wikidata item…' });
                        attachAutocomplete($qf);
                        attachUnitAutocomplete($qf);
                    } else if (t === 'time') {
                        $valInput.attr({ type: 'date', placeholder: '' });
                        detachAutocomplete($qf);
                    } else if (t === 'quantity') {
                        $valInput.attr({ type: 'number', placeholder: 'Number e.g. 42', step: 'any' });
                        detachAutocomplete($qf);
                        attachUnitAutocomplete($qf);
                    } else if (t === 'monolingual') {
                        $valInput.attr({ type: 'text', placeholder: 'Text in chosen language' });
                        detachAutocomplete($qf);
                    } else {
                        $valInput.attr({ type: 'text', placeholder: 'Enter value…' });
                        detachAutocomplete($qf);
                    }
                }

                $typeSel.off('change').on('change', function () { updateCustomValInputType($(this).val()); });
                updateCustomValInputType($typeSel.val());

                $saveBtn.off('click').on('click', async () => {
                    const qpid = ($pidInput.data('resolved-pid') || $pidInput.val()).trim().toUpperCase();
                    const type = $typeSel.val();
                    const stored = type === 'item' ? $valInput.data('qid') : null;
                    const raw = stored || $valInput.val();
                    const lang = $langInput.val();
                    const unit = $unitInput.data('unit-qid') || $unitInput.val().trim();

                    if (!/^P\d+$/i.test(qpid)) {
                        showMsg($msg, 'Select or enter a property ID like P580.', 'wde-err'); return;
                    }
                    $msg.prop('hidden', true).removeClass('wde-ok wde-err');
                    let vo;
                    try { vo = buildValueObj(type, raw, lang, unit); }
                    catch (e) { showMsg($msg, e.message, 'wde-err'); return; }

                    $saveBtn.prop('disabled', true).text('Saving…');
                    try {
                        await addClaim(qid, qpid, vo);
                        showMsg($msg, '✓ Claim added!', 'wde-ok');
                        setTimeout(async () => {
                            // Reset form fields
                            $pidInput.val('').removeData('resolved-pid');
                            $valInput.val('').removeData('qid');
                            $unitInput.val('').removeData('unit-qid');
                            $msg.prop('hidden', true);
                            $saveBtn.prop('disabled', false).text('Add claim');
                            $qf.addClass('wde-hidden');
                            $addBtn.removeClass('wde-hidden');

                            // Re-render row or append new row dynamically
                            let $row = $tbody.find('tr[data-pid="' + qpid + '"]');
                            if (!$row.length) {
                                const propLabels = await batchLabels([qpid]);
                                const newRowHtml = propRowHtml(qpid, propLabels[qpid] || qpid, [], {}, qid, propLabels);
                                $tbody.append(newRowHtml);
                                $row = $tbody.find('tr[data-pid="' + qpid + '"]');
                                retally();
                            }
                            await refreshPropValueDisplay(qid, qpid, $row);
                            // scroll the new/updated row into view
                            $row[0].scrollIntoView({ behavior: 'smooth', block: 'center' });
                        }, 1200);
                    } catch (e) {
                        showMsg($msg, '⚠ ' + e.message, 'wde-err');
                        $saveBtn.prop('disabled', false).text('Add claim');
                    }
                });
            }
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
    background:rgba(0,0,0,.15);
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
#wde-dialog.wde-minimized #wde-body { display: none; }

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
    cursor: grab;
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
.wde-qid-link { color:inherit; text-decoration:none; }
.wde-qid-link:hover { text-decoration:underline; }

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
.wde-vlist li { padding:3px 0 6px; line-height:1.5; }
.wde-vlist li + li { border-top:1px dashed #eaecf0; padding-top:5px; margin-top:2px; }
.wde-claim-main { display:inline; }
/* ── Qualifiers ───────────────────────────────── */
.wde-quals {
    margin:4px 0 2px 10px;
    border-left:2px solid #eaecf0;
    padding-left:8px;
}
.wde-refs {
    margin:4px 0 2px 10px;
    border-left:2px solid #eaecf0;
    padding-left:8px;
}
.wde-ref-item { font-size:.82rem; margin-top:2px; }
.wde-ref-head { color:#54595d; font-weight:600; font-size:.78rem; border-bottom:1px solid #eaecf0; width:max-content; padding-right:6px; margin-bottom:2px; }
.wde-refs-table { border-collapse:collapse; width:100%; font-size:.82rem; }
.wde-refs-table td { padding:1px 4px 1px 0; vertical-align:top; }
.wde-rprop {
    color:#72777d; white-space:nowrap; font-style:italic;
    min-width:110px; max-width:160px; padding-right:8px !important;
}
.wde-rval { color:var(--color-base,#202122); word-break:break-word; }

.wde-quals-empty { /* no table, just the add btn */ }
.wde-quals-table { border-collapse:collapse; width:100%; font-size:.82rem; }
.wde-quals-table td { padding:1px 4px 1px 0; vertical-align:top; }
.wde-qprop {
    color:#3db2d0; font-style:italic; white-space:nowrap;
    min-width:110px; max-width:160px; padding-right:8px !important;
}
.wde-qval { color:var(--color-base,#202122); word-break:break-word; }
.wde-q-editbtn, .wde-q-delbtn {
    border:none; background:transparent; cursor:pointer;
    font-size:.78rem; color:#72777d; padding:0 2px;
    opacity:.6; transition:opacity .15s, color .15s;
}
.wde-q-editbtn:hover { opacity:1; color:#3366cc; }
.wde-q-delbtn:hover  { opacity:1; color:#c44; }
.wde-q-addbtn {
    font-size:.75rem; color:#3366cc; background:transparent; border:none;
    cursor:pointer; padding:2px 0; text-decoration:underline dotted;
}
.wde-q-addbtn:hover { color:#004488; }
.wde-qual-addbtn-row td { padding-top:3px; }
.wde-qual-inline-row td { padding:4px 0; }
.wde-qpid-input { width:100%; box-sizing:border-box; }
.wde-qpid-wrap  { position:relative; }
.wde-qpid-drop  { min-width:260px; }
.wde-unit-wrap  { display:flex; align-items:center; gap:6px; margin-top:4px; flex-wrap:wrap; }
.wde-unit-label { font-size:.8rem; color:#54595d; white-space:nowrap; }
.wde-unit-ac-wrap { flex:1; min-width:140px; position:relative; }
.wde-unit-input { width:100%; box-sizing:border-box; }
.wde-unit-drop  { min-width:200px; }
input[type="date"].wde-val-input { max-width:160px; }
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
.wde-val-action { margin-top:5px; display:flex; align-items:center; gap:6px; flex-wrap:wrap; }
.wde-addbtn   { font-size:.79rem; padding:2px 9px; }
.wde-loginnote { font-size:.79rem; color:#72777d; }
.wde-val-form { margin-top:7px; }
.wde-refreshbtn, .wde-refbtn {
    display:inline-flex; align-items:center; justify-content:center;
    width:22px; height:22px; padding:0; border-radius:50%;
    border:1px solid #a2a9b1; background:transparent;
    color:#54595d; font-size:14px; line-height:1; cursor:pointer;
    transition:background .15s, color .15s, transform .15s;
}
.wde-refreshbtn:hover, .wde-refbtn:hover { background:#eaf3ff; color:#3366cc; border-color:#3366cc; }
.wde-refreshbtn:disabled, .wde-refbtn:disabled { opacity:.45; cursor:default; }
@keyframes wde-spin { to { transform:rotate(360deg); } }
.wde-refreshbtn--spinning { animation:wde-spin .7s linear infinite; }

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

/* ── Custom statement section ───────────────────── */
.wde-custom-statement-section {
    margin: 10px 14px;
    padding-bottom: 5px;
}
.wde-custom-addbtn {
    margin-bottom: 8px;
    font-weight: 700;
}
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

}(mediaWiki, jQuery));