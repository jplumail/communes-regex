#!/bin/sh

url="https://data.geopf.fr/telechargement/download/ADMIN-EXPRESS/ADMIN-EXPRESS_3-2__SHP_LAMB93_FXX_2024-12-18/ADMIN-EXPRESS_3-2__SHP_LAMB93_FXX_2024-12-18.7z"
output_dir="data"
output_file="$output_dir/ADMIN-EXPRESS_3-2__SHP_LAMB93_FXX_2024-12-18.7z"

# Créer le répertoire de sortie s'il n'existe pas
if [ ! -d "$output_dir" ]; then
    mkdir -p "$output_dir"
fi

# Télécharger le fichier
curl -o "$output_file" "$url"
if [ $? -eq 0 ]; then
    echo "Download completed."
else
    echo "Error downloading the file."
    rm -f "$output_file"
fi