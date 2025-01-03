const regexExamples = ['ay$', 'cul', '^saint'];

export function createDropdownList() {
    const searchInput = document.getElementById('searchInput');
    const dropdownList = document.getElementById('dropdown-list');

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
    searchInput.addEventListener('focus', () => {
        dropdownList.style.display = 'block';
    });

    // Hide dropdown when clicking outside
    document.addEventListener('click', (event) => {
        if (!event.composedPath().includes(searchInput) && !event.composedPath().includes(dropdownList)) {
            dropdownList.style.display = 'none';
        }
    });

    dropdownList.style.display = 'none'; // Start hidden
}
