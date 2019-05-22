import os

import pandas as pd
import numpy as np

import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine

from flask import Flask, jsonify, render_template, url_for, send_from_directory
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)


@app.route("/")
def index():
    """Return the homepage."""
    return render_template("index.html")

@app.route("/data_preprocessing/lower_manhattan.csv")
def lower_manhattan_stations():
    return send_from_directory("data_preprocessing", "lower_manhattan.csv")

@app.route("/data_preprocessing/upper_manhattan.csv")
def upper_manhattan_stations():
    return send_from_directory("data_preprocessing", "upper_manhattan.csv")

@app.route("/data_preprocessing/midtown.csv")
def midtown_stations():
    return send_from_directory("data_preprocessing", "midtown.csv")

@app.route("/static/medianRentManhattan.csv")
def median_rent():
    return send_from_directory("static", "medianRentManhattan.csv")

@app.route("/data_preprocessing/Laundry.csv")
def laundry_data():
    return send_from_directory("data_preprocessing", "Laundry.csv")

@app.route("/css/leaflet.awesome-markers.css")
def icons_css():
    return send_from_directory("css", "leaflet.awesome-markers.css")

@app.route("/js/leaflet.awesome-markers.js")
def icons_js():
    return send_from_directory("js", "leaflet.awesome-markers.js")

@app.route("/css/images/markers-shadow.png")
def markers_shadow():
    return send_from_directory("css/images", "markers-shadow.png")

@app.route("/css/images/markers-soft.png")
def markers_soft():
    return send_from_directory("css/images", "markers-soft.png")

@app.route("/css/images/markers-soft@2x.png")
def markers_soft_2x():
    return send_from_directory("css/images", "markers-soft@2x.png")

@app.route("/css/images/markers-shadow@2x.png")
def markers_shadow_2x():
    return send_from_directory("css/images", "markers-shadows@2x.png")

if __name__ == "__main__":
    app.run()
