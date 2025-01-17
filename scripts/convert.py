# /// script
# requires-python = ">=3.12"
# dependencies = ["geopandas"]
# ///

import geopandas as gpd

data_dir = "data"
target_dir = "web/data"

# Path to the shapefile
region_shapefile_path = f'{data_dir}/ADMIN-EXPRESS_3-2__SHP_LAMB93_FXX_2024-12-18/ADMIN-EXPRESS/1_DONNEES_LIVRAISON_2024-12-00244/ADE_3-2_SHP_LAMB93_FXX-ED2024-12-18/REGION.shp'

# Load the shapefile
gdf = gpd.read_file(region_shapefile_path)

# Simplify the geometry
tolerance = 1_000  # meters
gdf['geometry'] = gdf['geometry'].simplify(tolerance=tolerance, preserve_topology=True)

# Print the first few rows of the GeoDataFrame
gdf.to_file(f'{target_dir}/regions_map.json', driver='GeoJSON')

communes_shapefile_path = f'{data_dir}/ADMIN-EXPRESS_3-2__SHP_LAMB93_FXX_2024-12-18/ADMIN-EXPRESS/1_DONNEES_LIVRAISON_2024-12-00244/ADE_3-2_SHP_LAMB93_FXX-ED2024-12-18/COMMUNE.shp'
gdf = gpd.read_file(communes_shapefile_path, columns=["ID", "NOM", "NOM_M", "INSEE_COM", "STATUT", "POPULATION", "INSEE_CAN", "INSEE_ARR", "INSEE_DEP", "INSEE_REG", "SIREN_EPCI"])

# geometry from polygon to point (centroid)
gdf['geometry'] = gdf['geometry'].centroid

# keep only ID, NOM
gdf = gdf[["ID", "NOM", "geometry"]]

# To GeoJSON
gdf.to_file(f'{target_dir}/communes.json', driver='GeoJSON')
