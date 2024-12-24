# /// script
# requires-python = ">=3.12"
# dependencies = ["geopandas"]
# ///

import geopandas as gpd

# Path to the shapefile
shapefile_path = 'data/ADMIN-EXPRESS_3-2__SHP_LAMB93_FXX_2024-12-18/ADMIN-EXPRESS/1_DONNEES_LIVRAISON_2024-12-00244/ADE_3-2_SHP_LAMB93_FXX-ED2024-12-18/REGION.shp'

# Load the shapefile
gdf = gpd.read_file(shapefile_path)

# Simplify the geometry, 10km tolerance
tolerance = 1_000
gdf['geometry'] = gdf['geometry'].simplify(tolerance=tolerance, preserve_topology=True)

# Print the first few rows of the GeoDataFrame
gdf.to_file('public/regions_map.geojson', driver='GeoJSON')