/**
 * WikidataLookup — Wikipedia User Script
 * ========================================
 * * Part of Wikidata Editor Framework
 * Adds a "Wikidata statements" link to the Tools menu on any article page.
 * Clicking it automatically identifies the article's linked Wikidata item
 * (via wgWikibaseItemId) and fetches + displays ALL its statements in a
 * Codex-styled popup dialog — no manual input required.
 *
 * The search bar is still available for looking up *any* QID manually.
 *
 * Installation
 * ─────────────
 * 1. Create: https://en.wikipedia.org/wiki/User:YOUR_USERNAME/wikidata-lookup.js
 *    and paste this entire file there.
 *
 * 2. Add to your common.js:
 *    mw.loader.load(
 *      'https://en.wikipedia.org/w/index.php' +
 *      '?title=User:YOUR_USERNAME/wikidata-lookup.js&action=raw&ctype=text/javascript'
 *    );
 *
 * Shortcut: Alt + Shift + D
 * ==========================================
 * LICENSE : GNU GPL v3
 * ==========================================
 */

(function (mw, $) {
    'use strict';

    if (!mw || !$) { return; }

    // ── Constants ──────────────────────────────────────────────────────────────
    const WD_API = 'https://www.wikidata.org/w/api.php';
    const PAGE_QID = mw.config.get('wgWikibaseItemId'); // null on non-article pages
    const PAGE_LANG = mw.config.get('wgUserLanguage') || 'en';

    // ── Boot: load Codex styles then initialise ────────────────────────────────
    mw.loader.using('codex-styles')
        .then(init)
        .catch(() => {
            // Graceful fallback — load styles directly from load.php
            $('<link>', {
                id: 'wdl-codex-css',
                rel: 'stylesheet',
                href: '/w/load.php?modules=codex-styles&only=styles'
            }).appendTo('head');
            init();
        });

    // ══════════════════════════════════════════════════════════════════════════
    //  API HELPERS
    // ══════════════════════════════════════════════════════════════════════════

    /** Generic Wikidata API request (CORS-safe). */
    function wdApi(params) {
        return $.ajax({
            url: WD_API,
            data: Object.assign({ format: 'json', origin: '*' }, params),
            dataType: 'json'
        });
    }

    /**
     * Fetch labels + descriptions for a QID.
     * @returns {Promise<Object>} Wikidata entity object
     */
    async function fetchEntityMeta(qid) {
        const data = await wdApi({
            action: 'wbgetentities',
            ids: qid,
            props: 'labels|descriptions',
            languages: PAGE_LANG + '|en'
        });
        if (data.error) { throw new Error(data.error.info); }
        const entity = data.entities[qid];
        if (!entity || entity.missing !== undefined) {
            throw new Error('Item ' + qid + ' not found on Wikidata.');
        }
        return entity;
    }

    /**
     * Fetch all claims (statements) for a QID.
     * @returns {Promise<Object>} claims map { P123: [ claim, … ], … }
     */
    async function fetchClaims(qid) {
        const data = await wdApi({
            action: 'wbgetentities',
            ids: qid,
            props: 'claims'
        });
        const entity = data.entities[qid];
        return (entity && entity.claims) ? entity.claims : {};
    }

    /**
     * Batch-resolve human-readable labels for a list of PIDs.
     * Chunks into batches of 50 to stay within API limits.
     * @returns {Promise<Object>} { P31: 'instance of', … }
     */
    async function fetchPropertyLabels(pids) {
        if (!pids.length) { return {}; }
        const labels = {};
        for (let i = 0; i < pids.length; i += 50) {
            const batch = pids.slice(i, i + 50);
            const data = await wdApi({
                action: 'wbgetentities',
                ids: batch.join('|'),
                props: 'labels',
                languages: PAGE_LANG + '|en'
            });
            Object.entries(data.entities || {}).forEach(([pid, ent]) => {
                labels[pid] = (
                    (ent.labels[PAGE_LANG] || ent.labels.en || { value: pid })
                ).value;
            });
        }
        return labels;
    }

    /**
     * Batch-resolve labels for entity-value QIDs found inside claims.
     * @returns {Promise<Object>} { Q5: 'human', … }
     */
    async function resolveEntityLabels(qids) {
        if (!qids.length) { return {}; }
        const labels = {};
        for (let i = 0; i < qids.length; i += 50) {
            const batch = qids.slice(i, i + 50);
            const data = await wdApi({
                action: 'wbgetentities',
                ids: batch.join('|'),
                props: 'labels',
                languages: PAGE_LANG + '|en'
            });
            Object.entries(data.entities || {}).forEach(([qid, ent]) => {
                if (ent.labels) {
                    labels[qid] = (
                        (ent.labels[PAGE_LANG] || ent.labels.en || { value: qid })
                    ).value;
                }
            });
        }
        return labels;
    }

    /**
     * Search Wikidata by free text, return first matching QID or null.
     */
    async function searchItem(term) {
        const data = await wdApi({
            action: 'wbsearchentities',
            search: term,
            language: PAGE_LANG,
            type: 'item',
            limit: 1
        });
        return (data.search && data.search[0]) ? data.search[0].id : null;
    }

    // ══════════════════════════════════════════════════════════════════════════
    //  VALUE FORMATTING
    // ══════════════════════════════════════════════════════════════════════════

    /**
     * Walk all claims and collect every entity-value QID so we can resolve
     * them in one batched API call.
     */
    function collectEntityQids(claims) {
        const qids = new Set();
        Object.values(claims).forEach(claimList => {
            claimList.forEach(claim => {
                const snak = claim.mainsnak;
                if (snak && snak.snaktype === 'value' && snak.datavalue &&
                    snak.datavalue.type === 'wikibase-entityid') {
                    const dv = snak.datavalue;
                    const id = dv.value.id || ('Q' + dv.value['numeric-id']);
                    qids.add(id);
                }
            });
        });
        return [...qids];
    }

    /**
     * Convert a single snak to display HTML.
     */
    function formatSnak(snak, entityLabels) {
        if (!snak || snak.snaktype !== 'value') {
            return '<span class="wdl-novalue">—</span>';
        }
        const dv = snak.datavalue;
        if (!dv) { return '<span class="wdl-novalue">—</span>'; }

        switch (dv.type) {

            case 'string':
                if (/^https?:\/\//i.test(dv.value)) {
                    return '<a class="wdl-ext-link" href="' + mw.html.escape(dv.value) +
                        '" target="_blank" rel="noopener">' +
                        mw.html.escape(dv.value.length > 60
                            ? dv.value.slice(0, 57) + '…'
                            : dv.value) + '</a>';
                }
                return mw.html.escape(dv.value);

            case 'monolingualtext':
                return mw.html.escape(dv.value.text) +
                    ' <span class="wdl-lang-tag">[' +
                    mw.html.escape(dv.value.language) + ']</span>';

            case 'quantity': {
                const amt = dv.value.amount.replace(/^\+/, '');
                // unit is a URI like http://www.wikidata.org/entity/Q11573
                const unitQid = dv.value.unit.replace(/^.*\//, '');
                const unitLabel = (unitQid && unitQid !== '1')
                    ? (entityLabels[unitQid] || unitQid)
                    : '';
                return mw.html.escape(amt) +
                    (unitLabel
                        ? ' <span class="wdl-unit">' + mw.html.escape(unitLabel) + '</span>'
                        : '');
            }

            case 'time': {
                // e.g. +1952-03-11T00:00:00Z  with precision 11=day 10=month 9=year
                const raw = dv.value.time.replace(/^\+/, '');
                const prec = dv.value.precision;
                let display;
                if (prec >= 11) { display = raw.slice(0, 10); }
                else if (prec === 10) { display = raw.slice(0, 7); }
                else if (prec === 9) { display = raw.slice(0, 4); }
                else { display = raw; }
                return mw.html.escape(display);
            }

            case 'globecoordinate':
                return mw.html.escape(
                    dv.value.latitude.toFixed(5) + ', ' +
                    dv.value.longitude.toFixed(5)
                ) + ' <span class="wdl-lang-tag">geo</span>';

            case 'wikibase-entityid': {
                const id = dv.value.id || ('Q' + dv.value['numeric-id']);
                const label = entityLabels[id] || id;
                const path = id.startsWith('P') ? 'Property:' + id : id;
                return '<a class="wdl-ent-link" href="https://www.wikidata.org/wiki/' +
                    mw.html.escape(path) + '" target="_blank" rel="noopener">' +
                    mw.html.escape(label) + '</a>' +
                    ' <span class="wdl-qid-badge">' + mw.html.escape(id) + '</span>';
            }

            default:
                return mw.html.escape(JSON.stringify(dv.value));
        }
    }

    // ══════════════════════════════════════════════════════════════════════════
    //  RENDER STATEMENTS TABLE
    // ══════════════════════════════════════════════════════════════════════════

    function renderStatements(claims, propLabels, entityLabels) {
        const pids = Object.keys(claims);
        if (!pids.length) {
            return '<p class="wdl-empty">No statements found for this item.</p>';
        }

        const totalStatements = Object.values(claims)
            .reduce((s, c) => s + c.length, 0);

        const rows = pids.map(pid => {
            const propLabel = propLabels[pid] || pid;
            const list = claims[pid];
            const cap = 6;
            const items = list.slice(0, cap)
                .map(c => '<li>' + formatSnak(c.mainsnak, entityLabels) + '</li>')
                .join('');
            const more = list.length > cap
                ? '<li class="wdl-overflow">+' + (list.length - cap) + ' more…</li>'
                : '';

            return '<tr class="cdx-table__table__row">' +
                '<td class="cdx-table__table__cell wdl-cell-pid">' +
                '<a class="wdl-pid-link" href="https://www.wikidata.org/wiki/Property:' +
                pid + '" target="_blank" rel="noopener">' + pid + '</a>' +
                '</td>' +
                '<td class="cdx-table__table__cell wdl-cell-prop">' +
                mw.html.escape(propLabel) +
                '</td>' +
                '<td class="cdx-table__table__cell wdl-cell-val">' +
                '<ul class="wdl-val-list">' + items + more + '</ul>' +
                '</td>' +
                '</tr>';
        });

        return '<div class="cdx-table wdl-table-wrap">' +
            '<table class="cdx-table__table" aria-label="Wikidata statements">' +
            '<thead>' +
            '<tr class="cdx-table__table__row cdx-table__table__row--header">' +
            '<th class="cdx-table__table__cell cdx-table__table__cell--header wdl-th-pid">PID</th>' +
            '<th class="cdx-table__table__cell cdx-table__table__cell--header wdl-th-prop">Property</th>' +
            '<th class="cdx-table__table__cell cdx-table__table__cell--header wdl-th-val">Value(s)</th>' +
            '</tr>' +
            '</thead>' +
            '<tbody>' + rows.join('') + '</tbody>' +
            '</table>' +
            '</div>' +
            '<p class="wdl-count">' + pids.length + ' propert' +
            (pids.length === 1 ? 'y' : 'ies') + ' · ' +
            totalStatements + ' total statement' +
            (totalStatements === 1 ? '' : 's') + '</p>';
    }

    // ══════════════════════════════════════════════════════════════════════════
    //  DIALOG
    // ══════════════════════════════════════════════════════════════════════════

    function buildDialog() {
        const $overlay = $([
            '<div id="wdl-overlay" role="dialog" aria-modal="true" aria-labelledby="wdl-title">',
            '<div id="wdl-dialog">',

            // Header
            '<div id="wdl-header">',
            '<span class="wdl-logo" aria-hidden="true">',
            '<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">',
            '<path d="M3 3h2v18H3zm4 0h2v18H7zm4 9 6-6v12z"/>',
            '</svg>',
            '</span>',
            '<h2 id="wdl-title">Wikidata Statements</h2>',
            '<span id="wdl-qid-badge" class="wdl-chip" hidden></span>',
            '<button id="wdl-close" class="cdx-button cdx-button--weight-quiet" aria-label="Close">',
            '<svg viewBox="0 0 20 20" width="14" height="14" fill="currentColor">',
            '<path d="M4.34 2.93 2.93 4.34 8.59 10l-5.66 5.66 1.41 1.41L10 11.41l5.66 ',
            '5.66 1.41-1.41L11.41 10l5.66-5.66-1.41-1.41L10 8.59z"/>',
            '</svg>',
            '</button>',
            '</div>',

            // Collapsible manual search
            '<details id="wdl-search-details">',
            '<summary class="wdl-search-summary">',
            '<svg viewBox="0 0 20 20" width="13" height="13" fill="currentColor" aria-hidden="true">',
            '<path d="M12.43 13.84a7 7 0 1 1 1.41-1.41l3.86 3.87-1.41 1.41z',
            'M7 12A5 5 0 1 0 7 2a5 5 0 0 0 0 10z"/>',
            '</svg>',
            ' Look up a different item',
            '</summary>',
            '<div id="wdl-search-area">',
            '<div class="cdx-text-input">',
            '<input id="wdl-input" class="cdx-text-input__input" type="search"',
            ' autocomplete="off" spellcheck="false"',
            ' placeholder="Enter QID (e.g. Q42) or any search term" />',
            '</div>',
            '<button id="wdl-search-btn"',
            ' class="cdx-button cdx-button--action-progressive cdx-button--weight-primary">',
            'Load</button>',
            '</div>',
            '</details>',

            // Body
            '<div id="wdl-body">',
            '<div id="wdl-status">',
            '<span class="wdl-spinner" aria-hidden="true"></span>',
            '<span id="wdl-status-text">Loading…</span>',
            '</div>',
            '<div id="wdl-item-meta" hidden></div>',
            '<div id="wdl-props-wrap"></div>',
            '</div>',

            '</div>',  // #wdl-dialog
            '</div>'   // #wdl-overlay
        ].join(''));

        $overlay.appendTo('body');

        // ── DOM handles ────────────────────────────────────────────────────────
        const overlay = $overlay[0];
        const $status = $('#wdl-status');
        const $statusTxt = $('#wdl-status-text');
        const $meta = $('#wdl-item-meta');
        const $props = $('#wdl-props-wrap');
        const $input = $('#wdl-input');
        const $qidBadge = $('#wdl-qid-badge');

        // ── Open / close ───────────────────────────────────────────────────────
        function openDialog(autoQid) {
            // Reset to fresh state on every open
            $meta.prop('hidden', true);
            $props.empty();
            $qidBadge.prop('hidden', true).text('');
            $('#wdl-search-details').prop('open', false);

            overlay.classList.add('wdl-visible');

            if (autoQid) {
                // Auto mode: immediately fetch the article's own item
                $qidBadge.text(autoQid).prop('hidden', false);
                loadAndRender(autoQid);
            } else {
                // Manual mode
                showIdle('Enter a QID or search term above to begin.');
                $('#wdl-search-details').prop('open', true);
                $input.focus();
            }
        }

        function closeDialog() {
            overlay.classList.remove('wdl-visible');
        }

        $('#wdl-close').on('click', closeDialog);
        $overlay.on('click', e => {
            if (e.target === overlay) { closeDialog(); }
        });
        $(document).on('keydown', e => {
            if (e.key === 'Escape' && overlay.classList.contains('wdl-visible')) {
                closeDialog();
            }
        });

        // ── Manual search ──────────────────────────────────────────────────────
        $('#wdl-search-btn').on('click', doManualSearch);
        $input.on('keydown', e => {
            if (e.key === 'Enter') { doManualSearch(); }
        });

        async function doManualSearch() {
            const raw = $input.val().trim();
            if (!raw) { return; }
            showLoading('Searching…');
            try {
                let qid = raw.toUpperCase();
                if (!/^Q\d+$/.test(qid)) {
                    qid = await searchItem(raw);
                    if (!qid) {
                        throw new Error('No Wikidata item found for "' + raw + '".');
                    }
                }
                $qidBadge.text(qid).prop('hidden', false);
                await loadAndRender(qid);
            } catch (err) {
                showError(err.message || 'An error occurred.');
            }
        }

        // ── Core load + render ─────────────────────────────────────────────────
        async function loadAndRender(qid) {
            showLoading('Fetching Wikidata item ' + qid + '…');
            try {
                // Fetch entity meta and claims in parallel
                const [entity, claims] = await Promise.all([
                    fetchEntityMeta(qid),
                    fetchClaims(qid)
                ]);

                showLoading('Resolving ' + Object.keys(claims).length + ' property labels…');

                // Resolve property labels AND entity value labels in parallel
                const pids = Object.keys(claims);
                const entQids = collectEntityQids(claims);
                const [propLabels, entityLabels] = await Promise.all([
                    fetchPropertyLabels(pids),
                    resolveEntityLabels(entQids)
                ]);

                // Render item header
                const label = (entity.labels[PAGE_LANG] || entity.labels.en || { value: qid }).value;
                const descObj = entity.descriptions[PAGE_LANG] || entity.descriptions.en;
                const desc = descObj ? descObj.value : '';
                const wdUrl = 'https://www.wikidata.org/wiki/' + qid;

                $status.addClass('wdl-hidden');
                $meta.prop('hidden', false).html(
                    '<div class="wdl-meta-inner">' +
                    '<div class="wdl-item-label">' +
                    mw.html.escape(label) +
                    ' <a class="wdl-qid-link" href="' + mw.html.escape(wdUrl) +
                    '" target="_blank" rel="noopener">' + mw.html.escape(qid) + ' ↗</a>' +
                    '</div>' +
                    (desc ? '<p class="wdl-item-desc">' + mw.html.escape(desc) + '</p>' : '') +
                    '</div>'
                );

                // Render statements table
                $props.html(renderStatements(claims, propLabels, entityLabels));

            } catch (err) {
                showError(err.message || 'An error occurred.');
            }
        }

        // ── Status helpers ─────────────────────────────────────────────────────
        function showLoading(msg) {
            $meta.prop('hidden', true);
            $props.empty();
            $status
                .removeClass('wdl-hidden wdl-error wdl-idle')
                .addClass('wdl-loading');
            $statusTxt.text(msg);
            $status.find('.wdl-spinner').show();
        }

        function showError(msg) {
            $meta.prop('hidden', true);
            $props.empty();
            $status
                .removeClass('wdl-hidden wdl-loading wdl-idle')
                .addClass('wdl-error');
            $status.find('.wdl-spinner').hide();
            $statusTxt.text('⚠ ' + msg);
        }

        function showIdle(msg) {
            $meta.prop('hidden', true);
            $props.empty();
            $status
                .removeClass('wdl-hidden wdl-loading wdl-error')
                .addClass('wdl-idle');
            $status.find('.wdl-spinner').hide();
            $statusTxt.text(msg);
        }

        return openDialog;
    }

    // ══════════════════════════════════════════════════════════════════════════
    //  STYLES
    // ══════════════════════════════════════════════════════════════════════════

    function injectStyles() {
        const css = `
/* ── Overlay ─────────────────────────────────────────────────── */
#wdl-overlay {
	display: none;
	position: fixed;
	inset: 0;
	background: rgba(0,0,0,.5);
	z-index: 10000;
	align-items: center;
	justify-content: center;
	padding: 16px;
	box-sizing: border-box;
}
#wdl-overlay.wdl-visible { display: flex; }

/* ── Dialog ───────────────────────────────────────────────────── */
#wdl-dialog {
	background: var(--background-color-base, #fff);
	border: 1px solid var(--border-color-base, #a2a9b1);
	border-radius: 4px;
	box-shadow: 0 16px 48px rgba(0,0,0,.32);
	width: min(800px, 100%);
	max-height: min(88vh, 680px);
	display: flex;
	flex-direction: column;
	overflow: hidden;
	font-family: var(--font-family-base, -apple-system, 'Linux Libertine', Georgia, serif);
	animation: wdl-appear .15s ease-out;
}
@keyframes wdl-appear {
	from { opacity: 0; transform: translateY(-10px) scale(.97); }
	to   { opacity: 1; transform: translateY(0)     scale(1);   }
}

/* ── Header ───────────────────────────────────────────────────── */
#wdl-header {
	display: flex;
	align-items: center;
	gap: 8px;
	padding: 10px 14px;
	background: var(--background-color-interactive-subtle, #eaecf0);
	border-bottom: 1px solid var(--border-color-base, #a2a9b1);
	flex-shrink: 0;
}
.wdl-logo {
	color: var(--color-progressive, #3366cc);
	display: flex;
	align-items: center;
	flex-shrink: 0;
}
#wdl-header h2 {
	flex: 1;
	margin: 0; padding: 0;
	font-size: 1rem;
	font-weight: 700;
	color: var(--color-base, #202122);
	border: none;
	background: none;
}
/* QID chip next to title */
.wdl-chip {
	display: inline-flex;
	align-items: center;
	padding: 1px 8px;
	border-radius: 2px;
	font-size: .78rem;
	font-weight: 700;
	font-family: monospace;
	background: var(--background-color-progressive-subtle, #eaf3ff);
	color: var(--color-progressive, #3366cc);
	border: 1px solid var(--border-color-progressive, #6699cc);
	flex-shrink: 0;
}
/* Codex quiet button */
.cdx-button {
	display: inline-flex;
	align-items: center;
	gap: 5px;
	padding: 6px 12px;
	border-radius: 2px;
	border: 1px solid transparent;
	cursor: pointer;
	font-size: .875rem;
	font-weight: 700;
	line-height: 1.4;
	transition: background .1s;
	white-space: nowrap;
}
.cdx-button--weight-quiet {
	background: transparent;
	color: var(--color-base, #202122);
}
.cdx-button--weight-quiet:hover {
	background: var(--background-color-interactive, #f8f9fa);
}
.cdx-button--weight-primary.cdx-button--action-progressive {
	background: var(--color-progressive, #3366cc);
	border-color: var(--color-progressive, #3366cc);
	color: #fff;
}
.cdx-button--weight-primary.cdx-button--action-progressive:hover {
	background: var(--color-progressive--hover, #2a4b8d);
}
#wdl-close { padding: 5px 7px; }

/* ── Collapsible manual search ───────────────────────────────── */
#wdl-search-details {
	border-bottom: 1px solid var(--border-color-base, #a2a9b1);
	flex-shrink: 0;
}
.wdl-search-summary {
	cursor: pointer;
	padding: 6px 14px;
	font-size: .83rem;
	color: var(--color-subtle, #54595d);
	list-style: none;
	display: flex;
	align-items: center;
	gap: 5px;
	background: transparent;
	user-select: none;
}
.wdl-search-summary::-webkit-details-marker { display: none; }
.wdl-search-summary:hover {
	background: var(--background-color-interactive-subtle, #f8f9fa);
	color: var(--color-base, #202122);
}
#wdl-search-area {
	display: flex;
	gap: 8px;
	padding: 8px 14px 10px;
	background: var(--background-color-interactive-subtle, #f8f9fa);
}
#wdl-search-area .cdx-text-input { flex: 1; }
.cdx-text-input__input {
	width: 100%;
	box-sizing: border-box;
	padding: 6px 10px;
	border: 1px solid var(--border-color-base, #a2a9b1);
	border-radius: 2px;
	font-size: .9rem;
	color: var(--color-base, #202122);
	background: var(--background-color-base, #fff);
}
.cdx-text-input__input:focus {
	outline: 2px solid var(--color-progressive, #3366cc);
	outline-offset: -1px;
	border-color: transparent;
}

/* ── Body ─────────────────────────────────────────────────────── */
#wdl-body {
	flex: 1;
	overflow-y: auto;
	padding: 12px 14px;
}

/* ── Status ───────────────────────────────────────────────────── */
#wdl-status {
	display: flex;
	align-items: center;
	gap: 10px;
	padding: 32px 0;
	justify-content: center;
	color: var(--color-subtle, #54595d);
	font-size: .9rem;
}
#wdl-status.wdl-hidden { display: none; }
#wdl-status.wdl-error  { color: var(--color-error, #d73333); }

/* ── Spinner ──────────────────────────────────────────────────── */
.wdl-spinner {
	width: 20px; height: 20px;
	border: 3px solid var(--border-color-subtle, #c8ccd1);
	border-top-color: var(--color-progressive, #3366cc);
	border-radius: 50%;
	animation: wdl-spin .65s linear infinite;
	flex-shrink: 0;
}
@keyframes wdl-spin { to { transform: rotate(360deg); } }

/* ── Item meta header ─────────────────────────────────────────── */
.wdl-meta-inner {
	padding-bottom: 10px;
	border-bottom: 2px solid var(--border-color-base, #a2a9b1);
	margin-bottom: 12px;
}
.wdl-item-label {
	font-size: 1.12rem;
	font-weight: 700;
	color: var(--color-base, #202122);
	display: flex;
	flex-wrap: wrap;
	align-items: baseline;
	gap: 8px;
}
.wdl-qid-link {
	font-size: .78rem;
	font-weight: 400;
	font-family: monospace;
	color: var(--color-progressive, #3366cc);
	text-decoration: none;
}
.wdl-qid-link:hover { text-decoration: underline; }
.wdl-item-desc {
	margin: 3px 0 0;
	font-size: .87rem;
	color: var(--color-subtle, #54595d);
	font-style: italic;
}

/* ── Statements table ─────────────────────────────────────────── */
.wdl-table-wrap { overflow-x: auto; }
.cdx-table__table {
	width: 100%;
	border-collapse: collapse;
	font-size: .875rem;
}
.cdx-table__table__cell {
	padding: 5px 9px;
	border: 1px solid var(--border-color-base, #a2a9b1);
	vertical-align: top;
}
.cdx-table__table__cell--header {
	background: var(--background-color-interactive-subtle, #eaecf0);
	font-weight: 700;
	text-align: left;
	white-space: nowrap;
}
.cdx-table__table__row:nth-child(even) > .cdx-table__table__cell {
	background: #f8f9fa;
}
.cdx-table__table__row:hover > .cdx-table__table__cell {
	background: var(--background-color-progressive-subtle, #eaf3ff);
}
.wdl-th-pid  { width: 5.5rem; }
.wdl-th-prop { width: 13rem; }
.wdl-th-val  { /* fills rest */ }

.wdl-cell-pid { white-space: nowrap; }
.wdl-pid-link {
	font-family: monospace;
	font-size: .8rem;
	color: var(--color-subtle, #54595d);
	text-decoration: none;
}
.wdl-pid-link:hover { text-decoration: underline; }
.wdl-cell-prop { font-weight: 600; }

/* Value list inside each cell */
.wdl-val-list {
	margin: 0; padding: 0;
	list-style: none;
}
.wdl-val-list li { padding: 1px 0; line-height: 1.45; }
.wdl-val-list li + li {
	border-top: 1px dashed var(--border-color-subtle, #eaecf0);
	padding-top: 3px; margin-top: 2px;
}

/* Value decorators */
.wdl-ent-link {
	color: var(--color-progressive, #3366cc);
	text-decoration: none;
}
.wdl-ent-link:hover { text-decoration: underline; }
.wdl-ext-link {
	color: var(--color-progressive, #3366cc);
	text-decoration: none;
	word-break: break-all;
}
.wdl-ext-link:hover { text-decoration: underline; }
.wdl-qid-badge,
.wdl-lang-tag,
.wdl-unit {
	font-family: monospace;
	font-size: .75rem;
	color: var(--color-subtle, #72777d);
}
.wdl-overflow {
	color: var(--color-subtle, #72777d);
	font-size: .8rem;
	font-style: italic;
}
.wdl-novalue { color: var(--color-subtle, #a2a9b1); }

/* Footer count line */
.wdl-count {
	margin: 8px 0 0;
	font-size: .8rem;
	color: var(--color-subtle, #72777d);
	text-align: right;
}
.wdl-empty {
	color: var(--color-subtle, #54595d);
	font-style: italic;
	text-align: center;
	padding: 28px 0;
}
`;
        $('<style>').prop('id', 'wdl-styles').text(css).appendTo('head');
    }

    // ══════════════════════════════════════════════════════════════════════════
    //  TOOLS MENU LINK
    // ══════════════════════════════════════════════════════════════════════════

    function addToolsLink(openDialog) {
        // Vector 2022 uses p-cactions ("More" dropdown); older skins use p-tb
        const portlet = document.getElementById('p-cactions') ? 'p-cactions' : 'p-tb';
        const label = PAGE_QID ? 'Wikidata statements' : 'Wikidata lookup';

        const $link = $(mw.util.addPortletLink(
            portlet,
            '#',
            label,
            't-wikidata-statements',
            'View all Wikidata statements for this article (Alt+Shift+D)',
            'D'   // accesskey: Alt+Shift+D
        ));

        if (!$link.length) { return; }

        $link.on('click', e => {
            e.preventDefault();
            // If this article has a linked Wikidata item, load it immediately.
            // Otherwise open in manual-search mode.
            openDialog(PAGE_QID || null);
        });
    }

    // ══════════════════════════════════════════════════════════════════════════
    //  INIT
    // ══════════════════════════════════════════════════════════════════════════

    function init() {
        injectStyles();
        const openDialog = buildDialog();
        addToolsLink(openDialog);
    }

}(mediaWiki, jQuery));
