/**
 * Number of SVG nodes updated before yielding to the browser.
 * Keeping this modest avoids long frames while still making broad matches appear quickly.
 */
const SEARCH_RENDER_BATCH_SIZE = 500;

/**
 * @typedef {{ point: SVGElement, name: string, visible: boolean }} SearchableCommune
 */

/**
 * @param {NodeListOf<SVGElement>} communesSvg
 */
export function createProgressiveSearchRenderer(communesSvg) {
    const communes = Array.from(communesSvg, point => ({
        point,
        name: point.querySelector('.label')?.textContent ?? '',
        visible: point.classList.contains('visible'),
    }));
    const renderOrder = createDeterministicShuffledOrder(communes);

    let renderToken = 0;

    return {
        /**
         * @param {string} value regex value
         */
        search(value) {
            const token = ++renderToken;

            try {
                const nextVisibleCommunes = findMatchingCommunes(value, communes);
                renderVisibilityDiffProgressively(token, nextVisibleCommunes);
            } catch (error) {
                // Ignore invalid regex and cancel any in-flight progressive render.
            }
        },
    };

    /**
     * @param {number} token
     * @param {Set<SearchableCommune>} nextVisibleCommunes
     */
    async function renderVisibilityDiffProgressively(token, nextVisibleCommunes) {
        const toHide = [];
        const toShow = [];

        // Diff from the actual DOM state, not from the previous target state.
        // This is important when a previous progressive render was cancelled halfway:
        // the map may legitimately be in an intermediate state, and the next render
        // must repair it instead of assuming the cancelled target was fully applied.
        for (const commune of renderOrder) {
            if (commune.visible && !nextVisibleCommunes.has(commune)) {
                toHide.push(commune);
            } else if (!commune.visible && nextVisibleCommunes.has(commune)) {
                toShow.push(commune);
            }
        }

        const maxLength = Math.max(toHide.length, toShow.length);
        for (let index = 0; index < maxLength; index += SEARCH_RENDER_BATCH_SIZE) {
            if (token !== renderToken) {
                return;
            }

            applyVisibility(toHide, index, index + SEARCH_RENDER_BATCH_SIZE, false);
            applyVisibility(toShow, index, index + SEARCH_RENDER_BATCH_SIZE, true);

            if (index + SEARCH_RENDER_BATCH_SIZE < maxLength) {
                await nextFrame();
            }
        }
    }
}

/**
 * @param {string} value
 * @param {SearchableCommune[]} communes
 */
function findMatchingCommunes(value, communes) {
    if (value.length === 0) {
        return new Set();
    }

    const regex = new RegExp(value, 'i');
    const matches = new Set();

    for (const commune of communes) {
        regex.lastIndex = 0;
        if (commune.name && regex.test(commune.name)) {
            matches.add(commune);
        }
    }

    return matches;
}

/**
 * @param {SearchableCommune[]} communes
 * @param {number} start
 * @param {number} end
 * @param {boolean} visible
 */
function applyVisibility(communes, start, end, visible) {
    for (let index = start; index < end && index < communes.length; index++) {
        const commune = communes[index];
        commune.visible = visible;
        commune.point.classList.toggle('visible', visible);
    }
}

function nextFrame() {
    return new Promise(resolve => {
        const schedule = window.requestAnimationFrame ?? ((callback) => setTimeout(callback, 16));
        schedule(resolve);
    });
}

/**
 * Admin Express data is naturally grouped by territory. Rendering in that order makes
 * broad searches fill/empty one department after another. A deterministic shuffled
 * order distributes each batch across the whole map while keeping behavior stable.
 *
 * @param {SearchableCommune[]} communes
 */
function createDeterministicShuffledOrder(communes) {
    return [...communes].sort((a, b) => renderHash(a) - renderHash(b));
}

/**
 * @param {{ point: SVGElement, name: string }} commune
 */
function renderHash(commune) {
    const value = `${commune.point.id}|${commune.name}`;
    let hash = 2166136261;

    for (let index = 0; index < value.length; index++) {
        hash ^= value.charCodeAt(index);
        hash = Math.imul(hash, 16777619);
    }

    return hash >>> 0;
}
