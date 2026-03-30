#!/bin/sh

set -eu

catalog_url="${ADMIN_EXPRESS_RESOURCE_URL:-https://data.geopf.fr/telechargement/resource/ADMIN-EXPRESS}"
resource_url_pattern='https?://[^"]+/telechargement/resource/ADMIN-EXPRESS/ADMIN-EXPRESS_[^"]+__GPKG_LAMB93_FXX_[0-9-]+'
download_url_pattern='https?://[^"]+/telechargement/download/ADMIN-EXPRESS/ADMIN-EXPRESS_[^"]+__GPKG_LAMB93_FXX_[0-9-]+/ADMIN-EXPRESS_[^"]+__GPKG_LAMB93_FXX_[0-9-]+\.7z'

extract_matches() {
    pattern="$1"

    if command -v rg >/dev/null 2>&1; then
        rg -o "$pattern"
    else
        grep -Eo "$pattern"
    fi
}

catalog_xml="$(curl --retry 5 --retry-all-errors --retry-delay 5 --connect-timeout 30 -fsSL "$catalog_url")"

resource_url="$(
    printf '%s\n' "$catalog_xml" \
    | extract_matches "$resource_url_pattern" \
    | sort -u \
    | tail -n 1
)"

if [ -z "$resource_url" ]; then
    echo "Unable to find the latest ADMIN-EXPRESS FXX resource." >&2
    exit 1
fi

resource_xml="$(curl --retry 5 --retry-all-errors --retry-delay 5 --connect-timeout 30 -fsSL "$resource_url")"

url="$(
    printf '%s\n' "$resource_xml" \
    | extract_matches "$download_url_pattern" \
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
