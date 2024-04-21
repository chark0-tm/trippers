document.addEventListener('DOMContentLoaded', function () {
    var compassImg = document.getElementById('compass');
    if (window.DeviceOrientationEvent) {
        window.addEventListener('deviceorientation', function(event) {
            var alpha;
            // Check if event.alpha is available
            if (event.webkitCompassHeading) {
                // Apple devices use webkitCompassHeading
                alpha = event.webkitCompassHeading;
                // Correcting the angle of the compass image
                compassImg.style.transform = 'rotate(' + (-alpha) + 'deg)';
            } else if (event.alpha != null) {
                // Non-Apple devices
                alpha = event.alpha;
                compassImg.style.transform = 'rotate(' + alpha + 'deg)';
            } else {
                alert("Compass not supported");
            }
        }, false);
    } else {
        alert("Device orientation not supported");
    }
});
