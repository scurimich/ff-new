$(function() {

    if (window.google) {
      google.maps.event.addDomListener(window, "load", mapInit);
      google.maps.event.addDomListener(window, "load", googleMapInit);
    }

});


function mapInit() {
  var box = $('[id=map]');
  box.each(function() {
    var map = new google.maps.Map(this, {
      center: {lat: 25, lng: 25},
      zoom: 2
    });
  });
}

function googleMapInit() {
  var input = $('#owner-coords');
  var box = document.getElementById('address-map');
  var inputCoords = input.val() || '1 1';
  var marker;
  var coords = {
    lat: Number(inputCoords.substring(0, inputCoords.indexOf(','))),
    lng: Number(inputCoords.substring(inputCoords.indexOf(' ')))
  };

  if (!box) return;
  var googleMap = new google.maps.Map(box, {
    center: coords,
    zoom: coords.lat ? 8 : 2
  });
  
  if (coords.lat && coords.lng) {
    marker = new google.maps.Marker({
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