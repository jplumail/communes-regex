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
    /** @type {HTMLInputElement} */
    let searchInput;

    /** @type {HTMLUListElement} */
    let dropdownList;
    
    /** @type {SVGElement} */
    let map;

    let villeA;
    let villeB;

    beforeEach(() => {
        setupDOM();
        searchInput = document.getElementById('dropdown').querySelector('input');
        dropdownList = document.getElementById('dropdown').querySelector('ul');
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

    it('should show dropdown on input focus', () => {
        searchInput.dispatchEvent(new Event('focus'));
        expect(dropdownList.style.display).toBe('block');
    });

    it('should hide dropdown on click outside', () => {
        searchInput.dispatchEvent(new Event('focus')); // Show it first
        expect(dropdownList.style.display).toBe('block'); // Verify it's shown


        // Click outside the dropdown and input
        document.body.click();
        expect(dropdownList.style.display).toBe('none');
    });

    it('should not hide dropdown on click inside', () => {
        searchInput.dispatchEvent(new Event('focus')); // Show it first
        searchInput.dispatchEvent(new MouseEvent('click'));
        expect(dropdownList.style.display).toBe('block');

        const listItem = dropdownList.querySelector('li');
        listItem.dispatchEvent(new MouseEvent('click'));
        expect(dropdownList.style.display).toBe('none');
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
        const points = document.querySelectorAll('.pointGroup');
        // No error should be thrown
    })
});

