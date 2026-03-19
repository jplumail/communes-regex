# /// script
# requires-python = ">=3.12"
# dependencies = ["geopandas"]
# ///

import geopandas as gpd
from pathlib import Path

data_dir = "data"
target_dir = "web/data"

data_root = Path(data_dir)
target_root = Path(target_dir)


def latest_path(pattern: str) -> Path | None:
    matches = sorted(data_root.glob(pattern))
    return matches[-1] if matches else None


gpkg_path = latest_path("**/*.gpkg")

if gpkg_path is None:
    raise FileNotFoundError(
        "No extracted ADMIN-EXPRESS GeoPackage found in data/. "
        "Run ./scripts/download.sh then ./scripts/extract.sh first."
    )

regions = gpd.read_file(gpkg_path, layer="region")
regions["geometry"] = regions["geometry"].simplify(
    tolerance=1_000,
    preserve_topology=True,
)
regions.to_file(target_root / "regions_map.json", driver="GeoJSON")

communes = gpd.read_file(
    gpkg_path,
    layer="commune",
    columns=["cleabs", "nom_officiel"],
)
communes["geometry"] = communes["geometry"].centroid
communes = communes.rename(columns={"cleabs": "ID", "nom_officiel": "NOM"})
communes = communes[["ID", "NOM", "geometry"]]
communes.to_file(target_root / "communes.json", driver="GeoJSON")
