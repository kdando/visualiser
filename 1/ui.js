let controlsOpen = false;

function openControls() {
  if (controlsOpen) {
    document.getElementById("controls").style.display = "none";
    controlsOpen = false;
  } else {
    document.getElementById("controls").style.display = "block";
    controlsOpen = true;
  }
}

function randomise() {
  const randomColour = Math.floor(Math.random() * 16777215).toString(16);
  document.getElementById("colour").value = "#" + randomColour;
  const randomSensitivity = Math.floor(Math.random() * 101);
  document.getElementById("sensitivity").value = randomSensitivity;
}

// Update visualiser based on controls
function updateVisualiser() {
  const colour = document.getElementById("colour").value;
  const sensitivity = document.getElementById("sensitivity").value;
  // Update visualiser with new colour and sensitivity
}

// Call updateVisualiser function every frame
function animate() {
  updateVisualiser();
  requestAnimationFrame(animate);
}

animate();