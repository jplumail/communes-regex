// examples of regex to search for
// they help the user to understand how to use regex
export const villesRegexExamples = [
    { regex: '^Rouen$', description: "Exactement 'Rouen'" },
    { regex: '^R...n$', description: "Commence par R, se termine par n et contient 5 lettres" },
    { regex: 'ouen$', description: "Se termine par 'ouen'" },
    { regex: '^Rou', description: "Commence par 'Rou'" },
    { regex: '^.{3}$', description: "Ville de 3 lettres" },
    { regex: 'y{2}', description: "Contient 2 y consécutifs" },
    { regex: '^(le|la|les) \\w+ \\w+ \\w+$', description: "'le' ou 'la' ou 'les' suivi de 3 mots" },
    { regex: '(a|e|i|o|u)\\1', description: "Comporte 2 voyelles identiques consécutives" },
    { regex: '^a.*a$', description: "Commence et finit par la lettre a" },
];

/**
 * @param {NodeListOf<SVGElement>} communesSvg 
 */
export function createDropdownList(communesSvg) {
    const dropdown = document.getElementById('dropdown');
    const searchInput = dropdown.querySelector('input');
    const dropdownList = dropdown.querySelector('ul');
    const dropdownButton = dropdown.querySelector('button');

    searchInput.addEventListener('input', (e) => {
        handleSearch(e.target.value, communesSvg);
        updateURL(e.target.value);
    });

    populateDropdownList(dropdownList);
    setupDropdownButton(dropdownButton, dropdown);
    setupOutsideClickListener(dropdown);
    initializeSearch();
}

function populateDropdownList(dropdownList) {
    villesRegexExamples.forEach(opt => {
        const li = createDropdownItem(opt);
        dropdownList.appendChild(li);
    });
}

function createDropdownItem(opt, searchInput) {
    const li = document.createElement('li');
    
    const regexSpan = document.createElement('span');
    regexSpan.textContent = opt.regex;
    regexSpan.className = 'regex';
    li.appendChild(regexSpan);

    const descriptionSpan = document.createElement('span');
    descriptionSpan.textContent = `${opt.description}`;
    descriptionSpan.className = 'description';
    descriptionSpan.title = opt.description;
    li.appendChild(descriptionSpan);

    li.addEventListener('mouseover', () => {
        searchInputValue(opt.regex);
    });
    li.addEventListener('click', toggleDropdown);

    return li;
}

function searchInputValue(value) {
    const searchInput = document.querySelector('input');
    searchInput.value = value;
    const inputEvent = new Event('input', {
        bubbles: true,
        cancelable: true
    });
    searchInput.dispatchEvent(inputEvent);
}

function setupDropdownButton(dropdownButton, dropdown) {
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
    url.searchParams.set('regex', value);
    window.history.replaceState({}, '', url);
}

function initializeSearch() {
    // Initialize search input from URL
    const urlParams = new URLSearchParams(window.location.search);
    const regexParam = urlParams.get('regex');
    if (regexParam) {
        searchInputValue(regexParam);
    }
}

/**
 * 
 * @param {string} value regex value
 * @param {NodeListOf<SVGElement>} communesSvg 
 */
function handleSearch(value, communesSvg) {
    try {
        if (value.length > 0) {
            const regex = new RegExp(value, 'i');
            communesSvg.forEach(point => {
                const name = point.querySelector('.label').textContent;
                if (name && regex.test(name)) {
                    point.classList.add('visible');
                } else {
                    point.classList.remove('visible');
                }
            });
        } else {
            communesSvg.forEach(point => {
                point.classList.remove('visible');
            });
        }
    } catch (error) {
        // Ignore invalid regex
    }
}
