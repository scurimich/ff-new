$(function() {

  if (window.ymaps) {
    ymaps.ready(mapInit);
    var myMap;
  }
  if (window.google) {
    googleMapInit();
  }

});


function mapInit() {
  myMap = new ymaps.Map('map', {
    center: [48.70, 44.51],
    zoom: 9
  });
}

function googleMapInit() {
  var input = $('#owner-coords');
  var inputCoords = input.val();
  var marker;
  var coords = {lat: Number(inputCoords.substring(0, inputCoords.indexOf(','))), lng: Number(inputCoords.substring(inputCoords.indexOf(' ')))};

  var googleMap = new google.maps.Map(document.getElementById('address-map'), {
    center: coords,
    zoom: coords.lat ? 8 : 2,
    cursor: 'default'
  });
  if (coords.lat && coords.lng) {
    marker= new google.maps.Marker({
      position: coords,
      map: googleMap
    })
  }

  googleMap.addListener('click', function(e) {
    var coords = {lat: Number(e.latLng.lat().toFixed(6)), lng: Number(e.latLng.lng().toFixed(6))};
    var inputCoords = coords.lat + ', ' + coords.lng;
    input.val(inputCoords);
    marker.setPosition(coords);
  });
}