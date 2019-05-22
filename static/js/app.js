var lower_manhattan_laundry_coordinates = [];
var upper_manhattan_laundry_coordinates = [];
var midtown_laundry_coordinates = [];

var lower_manhattan_laundry_markers = [];
var upper_manhattan_laundry_markers = [];
var midtown_laundry_markers = [];

var lower_manhattan_laundry_layer;
var upper_manhattan_laundry_layer;
var midtown_laundry_layer;

d3.csv("/data_preprocessing/Laundry.csv").then(function(laundry_data) {
    laundry_data.forEach(function(data_json) {
        latitude = data_json["latitude"];
        longitude = data_json["longitude"];
        business = data_json["business"];

        var data_obj = {
            "latitude": latitude,
            "longitude": longitude,
            "business": business
        };

        if (data_json["region"] == "Upper Manhattan")
        {
            upper_manhattan_laundry_coordinates.push(data_obj);
        }
        else if (data_json["region"] == "Lower Manhattan")
        {
            lower_manhattan_laundry_coordinates.push(data_obj);
        }
        else if (data_json["region"] == "Midtown Manhattan")
        {
            midtown_laundry_coordinates.push(data_obj);
        }
    });
});

var upper_manhattan_rent = [];
var ues_rent = [];
var uws_rent = [];
var lower_manhattan_rent = [];
var midtown_rent = [];

d3.csv("/static/medianRentManhattan.csv").then(function(median_rent) {
    median_rent.forEach(function(median_rent_data) {
        var region = median_rent_data["areaName"];
        delete median_rent_data.areaName;

        Object.entries(median_rent_data).forEach(function([key, value]) {
            if (region === "Upper Manhattan")
            {
                var rent_obj = {
                    date:key,
                    rent:value
                };
                upper_manhattan_rent.push(rent_obj);
            }
            else if (region === "Lower Manhattan")
            {
                var rent_obj = {
                    date:key,
                    rent:value
                };
                lower_manhattan_rent.push(rent_obj);
            }
            else if (region === "Midtown")
            {
                var rent_obj = {
                    date:key,
                    rent:value
                };
                midtown_rent.push(rent_obj);
            }
        });
    });
});

var lower_manhattan_citibike_coordinates;
var upper_manhattan_citibike_coordinates;
var midtown_citibike_coordinates;

var lower_manhattan_citibike_markers = [];
var upper_manhattan_citibike_markers = [];
var midtown_citibike_markers = [];

var lower_manhattan_citibike_layer;
var upper_manhattan_citibike_layer;
var midtown_citibike_layer;

d3.csv("/data_preprocessing/lower_manhattan.csv").then(function(coordinates) {
    lower_manhattan_citibike_coordinates = coordinates;
});

d3.csv("/data_preprocessing/upper_manhattan.csv").then(function(coordinates) {
    upper_manhattan_citibike_coordinates = coordinates;
});

d3.csv("/data_preprocessing/midtown.csv").then(function(coordinates) {
    midtown_citibike_coordinates = coordinates;
});

// d3.csv("/citibike_preprocessing/new_york.csv").then(function(coordinates) {
//     new_york_citibike = coordinates;
// });

