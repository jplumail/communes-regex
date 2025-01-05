import { init } from '../scripts/main.js';
import { expect, describe, it, vi, beforeEach, afterEach } from 'vitest';
import * as utils from '../scripts/utils.js'
import { setupDOM } from './utils.js';

vi.mock('../scripts/france.js', () => ({
  loadFrance: vi.fn().mockResolvedValue(document.createElementNS("http://www.w3.org/2000/svg", "polygon")),
}));

vi.mock('../scripts/villes.js', () => ({
  loadVilles: vi.fn().mockResolvedValue(document.createElementNS("http://www.w3.org/2000/svg", "g")),
}));

vi.mock('../scripts/search.js', () => ({
  createDropdownList: vi.fn(), // Mock the function
  handleSearch: vi.fn(),
}));

const mockDims = { minX: 0, minY: 0, maxX: 100, maxY: 100 };


describe('main.js', () => {
  let map;
  let searchInput;

  beforeEach(() => {
    setupDOM()
    map = document.getElementById('map');
    searchInput = document.getElementById('dropdown').querySelector('input');
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
    
    expect(map.children.length).toBeGreaterThan(0);
  });
});
