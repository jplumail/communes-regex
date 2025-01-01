## Build

```bash
./download.sh
./extract.sh
uv run scripts/convert.py
```

## Run

```bash
cd web
uv run python -m http.server
```
