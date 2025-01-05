import { createDropdownList } from '../scripts/search.js';
import { setupDOM } from './utils.js'
import { expect, describe, it, beforeEach, afterEach, vi } from 'vitest';



describe('createDropdownList', () => {
    let searchInput, dropdownList;

    beforeEach(() => {
        setupDOM();
        createDropdownList();
        searchInput = document.getElementById('dropdown').querySelector('input');
        dropdownList = document.getElementById('dropdown').querySelector('ul');
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
        expect(searchInput.value).toBe('ay$');

        listItems[1].dispatchEvent(new MouseEvent('mouseover'));
        expect(searchInput.value).toBe('cul');

        listItems[2].dispatchEvent(new MouseEvent('mouseover'));
        expect(searchInput.value).toBe('^saint');


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
});

