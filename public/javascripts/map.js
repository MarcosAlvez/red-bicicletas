var map = L.map('main_map').setView([-34.94, -54.95], 14);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

L.marker([-34.953262, -54.971888]).addTo(map)
    .bindPopup('Hey!!! <br> Welcome.')
    .openPopup();

$.ajax({
    dataType: "json",
    url: "api/bicicletas",
    success: function(response) {
        console.log(response);
        response.bicicletas.forEach(function(bici){
            L.marker(bici.ubicacion, {title: bici.id}).addTo(map)
        });
    }
});
