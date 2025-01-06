// examples of regex to search for
// they help the user to understand how to use regex
export const villesRegexExamples = [
    { regex: '^Lyon$', description: "Exactement 'Lyon'" },
    { regex: '^L..n$', description: "Commence par L, se termine par n et contient 4 lettres" },
    { regex: 'yon$', description: "Se termine par 'ay'" },
    { regex: '^Ly', description: "Commence par 'Ly'" },
    { regex: '^.{3}$', description: "Ville de 3 lettres" },
    { regex: 'y{2}', description: "Contient 2 y consécutifs" },
    { regex: '^(le|la|les) \\w+ \\w+ \\w+$', description: "'le' ou 'la' ou 'les' suivi de 3 mots" },
    { regex: '(a|e|i|o|u)\\1', description: "Comporte 2 voyelles identiques consécutives" },
    { regex: '^a.*a$', description: "Commence et finit par la lettre a" },
];

/**
 * 
 * @param {NodeListOf<SVGElement>} points 
 */
export function createDropdownList(points) {
    const dropdown = document.getElementById('dropdown');
    const searchInput = dropdown.querySelector('input');
    const dropdownList = dropdown.querySelector('ul');
    const dropdownButton = dropdown.querySelector('button');

    searchInput.addEventListener('input', (e) => handleSearch(e.target.value, points));

    // populate dropdownList
    villesRegexExamples.forEach(opt => {
        const li = document.createElement('li');
        
        const regexSpan = document.createElement('span');
        regexSpan.textContent = opt.regex;
        regexSpan.className = 'regex';
        li.appendChild(regexSpan);

        const descriptionSpan = document.createElement('span');
        descriptionSpan.textContent = `${opt.description}`;
        descriptionSpan.className = 'description';
        descriptionSpan.title = opt.description; // Add this line
        li.appendChild(descriptionSpan);

        li.addEventListener('mouseover', () => {
            searchInput.value = opt.regex;

            const inputEvent = new Event('input', {
                bubbles: true, // Let the event bubble up the DOM
                cancelable: true // Allow event to be canceled
            });
            searchInput.dispatchEvent(inputEvent);
        });
        li.addEventListener('click', toggleDropdown)
        dropdownList.appendChild(li);
    });

    // Show/Hide dropdown
    dropdownButton.addEventListener('click', toggleDropdown);

    // Hide dropdown when clicking outside
    document.addEventListener('click', (event) => {
        if (isDropdownActive() &&!event.composedPath().includes(dropdown)) {
            toggleDropdown();
        }
    });

}

function isDropdownActive() {
    const dropdown = document.getElementById('dropdown');
    return dropdown.classList.contains('active');
}

function toggleDropdown() {
    const dropdown = document.getElementById('dropdown');
    const active = dropdown.classList.toggle('active');

    const dropdownButton = dropdown.querySelector('button');
    dropdownButton.ariaExpanded = active;
}

/**
 * 
 * @param {string} value regex value
 * @param {NodeListOf<SVGElement>} points 
 */
function handleSearch(value, points) {
    try {
        if (value.length > 0) {
            const regex = new RegExp(value, 'i');
            points.forEach(point => {
                const name = point.dataset.name;
                if (name && regex.test(name)) {
                    point.classList.add('visible');
                } else {
                    point.classList.remove('visible');
                }
            });
        } else {
            points.forEach(point => {
                point.classList.remove('visible');
            });
        }
    } catch (error) {
        // Ignore invalid regex
    }
}
