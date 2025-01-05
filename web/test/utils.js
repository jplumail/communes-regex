export function setupDOM() {
    const app = document.createElement('div');
    app.id = 'app';
    
    const dropdown = document.createElement('div');
    dropdown.id = 'dropdown';

    const inputGroup = document.createElement('div');
    inputGroup.className = 'input-group';

    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.placeholder = 'Entrez un regex';
    inputGroup.appendChild(searchInput);

    const dropdownButton = document.createElement('button');
    dropdownButton.className = 'toggle';
    inputGroup.appendChild(dropdownButton);

    dropdown.appendChild(inputGroup);

    const dropdownList = document.createElement('ul');
    dropdown.appendChild(dropdownList);
    app.appendChild(dropdown);

    const map = document.createElement('svg');
    map.id = 'map';
    app.appendChild(map);

    document.body.appendChild(app);
}
