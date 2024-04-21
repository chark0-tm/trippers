if (window.DeviceOrientationEvent) {
    window.addEventListener('deviceorientation', function(event) {
        var alpha = event.alpha;
        var compassImg = document.getElementById('compass');
        compassImg.style.transform = 'rotate(' + (-alpha) + 'deg)';
    }, false);
} else {
    alert("Your device does not support orientation sensors");
}
