import { createProgressiveSearchRenderer } from './progressive-search-renderer.js';
import { villesRegexExamples } from './search-examples.js';

export { villesRegexExamples };

/**
 * @param {NodeListOf<SVGElement>} communesSvg 
 */
export function createDropdownList(communesSvg) {
    const dropdown = document.getElementById('dropdown');
    const searchInput = dropdown.querySelector('input');
    const dropdownList = dropdown.querySelector('ul');
    const dropdownButton = dropdown.querySelector('button');
    const searchRenderer = createProgressiveSearchRenderer(communesSvg);

    searchInput.addEventListener('input', (event) => {
        searchRenderer.search(event.target.value);
        updateURL(event.target.value);
    });

    populateDropdownList(dropdownList);
    setupDropdownButton(dropdownButton);
    setupOutsideClickListener(dropdown);
    initializeSearch();
}

function populateDropdownList(dropdownList) {
    villesRegexExamples.forEach(opt => {
        dropdownList.appendChild(createDropdownItem(opt));
    });
}

function createDropdownItem(opt) {
    const li = document.createElement('li');
    li.appendChild(createSpan(opt.regex, 'regex'));
    li.appendChild(createSpan(opt.description, 'description'));

    li.addEventListener('mouseover', () => {
        searchInputValue(opt.regex);
    });
    li.addEventListener('click', toggleDropdown);

    return li;
}

function createSpan(text, className) {
    const span = document.createElement('span');
    span.textContent = text;
    span.className = className;

    if (className === 'description') {
        span.title = text;
    }

    return span;
}

function searchInputValue(value) {
    const searchInput = document.querySelector('input');
    searchInput.value = value;
    searchInput.dispatchEvent(new Event('input', {
        bubbles: true,
        cancelable: true,
    }));
}

function setupDropdownButton(dropdownButton) {
    dropdownButton.addEventListener('click', toggleDropdown);
}

function setupOutsideClickListener(dropdown) {
    document.addEventListener('click', (event) => {
        if (isDropdownActive(dropdown) && !event.composedPath().includes(dropdown)) {
            toggleDropdown();
        }
    });
}

function isDropdownActive(dropdown) {
    return dropdown.classList.contains('active');
}

function toggleDropdown() {
    const dropdown = document.getElementById('dropdown');
    const active = dropdown.classList.toggle('active');

    const dropdownButton = dropdown.querySelector('button');
    dropdownButton.ariaExpanded = active;
}

function updateURL(value) {
    const url = new URL(window.location);
    const currentValue = url.searchParams.get('regex') ?? '';
    if (currentValue === value) {
        return;
    }

    if (value.length > 0) {
        url.searchParams.set('regex', value);
    } else {
        url.searchParams.delete('regex');
    }
    window.history.replaceState({}, '', url);
}

function initializeSearch() {
    const urlParams = new URLSearchParams(window.location.search);
    const regexParam = urlParams.get('regex');
    if (regexParam) {
        searchInputValue(regexParam);
    }
}
