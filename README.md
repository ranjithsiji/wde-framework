# Wikidata Editor Framework (WDE-Framework)

WDE-Framework is a powerful, configuration-driven Wikipedia User Script designed to edit Wikidata properties directly from Wikipedia or other MediaWiki instances. It provides dynamic and tailored editing interfaces for different entity types (e.g., Persons, Articles, Books, Software, etc.) based on predefined configurations.

## Features

- **Config-Driven Interface:** Generates property editing forms based on JSON configurations.
- **Support for Multiple Entity Types:** Hand-crafted configurations to seamlessly handle various types of entities.
- **Embedded or Remote Configurations:** Uses an embedded `RAW_CONFIG` by default or can dynamically load configurations from a specified wiki page.
- **Direct Wikidata Integration:** Uses the Wikidata API and MediaWiki ForeignApi for direct communication and edits.

TABLE COLUMNS:  Property (label + PID in brackets, linked)  |  Value  |  Status

CONFIG:
    The script uses the embedded RAW_CONFIG by default.
    To load config from a wiki page instead, set this variable in your
    common.js BEFORE loading this script:
 
        var WDE_CONFIG_PAGE = 'User:YourName/wikidata-editor-config.json';
        mw.loader.load('//en.wikipedia.org/w/index.php?title=User:YourName/wde-editor.js&action=raw&ctype=text/javascript');
 
If WDE_CONFIG_PAGE is set, it takes priority over the embedded config.
The page must contain valid JSON in the same format as configs.json.

- **Two User Interfaces:**
  - `wde-editor.js`: The classic, jQuery-powered editor script.
  - `wde-lookup.js`: A lookup script for Wikidata.

## Installation

### Classic Version (`wde-editor.js`)

Add the following snippet to your `common.js` on Wikipedia to start using the framework:

```javascript
// Optional: Use a remote configuration page for custom properties
// var WDE_CONFIG_PAGE = 'User:YourName/wde-editor-config.json';
mw.loader.load('//en.wikipedia.org/w/index.php?title=User:YourName/wde-editor.js&action=raw&ctype=text/javascript');
```

*(Note: Adjust the URL to point to the specific location where the script is hosted in your MediaWiki environment.)*

### Lookup Version (`wde-lookup.js`)

The `wde-lookup.js` script uses Vue 3 and the Wikimedia Codex design system. Load it similarly from your `common.js`. This script is used to look up Wikidata statements of the item.

```javascript
// Optional: Use a remote configuration page for custom properties
// var WDE_CONFIG_PAGE = 'User:YourName/wde-lookup-config.json';
mw.loader.load('//en.wikipedia.org/w/index.php?title=User:YourName/wde-lookup.js&action=raw&ctype=text/javascript');
```

## File Structure

- `wde-editor.js`: Core classic script, using jQuery and MediaWiki UI components.
- `wde-lookup.js`: Lookup script for Wikidata.
- `configs.json`: Standard configurations dictating property mappings and behaviors for various entities.
- `LICENSE`: Full license text.

## Keyboard Shortcuts

- **Alt+Shift+B**: Quickly launch the Wikidata Editor.
- **Alt+Shift+D**: Quickly launch the Wikidata Lookup.

## License

This project is licensed under the GNU General Public License v3.0 (GPLv3). See the [LICENSE](LICENSE) file for more details.
