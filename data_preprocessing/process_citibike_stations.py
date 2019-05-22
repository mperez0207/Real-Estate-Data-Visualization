"""
https://docs.microsoft.com/en-us/bingmaps/rest-services/locations/find-a-location-by-point

"""

import json
import csv
import requests

def define_manhattan_neighborhoods(filename):
    manhattan_regions = {"Lower Manhattan":[], "Midtown":[], "Upper Manhattan":[], "New York":[]}

    # Create dict of Manhattan neighborhoods
    with open(filename, "r") as csv_file:
        csv_reader = csv.reader(csv_file)
        for line in csv_reader:
            neighborhood = line[0]
            region = line[1]

            if region in manhattan_regions and neighborhood not in manhattan_regions[region]:
                manhattan_regions[region].append(neighborhood.lower())

    return manhattan_regions

def main():
    all_stations_json = "citibike_stations.json"
    manhattan_regions_csv = "manhattan_localities.csv"
    bing_maps_key = "YOUR_KEY_HERE"

    bing_maps_params = {"key":bing_maps_key}
    bing_maps_url = "http://dev.virtualearth.net/REST/v1/Locations/"

    manhattan_regions = define_manhattan_neighborhoods(manhattan_regions_csv)
    stations_by_region = {"Lower Manhattan":[], "Midtown":[], "Upper Manhattan":[], "New York":[]}
    
    with open(all_stations_json, "r") as json_file:
        citibike_data = json.load(json_file)["stationBeanList"]

        for station in citibike_data:
            
            station_name = station["stationName"]
            available_bikes = station["availableBikes"]
            latitude = station["latitude"]
            longitude = station["longitude"]
            
            # Make API call to BingMaps using coordinates to determine locality
            bing_maps_url = f"http://dev.virtualearth.net/REST/v1/Locations/{latitude},{longitude}"
            response = requests.get(bing_maps_url, params=bing_maps_params).json()

            locality = response["resourceSets"][0]["resources"][0]["address"]["locality"].lower()
            print(locality)

            # Check if locality exists in our dict of Manhattan neighborhoods
            # If it exists, we will keep the coordinates, neighborhood
            # If it doesn't exist, skip
            if locality in manhattan_regions["Lower Manhattan"]:
                stations_by_region["Lower Manhattan"].append((station_name, available_bikes, latitude, longitude))
            elif locality in manhattan_regions["Upper Manhattan"]:
                stations_by_region["Upper Manhattan"].append((station_name, available_bikes, latitude, longitude))
            elif locality in manhattan_regions["Midtown"]:
                stations_by_region["Midtown"].append((station_name, available_bikes, latitude, longitude))
            elif locality in manhattan_regions["New York"]:
                stations_by_region["New York"].append((station_name, available_bikes, latitude, longitude))

    with open("lower_manhattan.csv", "w") as lower_manhattan_csv:
        csv_writer = csv.writer(lower_manhattan_csv)

        csv_writer.writerow(["name", "bikes", "latitude", "longitude"]);
        for coordinates in stations_by_region["Lower Manhattan"]:
            csv_writer.writerow([coordinates[0], coordinates[1], coordinates[2], coordinates[3]])

    with open("upper_manhattan.csv", "w") as upper_manhattan_csv:
        csv_writer = csv.writer(upper_manhattan_csv)

        csv_writer.writerow(["name", "bikes", "latitude", "longitude"]);
        for coordinates in stations_by_region["Upper Manhattan"]:
            csv_writer.writerow([coordinates[0], coordinates[1], coordinates[2], coordinates[3]])

    with open("midtown.csv", "w") as midtown_csv:
        csv_writer = csv.writer(midtown_csv)

        csv_writer.writerow(["name", "bikes", "latitude", "longitude"]);
        for coordinates in stations_by_region["Midtown"]:
            csv_writer.writerow([coordinates[0], coordinates[1], coordinates[2], coordinates[3]])

    with open("new_york.csv", "w") as new_york_csv:
        csv_writer = csv.writer(new_york_csv)

        csv_writer.writerow(["name", "bikes", "latitude", "longitude"]);
        for coordinates in stations_by_region["New York"]:
            csv_writer.writerow([coordinates[0], coordinates[1], coordinates[2], coordinates[3]])

main()
