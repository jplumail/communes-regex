#!/bin/sh

set -eu

catalog_url="https://geoservices.ign.fr/telechargement-api/ADMIN-EXPRESS"

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

version="$(printf '%s\n' "$url" | sed -E 's|.*_([0-9]{4}-[0-9]{2}-[0-9]{2})\.7z$|\1|')"

case "${1:-url}" in
    url)
        printf '%s\n' "$url"
        ;;
    version)
        printf '%s\n' "$version"
        ;;
    github-output)
        printf 'latest_url=%s\n' "$url"
        printf 'latest_version=%s\n' "$version"
        ;;
    *)
        echo "Usage: $0 [url|version|github-output]" >&2
        exit 1
        ;;
esac
