#!/bin/sh

set -eu

repo_root="$(CDPATH= cd -- "$(dirname "$0")/.." && pwd)"
script_path="$repo_root/scripts/latest_admin_express.sh"
fixtures_dir="$repo_root/scripts/testdata"
tmp_dir="$(mktemp -d)"

cleanup() {
    if [ -n "${server_pid:-}" ]; then
        kill "$server_pid" >/dev/null 2>&1 || true
        wait "$server_pid" 2>/dev/null || true
    fi

    rm -rf "$tmp_dir"
}

trap cleanup EXIT INT TERM HUP

fail() {
    echo "$1" >&2
    exit 1
}

assert_eq() {
    expected="$1"
    actual="$2"
    label="$3"

    if [ "$actual" != "$expected" ]; then
        fail "$label: expected '$expected', got '$actual'"
    fi
}

port="$(python3 -c 'import socket; s = socket.socket(); s.bind(("127.0.0.1", 0)); print(s.getsockname()[1]); s.close()')"
base_url="http://127.0.0.1:$port"

mkdir -p "$tmp_dir/telechargement/resource/ADMIN-EXPRESS"

sed "s|__BASE_URL__|$base_url|g" "$fixtures_dir/catalog.xml.tmpl" > "$tmp_dir/catalog.xml"
sed "s|__BASE_URL__|$base_url|g" "$fixtures_dir/detail.xml.tmpl" > "$tmp_dir/telechargement/resource/ADMIN-EXPRESS/ADMIN-EXPRESS_4-0__GPKG_LAMB93_FXX_2026-03-24"
cp "$fixtures_dir/empty-catalog.xml" "$tmp_dir/empty-catalog.xml"

python3 -m http.server "$port" --bind 127.0.0.1 -d "$tmp_dir" >/dev/null 2>&1 &
server_pid="$!"

server_ready=0
for _ in 1 2 3 4 5 6 7 8 9 10; do
    if curl -fsS "$base_url/catalog.xml" >/dev/null 2>&1; then
        server_ready=1
        break
    fi
    sleep 1
done

if [ "$server_ready" -ne 1 ]; then
    fail "Fixture HTTP server did not start."
fi

expected_url="$base_url/telechargement/download/ADMIN-EXPRESS/ADMIN-EXPRESS_4-0__GPKG_LAMB93_FXX_2026-03-24/ADMIN-EXPRESS_4-0__GPKG_LAMB93_FXX_2026-03-24.7z"

url="$(ADMIN_EXPRESS_RESOURCE_URL="$base_url/catalog.xml" sh "$script_path" url)"
assert_eq "$expected_url" "$url" "url output"

version="$(ADMIN_EXPRESS_RESOURCE_URL="$base_url/catalog.xml" sh "$script_path" version)"
assert_eq "2026-03-24" "$version" "version output"

github_output="$(ADMIN_EXPRESS_RESOURCE_URL="$base_url/catalog.xml" sh "$script_path" github-output)"
expected_github_output="latest_url=$expected_url
latest_version=2026-03-24"
assert_eq "$expected_github_output" "$github_output" "github-output"

if ADMIN_EXPRESS_RESOURCE_URL="$base_url/empty-catalog.xml" sh "$script_path" url >"$tmp_dir/no-match.out" 2>"$tmp_dir/no-match.err"; then
    fail "expected latest_admin_express.sh to fail on an empty catalog"
fi

error_output="$(tr -d '\n' < "$tmp_dir/no-match.err")"
assert_eq "Unable to find the latest ADMIN-EXPRESS FXX resource." "$error_output" "empty catalog error"

echo "latest_admin_express.sh tests passed"
