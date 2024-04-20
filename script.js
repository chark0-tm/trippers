let userLatitude = null;
let userLongitude = null;
let deviceHeading = null;
let selectedDestination = { lat: null, lng: null };

const locationsInfo = {
    "46.32061591275231,-72.60363925513721": {
        description: "example01",
        imageUrl: "aw20170224.jpg"
    },
    "46.307848603628244,-72.58615371233131": {
        description: "example02",
        imageUrl: "couchetard.png"
    },
    "46.32180641109243,-72.59137336932483": {
        description: "example03",
        imageUrl: "cvideotron.png"
    }
};

// Function to watch the user's location
function watchLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.watchPosition(position => {
            userLatitude = position.coords.latitude;
            userLongitude = position.coords.longitude;
            if (selectedDestination.lat !== null && selectedDestination.lng !== null) {
                updateDistanceAndDirection();
            }
        }, showError, { enableHighAccuracy: true, maximumAge: 1000, timeout: 5000 });
    } else { 
        console.log("Geolocation is not supported by this browser.");
    }
}

// Function to watch the device's orientation
function watchOrientation() {
    if (window.DeviceOrientationEvent) {
        window.addEventListener("deviceorientation", event => {
            deviceHeading = event.alpha;
            updateCompass();
        }, false);
    } else {
        console.log("Device orientation is not supported by your device or browser.");
    }
}

function locationSelected() {
    const selectedValue = document.getElementById("locationSelector").value;
    if (!selectedValue) {
        resetUI();
        return;
    }
    const [lat, lng] = selectedValue.split(",").map(Number);
    selectedDestination = { lat, lng };
    const locationInfo = locationsInfo[selectedValue];
    if (locationInfo) {
        document.getElementById("locationDescription").innerHTML = locationInfo.description;
        document.body.style.backgroundImage = `url('${locationInfo.imageUrl}')`;
    }
    updateDistanceAndDirection();
}

function updateDistanceAndDirection() {
    const distance = calculateDistance(userLatitude, userLongitude, selectedDestination.lat, selectedDestination.lng);
    document.getElementById("distance").innerText = `Distance: ${distance.toFixed(2)} km`;
    updateCompass();
}

function updateCompass() {
    if (deviceHeading !== null && selectedDestination.lat !== null && selectedDestination.lng !== null) {
        const bearing = calculateBearing(userLatitude, userLongitude, selectedDestination.lat, selectedDestination.lng);
        const compassRotation = bearing - deviceHeading;
        const compassElement = document.getElementById("compass");
        compassElement.style.transform = `rotate(${compassRotation}deg)`;
    }
}

function calculateDistance(lat1, lon1, lat2, lon2) {
    // Haversine formula
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2-lat1);
    const dLon = deg2rad(lon2-lon1); 
    const a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
        Math.sin(dLon/2) * Math.sin(dLon/2)
    ; 
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    const distance = R * c; // Distance in km
    return distance;
}

function calculateBearing(lat1, lon1, lat2, lon2) {
    const y = Math.sin(lon2-lon1) * Math.cos(lat2);
    const x = Math.cos(lat1)*Math.sin(lat2) -
              Math.sin(lat1)*Math.cos(lat2)*Math.cos(lon2-lon1);
    const bearing = Math.atan2(y, x) * (180/Math.PI);
    return (bearing+360) % 360;
}

function deg2rad(deg) {
    return deg * (Math.PI/180)
}

function showError(error) {
    console.warn(`ERROR(${error.code}): ${error.message}`);
}

function resetUI() {
    document.getElementById("distance").innerText = "Distance: Please select a location";
    document.getElementById("locationDescription").innerHTML = "";
    document.getElementById("compass").style.transform = '';
}

function init() {
    watchLocation();
    watchOrientation();
    // Additional initialization code can go here
}

window.onload = init;
