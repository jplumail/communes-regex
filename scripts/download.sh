#!/bin/sh

set -eu

output_dir="data"

mkdir -p "$output_dir"

url="${ADMIN_EXPRESS_URL:-$(sh ./scripts/latest_admin_express.sh url)}"

output_file="$output_dir/$(basename "$url")"

curl --retry 5 --retry-all-errors --retry-delay 5 --connect-timeout 30 -fL "$url" -o "$output_file"
7zz t -bso0 "$output_file" >/dev/null

echo "Downloaded $output_file"
