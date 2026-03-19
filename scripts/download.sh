#!/bin/sh

set -eu

catalog_url="https://geoservices.ign.fr/telechargement-api/ADMIN-EXPRESS"
output_dir="data"

mkdir -p "$output_dir"

url="$(
    curl --retry 5 --retry-all-errors --retry-delay 5 --connect-timeout 30 -fsSL "$catalog_url" \
    | rg -o 'https://data\.geopf\.fr/telechargement/download/ADMIN-EXPRESS/ADMIN-EXPRESS_[^"]+__GPKG_LAMB93_FXX_[0-9-]+/ADMIN-EXPRESS_[^"]+__GPKG_LAMB93_FXX_[0-9-]+\.7z' \
    | sort -u \
    | tail -n 1
)"

if [ -z "$url" ]; then
    echo "Unable to find the latest ADMIN-EXPRESS FXX archive." >&2
    exit 1
fi

output_file="$output_dir/$(basename "$url")"

curl --retry 5 --retry-all-errors --retry-delay 5 --connect-timeout 30 -fL "$url" -o "$output_file"
7zz t -bso0 "$output_file" >/dev/null

echo "Downloaded $output_file"
