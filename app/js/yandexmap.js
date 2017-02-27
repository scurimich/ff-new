;(function() {
  if (window.ymaps) {
    ymaps.ready(mapInit);
    var myMap;
  }

})();


function mapInit() {
  myMap = new ymaps.Map('map', {
    center: [48.70, 44.51],
    zoom: 9
  });
}