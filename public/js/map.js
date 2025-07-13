
    // Initialize map centered on London
    var map = L.map('map').setView([28.7041, 77.1025], 13);

    // Add OpenStreetMap tiles with attribution
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution:
        '&copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);



    // Add interactive elements
    var marker = L.marker([28.6139,77.2088]).addTo(map);
    marker
      .bindPopup('<b>Hello world!</b><br>I am a popup.')
      .openPopup();

    var circle = L.circle([51.508, -0.11], {
      color: 'red',
      fillColor: '#f03',
      fillOpacity: 0.5,
      radius: 500
    }).addTo(map);
    circle.bindPopup('I am a circle.');

    var polygon = L.polygon([
      [51.509, -0.08],
      [51.503, -0.06],
      [51.51, -0.047]
    ]).addTo(map);
    polygon.bindPopup('I am a polygon.');

    var popup = L.popup();
    function onMapClick(e) {
      popup
        .setLatLng(e.latlng)
        .setContent("You clicked at " + e.latlng.toString())
        .openOn(map);
    }
    map.on('click', onMapClick);


   