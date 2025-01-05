import { createDropdownList } from '../scripts/search.js';
import { createVille } from '../scripts/villes.js';
import { setupDOM } from './utils.js'
import { expect, describe, it, beforeEach, afterEach, vi } from 'vitest';


vi.mock('../scripts/villes.js', () => ({
    createVille: vi.fn((name) => {
        const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        g.dataset.name = name;
        g.classList.add('pointGroup');
        return g;
    }),
}));



describe('createDropdownList', () => {
    /** @type {HTMLDivElement} */
    let dropdown;

    /** @type {HTMLInputElement} */
    let searchInput;

    /** @type {HTMLUListElement} */
    let dropdownList;
    
    /** @type {SVGElement} */
    let map;

    /** @type {HTMLButtonElement} */
    let button;

    let villeA;
    let villeB;

    beforeEach(() => {
        setupDOM();
        dropdown = document.getElementById('dropdown');
        searchInput = dropdown.querySelector('input');
        dropdownList = dropdown.querySelector('ul');
        button = dropdown.querySelector('button');
        map = document.getElementById('map');
        
        // append 2 cities to map
        villeA = createVille('ville a');
        villeB = createVille('ville b');
        map.appendChild(villeA);
        map.appendChild(villeB);

        const points = document.querySelectorAll('.pointGroup');
        createDropdownList(points);
    });

    afterEach(() => {
    });


    it('should create list items for each example', () => {
        const listItems = dropdownList.querySelectorAll('li');
        expect(listItems.length).toBe(3); // Based on the regexExamples array
    });

    it('should update input value on mouseover', () => {
        const listItems = dropdownList.querySelectorAll('li');
        listItems[0].dispatchEvent(new MouseEvent('mouseover'));
        expect(searchInput.value).toBe(listItems[0].textContent);

        listItems[1].dispatchEvent(new MouseEvent('mouseover'));
        expect(searchInput.value).toBe(listItems[1].textContent);

        listItems[2].dispatchEvent(new MouseEvent('mouseover'));
        expect(searchInput.value).toBe(listItems[2].textContent);


    });

    it('should trigger input event on mouseover', () => {
        const listItem = dropdownList.querySelector('li');
        const spy = vi.spyOn(searchInput, 'dispatchEvent');
        listItem.dispatchEvent(new MouseEvent('mouseover'));
        expect(spy).toHaveBeenCalledWith(expect.any(Event));
        expect(spy.mock.calls[0][0].type).toBe('input');
        vi.restoreAllMocks();

    });

    it('should hide dropdown on click outside', () => {
        button.dispatchEvent(new MouseEvent('click'));
        expect(dropdown.classList.contains('active')).toBe(true);

        // Click outside the dropdown and input
        document.body.click();
        expect(dropdown.classList.contains('active')).toBe(false);
    });

    it('should hide dropdown on item selection', () => {
        // Show it first
        button.dispatchEvent(new MouseEvent('click'));
        expect(dropdown.classList.contains('active')).toBe(true);

        const listItem = dropdownList.querySelector('li');
        listItem.dispatchEvent(new MouseEvent('click'));
        expect(dropdown.classList.contains('active')).toBe(false);
    });

    it('should filter cities based on search input', () => {
        searchInput.dispatchEvent(new Event('focus'));
        searchInput.value = 'a';
        searchInput.dispatchEvent(new Event('input'));

        expect(villeA.classList.contains('visible')).toBe(true);
        expect(villeB.classList.contains('visible')).toBe(false);


        searchInput.value = '';
        searchInput.dispatchEvent(new Event('input'));
        expect(villeA.classList.contains('visible')).toBe(false);
        expect(villeB.classList.contains('visible')).toBe(false);

    });

    it('should handle invalid regex', () => {
        searchInput.value = '[a'  // Invalid regex
        searchInput.dispatchEvent(new Event('input'));
        // No error should be thrown
    })
});