setTimeout(function(){
    var laundryMarker = L.AwesomeMarkers.icon({
        icon: 'shirt',
        prefix: 'ion',
        markerColor: 'pink'
      });

    upper_manhattan_laundry_coordinates.forEach(function(coordinates) {
        var marker = L.marker([coordinates["latitude"], coordinates["longitude"]], {icon: laundryMarker});
        marker.bindPopup("<b>" + coordinates["business"] + "</b>").openPopup();
        upper_manhattan_laundry_markers.push(marker)
    });

    lower_manhattan_laundry_coordinates.forEach(function(coordinates) {
        var marker = L.marker([coordinates["latitude"], coordinates["longitude"]], {icon: laundryMarker});
        marker.bindPopup("<b>" + coordinates["business"] + "</b>").openPopup();
        lower_manhattan_laundry_markers.push(marker)
    });

    midtown_laundry_coordinates.forEach(function(coordinates) {
        var marker = L.marker([coordinates["latitude"], coordinates["longitude"]], {icon: laundryMarker});
        marker.bindPopup("<b>" + coordinates["business"] + "</b>").openPopup();
        midtown_laundry_markers.push(marker)
    });

    var bikeMarker = L.AwesomeMarkers.icon({
        icon: 'bicycle',
        prefix: 'ion',
        markerColor: 'green'
      });

    upper_manhattan_citibike_coordinates.forEach(function(coordinates) {
        var marker = L.marker([coordinates["latitude"], coordinates["longitude"]], {icon: bikeMarker});
        marker.bindPopup("<b>" + coordinates["name"] + "</b><br>" + coordinates["bikes"] + " bikes available").openPopup();
        upper_manhattan_citibike_markers.push(marker)
    });

    lower_manhattan_citibike_coordinates.forEach(function(coordinates) {
        var marker = L.marker([coordinates["latitude"], coordinates["longitude"]], {icon: bikeMarker});
        marker.bindPopup("<b>" + coordinates["name"] + "</b><br>" + coordinates["bikes"] + " bikes available").openPopup();
        lower_manhattan_citibike_markers.push(marker)
    });

    midtown_citibike_coordinates.forEach(function(coordinates) {
        var marker = L.marker([coordinates["latitude"], coordinates["longitude"]], {icon: bikeMarker});
        marker.bindPopup("<b>" + coordinates["name"] + "</b><br>" + coordinates["bikes"] + " bikes available").openPopup();
        midtown_citibike_markers.push(marker)
    });

    upper_manhattan_laundry_layer = L.layerGroup(upper_manhattan_laundry_markers);
    lower_manhattan_laundry_layer = L.layerGroup(lower_manhattan_laundry_markers);
    midtown_laundry_layer = L.layerGroup(midtown_laundry_markers);

    upper_manhattan_citibike_layer = L.layerGroup(upper_manhattan_citibike_markers);
    lower_manhattan_citibike_layer = L.layerGroup(lower_manhattan_citibike_markers);
    midtown_citibike_layer = L.layerGroup(midtown_citibike_markers);

    var mapbox_key = "YOUR_KEY_HERE";
    var street_layer = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox.streets',
        accessToken: mapbox_key
    });

    var mymap = L.map('mapid', {
        center: [40.7549, -73.9840],
        zoom: 12,
        layers: [street_layer]
    });

    var baseMaps = {
        "Streets": street_layer
    };

    var overlayMaps = {
        "Upper Manhattan Laundromat": upper_manhattan_laundry_layer,
        "Midtown Laundromat": midtown_laundry_layer,
        "Lower Manhattan Laundromat": lower_manhattan_laundry_layer,
        "Upper Manhattan Citibikes": upper_manhattan_citibike_layer,
        "Midtown Citibikes": midtown_citibike_layer,
        "Lower Manhattan Citibikes": lower_manhattan_citibike_layer
    };

    L.control.layers(baseMaps, overlayMaps, {collapsed:false}).addTo(mymap);
    
    // new_york_citibike.forEach(function(coordinates) {
    //     var marker = L.marker([coordinates["latitude"], coordinates["longitude"]]).addTo(mymap);
    //     marker.bindPopup("<b>" + coordinates["name"] + "</b><br>" + coordinates["bikes"] + " bikes available").openPopup();
    // });

    var features = { "type":"featureCollection", features: [
        {
          "type":"Feature",
          "properties":{data:upper_manhattan_rent, title:"Upper Manhattan Median Rent 2-BR (1-Yr)"},
          "geometry":{
            "type":"Polygon", // Upper Manhattan
              "coordinates":[[[-73.959006, 40.758317], [-73.994583, 40.773366], [-73.951184, 40.834150], [-73.946300, 40.844470], [-73.947073, 40.850736], [-73.927956, 40.876927], [-73.925299, 40.877966], [-73.922295, 40.877186], [-73.919720, 40.874913], [-73.915685, 40.874847], [-73.911479, 40.873353], [-73.910450, 40.871730], [-73.910795, 40.868873], [-73.913631, 40.864850], [-73.923593, 40.853428], [-73.930715, 40.842260], [-73.934580, 40.835573], [-73.934148, 40.827000], [-73.933380, 40.809397], [-73.929427, 40.803420], [-73.928227, 40.798612], [-73.928830, 40.794779], [-73.935350, 40.791075], [-73.939299, 40.785292], [-73.943203, 40.783017], [-73.943675, 40.781067], [-73.941744, 40.776290], [-73.946015, 40.771090], [-73.959006, 40.758317]]]
          }
        },
        {
          "type": "Feature",
          "properties": {data:lower_manhattan_rent, title:"Lower Manhattan Median Rent 2-BR (1-Yr)"},
          "geometry": {
            "type": "Polygon", // Lower Manhattan
            "coordinates": [[[-73.970935, 40.726483], [-73.976786, 40.710613], [-73.998154, 40.707988], [-74.011065, 40.700432], [-74.015583, 40.700790], [-74.019724, 40.705857], [-74.010951, 40.742890], [-73.970935, 40.726483]]]
            }
        },
        {
            "type": "Feature",
            "properties": {data:midtown_rent, title:"Midtown Manhattan Median Rent 2-BR (1-Yr)"},
            "geometry": {
              "type": "Polygon", // Midtown
              "coordinates": [[[-73.994559, 40.773368], [-73.958771, 40.758179], [-73.971396, 40.743423], [-73.972339, 40.735620], [-73.974143, 40.735259], [-73.971572, 40.729015], [-73.971745, 40.726804], [-74.011393, 40.743395], [-74.007003, 40.754842], [-73.994559, 40.773368]]]
            }
        }
      ]};
      
      L.geoJSON(features)
        .addTo(mymap)
        .bindPopup(chart);
          
      function chart(d) {
        var feature = d.feature;
        var data = feature.properties.data;
        
        var width = 375;
        var height = 120;
        // var margin = {left:40,right:15,top:40,bottom:60};
        var margin = {left:60,right:15,top:40,bottom:70};
        var parse = d3.timeParse("%m");
        var format = d3.timeFormat("%b %y");
         
        var div = d3.create("div")
        var svg = div.append("svg")
          .attr("width", width+margin.left+margin.right)
          .attr("height", height+margin.top+margin.bottom);
        var g = svg.append("g")
          .attr("transform","translate("+[margin.left,margin.top]+")");
          

        //   var dataArray = new Array;
        //   for(var o in dataObject) {
        //       dataArray.push(dataObject[o]);
        //   }

        var data_rent = [];
        for (var i in data)
        {
            data_rent.push(data[i]["rent"]);
        }

        var data_rent_int = data_rent.map(function(rent_str) {
            return parseInt(rent_str, 10)
        });

        var min_y = Math.floor(Math.min(...data_rent_int) / 1000) * 1000;
        var max_y = Math.ceil(Math.min(...data_rent_int) / 1000) * 1000;

        var y = d3.scaleLinear()
          .domain([min_y, max_y])
          .range([height,0]);
          
        var yAxis = d3.axisLeft()
          .ticks(8)
          .scale(y);
        g.append("g").call(yAxis);
          
        var x = d3.scaleBand()
        .domain(data.map(function(d) { return d.date; }))
        .range([0,width]);
    
        var xAxis = d3.axisBottom()
        .scale(x)
        .tickFormat(function(d) { 
            // console.log(typeof(d));
            var date_parts = d.split("-");
            var date = new Date(date_parts[0], date_parts[1] - 1);

            return format(date); 
        });

        g.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis)
            .selectAll("text")
            .attr("text-anchor","end")
            .attr("transform","rotate(-90)translate(-12,-15)")
          
        var rects = g.selectAll("rect")
          .data(data)
          .enter()
          .append("rect")
          .attr("y",height)
          .attr("height",0)
          .attr("width", x.bandwidth()-2 )
          .attr("x", function(d) { return x(d.date); })
          .attr("fill","steelblue")
          .transition()
          .attr("height", function(d) { return height-y(d.rent); })
          .attr("y", function(d) { return y(d.rent); })
          .duration(1000);
          
        var title = svg.append("text")
          .style("font-size", "17px")
          .text(feature.properties.title)
          .attr("x", width/2 + margin.left)
          .attr("y", 20)
          .attr("text-anchor","middle");

        g.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left + 2)
        .attr("x", 0 - (height * .90))
        .attr("dy", "1em")
        .attr("class", "axisText")
        .text("Median Rent ($)")
        .attr("font-size","12px");

        g.append("text")
        .attr("transform", `translate(${width / 3}, ${height + margin.top + 25})`)
        .attr("class", "axisText")
        .text("Date (mth-yr)")
        .attr("font-size","12px");
          
        return div.node();
          
      }    
},200);