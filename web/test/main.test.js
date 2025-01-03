import { init, handleSearch } from '../scripts/main.js';
import { expect, describe, it, vi, beforeEach, afterEach } from 'vitest';
import * as utils from '../scripts/utils.js'

vi.mock('../scripts/france.js', () => ({
  loadFrance: vi.fn().mockResolvedValue('<polygon points="0,0 10,10"></polygon>'),
}));

vi.mock('../scripts/villes.js', () => ({
  loadVilles: vi.fn().mockResolvedValue('<g class="pointGroup" data-name="Testville"></g>'),
}));

vi.mock('../scripts/dropdown.js', () => ({
  createDropdownList: vi.fn(), // Mock the function
}));

const mockDims = { minX: 0, minY: 0, maxX: 100, maxY: 100 };


describe('main.js', () => {
  let map;
  let searchInput;

  beforeEach(() => {
    document.body.innerHTML = `
          <div id="app">
              <div class="custom-dropdown">
                  <input type="text" id="searchInput" placeholder="Entrez un regex">
                  <ul id="dropdown-list"></ul>
              </div>
              <svg xmlns="http://www.w3.org/2000/svg" version="1.1" id="map">
              </svg>
          </div>
        `;
    map = document.getElementById('map');
    searchInput = document.getElementById('searchInput');
    vi.spyOn(utils, 'dims', 'get').mockReturnValue(mockDims)
    vi.spyOn(utils, 'scale', 'get').mockReturnValue(5)
  });

  afterEach(() => {
    vi.clearAllMocks();
    document.body.innerHTML = '';
  });

  it('should initialize the map with correct viewBox', async () => {
    await init();

    expect(map.getAttribute('viewBox')).toBe('0 0 500 500');
  });


  it('should load France and cities data', async () => {
    await init();

    expect(map.innerHTML).toContain('<polygon points="0,0 10,10"></polygon>');
    expect(map.innerHTML).toContain('<g class="pointGroup" data-name="Testville"></g>');
  });


  it('should add event listeners', async () => {
    const mapSpy = vi.spyOn(map, 'querySelectorAll');
    mapSpy.mockReturnValue([
      { addEventListener: vi.fn(), parentElement: map }
    ]);
    const addEventListenerSpy = vi.spyOn(searchInput, 'addEventListener'); // Spy *before* init

    await init();
    expect(addEventListenerSpy).toHaveBeenCalledWith('input', handleSearch);
    expect(mapSpy).toHaveBeenCalledWith('g');
  });



  it('should filter cities based on search input', () => {
    map.innerHTML = `
            <g class="pointGroup" data-name="Ville"></g>
            <g class="pointGroup" data-name="Test"></g>
        `;

    handleSearch({ target: { value: 'ville' } });
    const points = document.querySelectorAll('.pointGroup');
    console.log(map.children)
    expect(points[0].classList.contains('visible')).toBe(true);
    expect(points[1].classList.contains('visible')).toBe(false);


    handleSearch({ target: { value: '' } });
    expect(points[0].classList.contains('visible')).toBe(false);

  });

  it('should handle invalid regex', () => {

    handleSearch({ target: { value: '[' } });  // Invalid regex
    const points = document.querySelectorAll('.pointGroup');
    // No error should be thrown
  })
});
