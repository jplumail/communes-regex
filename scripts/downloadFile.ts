import { createWriteStream, existsSync, mkdirSync, unlink } from 'fs';
import { get } from 'https';
import { join } from 'path';

const url = 'https://data.geopf.fr/telechargement/download/ADMIN-EXPRESS/ADMIN-EXPRESS_3-2__SHP_LAMB93_FXX_2024-12-18/ADMIN-EXPRESS_3-2__SHP_LAMB93_FXX_2024-12-18.7z';
const outputDir = 'data';
const outputFile = join(outputDir, 'ADMIN-EXPRESS_3-2__SHP_LAMB93_FXX_2024-12-18.7z');

if (!existsSync(outputDir)) {
    mkdirSync(outputDir);
}

const file = createWriteStream(outputFile);

get(url, (response) => {
    response.pipe(file);
    file.on('finish', () => {
        file.close();
        console.log('Download completed.');
    });
}).on('error', (err) => {
    unlink(outputFile, () => {});
    console.error('Error downloading the file:', err.message);
});
