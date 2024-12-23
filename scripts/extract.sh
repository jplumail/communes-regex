#!/bin/sh

# Nom de l'archive
ARCHIVE="data/ADMIN-EXPRESS_3-2__SHP_LAMB93_FXX_2024-12-18.7z"

# Dossier de sortie
OUTPUT_DIR="data"

# Dossier contenant les fichiers shapefiles
SHAPEFILES_DIR="ADMIN-EXPRESS_3-2__SHP_LAMB93_FXX_2024-12-18/ADMIN-EXPRESS/1_DONNEES_LIVRAISON_2024-12-00244/ADE_3-2_SHP_LAMB93_FXX-ED2024-12-18"

# Liste des fichiers à extraire
FILES=(
    "REGION.shp"
    "REGION.shx"
    "REGION.prj"
    "REGION.dbf"
    "REGION.cpg"
    "COMMUNE.shp"
    "COMMUNE.shx"
    "COMMUNE.prj"
    "COMMUNE.dbf"
    "COMMUNE.cpg"
)

# Commande pour extraire les fichiers spécifiques dans le dossier de sortie sans récupérer tous les dossiers parents
7zz x $ARCHIVE -o$OUTPUT_DIR $(printf " $SHAPEFILES_DIR/%s" "${FILES[@]}")

# Fin du script