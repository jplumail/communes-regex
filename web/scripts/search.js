const regexExamples = ['ay$', 'cul', '^saint'];

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
    regexExamples.forEach(opt => {
        const li = document.createElement('li');
        li.textContent = opt;
        li.addEventListener('mouseover', () => {
            searchInput.value = opt;

            const inputEvent = new Event('input', {
                bubbles: true, // Let the event bubble up the DOM
                cancelable: true // Allow event to be canceled
            });
            searchInput.dispatchEvent(inputEvent);
        });
        li.addEventListener('click', () => {
            dropdownList.style.display = 'none'; // Hide after selection
        })
        dropdownList.appendChild(li);
    });

    // Show/Hide dropdown
    dropdownButton.addEventListener('click', () => {
        dropdown.classList.toggle('active');
    });

    // Hide dropdown when clicking outside
    document.addEventListener('click', (event) => {
        if (!event.composedPath().includes(dropdown)) {
            dropdown.classList.toggle('active');
        }
    });

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
