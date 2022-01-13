//Get Coordinates Function

getCoords();

async function getCoords () {
    pos = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
    })
    let coordinates = [pos.coords.latitude, pos.coords.longitude];

    createMap(coordinates);
}



// Creating Map
function createMap(coordinates){
    const myMap = L.map('map',{
        center: coordinates,
        zoom: 12
    });
    // adding Tile Layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    minZoom: '4',
    }).addTo(myMap)

    const redMarker = L.icon({
        iconUrl: './assets/map-pin-solid.svg',
        iconSize: [50, 50],
        iconAnchor: [19,38]
    });
    
    const marker = L.marker(coordinates, {icon:redMarker}).addTo(myMap);
    marker.bindPopup("<b>You Are Here</b>").openPopup();
    

    search(coordinates, myMap);
}

// get location values

function search(coordinates, myMap){
    // Adding event listener
    let markerA = null;
    document.querySelector('#submit').addEventListener('click', async (e) => {
        e.preventDefault()
        if(markerA){
            console.log(markerA);
            markerA.forEach(marker => {
                marker.remove()
            })
        };
        let selectedLocations = document.querySelector('#locations');
        let optionValue = selectedLocations.options[selectedLocations.selectedIndex].value;

        // Fetch Request for foursquare search
        const options = {
            method: 'GET',
            headers: {
            Accept: 'application/json',
            Authorization: 'fsq3lRxy/ESIhkzljQl7p6MfQX2NfpCr2LcMF+ik1kFEO2c='
            }
        }
        let limit = 10;
        let lat = coordinates[0];
        let lon = coordinates[1]; 
        let response = await fetch(`https://api.foursquare.com/v3/places/search?&query=${optionValue}&limit=${limit}&ll=${lat}%2C${lon}&radius=20000`, options)

        let data = await response.json();
        locationsArray = data.results

        markerA=[];

        locationsArray.forEach((location) => {
            let marker = L.marker([location.geocodes.main.latitude,location.geocodes.main.longitude]).addTo(myMap)
            marker.bindPopup(`<b>${location.name}</b>`).openPopup();
            markerA.push(marker);
            
        })
        console.log(markerA)

    })
}

