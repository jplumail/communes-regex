export function setupDOM() {
    const app = document.createElement('div');
    app.id = 'app';
    
    const dropdown = document.createElement('div');
    dropdown.id = 'dropdown';

    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.placeholder = 'Entrez un regex';
    dropdown.appendChild(searchInput);

    const dropdownList = document.createElement('ul');
    dropdown.appendChild(dropdownList);
    app.appendChild(dropdown);

    const map = document.createElement('svg');
    map.id = 'map';
    app.appendChild(map);

    document.body.appendChild(app)
}
