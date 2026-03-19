#!/bin/sh

set -eu

output_dir="data"
archive="$(
    find "$output_dir" -maxdepth 1 -type f -name 'ADMIN-EXPRESS_*__GPKG_LAMB93_FXX_*.7z' \
    | sort \
    | tail -n 1
)"

if [ -z "$archive" ]; then
    echo "No ADMIN-EXPRESS archive found in $output_dir. Run ./scripts/download.sh first." >&2
    exit 1
fi

7zz t -bso0 "$archive" >/dev/null
7zz x -aoa -y "$archive" "-o$output_dir"

echo "Extracted $archive"
