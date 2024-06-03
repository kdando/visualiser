let controlsOpen = false;
let bars = [];
let patternCount = 1;

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
function updateVisualiser(bars, volume) {
    const colour = document.getElementById("colour").value;
    const sensitivity = document.getElementById("sensitivity").value;
    const patternCountInput = document.getElementById("pattern-count");
    patternCount = parseInt(patternCountInput.value);
  
    // Update visualiser with new colour and sensitivity
    bars.forEach((bar) => {
      bar.colour = colour;
    });
  
    // Update variables based on sensitivity slider value
    zoomIncrement = 0.001 * (1 + sensitivity / 100);
    angleIncrement = 0.01 + (volume / 4) * (1 + sensitivity / 100);
  }

//Set canvas on page load
function main () {
    const canvas = document.getElementById('myCanvas')
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    class Bar {
        constructor(x, y, width, height, colour, index) {
          this.x = x;
          this.y = y;
          this.width = width;
          this.height = height;
          this.colour = colour;
          this.index = index;
        }
      
        // Handles mic data and calculates positions and sizes
        update(micInput) {
          const sound = micInput * 1000;
          if (sound > this.height) {
            this.height = sound;
          } else {
            this.height -= this.height * 0.03;
          }
        }
      
        // Takes data from updates and gives it shape and colour
        draw(context, softVolume) {
          context.strokeStyle = this.colour;
          context.save();
      
          // Play here!
          context.translate(0, 0);
          context.rotate(this.index * 0.03);
          context.scale(1 + softVolume * 0.2, 1 + softVolume);
          context.beginPath();
          // context.moveTo(this.x, this.y);
          // context.lineTo(this.y, this.height);
          context.bezierCurveTo(100, 100, this.height, this.height, this.x, this.y);
          context.stroke();
          context.rotate(this.index * 0.1);
          context.rotate(this.index * 0.03);
          // context.strokeRect(this.x, this.y, this.height/2, this.height);
          context.beginPath();
          context.arc(this.x + this.index, this.y, this.height * 0.5, 0, Math.PI * 2);
          context.stroke();
          context.restore();
        }
      }

    const fftSize = 512
    const microphone = new Microphone(fftSize);
    let barWidth = canvas.width / (fftSize/2);

    //This is 256 bc we set fftSize to 512 in Microphone class
    function createBars() {
        for (let i = 0; i < (fftSize/2); i++) {
            //'Hue, Saturation, Lightness'
            //Hue works as an angle on colour wheel. 0 is red, 60 is yellow, 120 is green, 180 is cyan, 240 is blue, 300 is magenta
            //can use an expression in place of hardcoding H, e.g. here we have currentvalue (starting at 0) plus i (from the loop) * 2 plus currentValue
            //This increases as we loop through the bars so we get a nice spectrum across them

            let colour = 'hsl(' + i + ', 100%, 50%)'
            bars.push(new Bar(0, i * 1.5, 100, 20, colour, i));
        }
    }

    createBars()

    let angle = 0;
    let softVolume = 0;
    
    //Constantly calls update and draw methods on all bars
    function animate() {
        const volume = microphone.getVolume();
        updateVisualiser(bars, volume);
    
    let zoomFactor = 1.0; // Initial zoom factor
    const zoomIncrement = 0.001; // Amount to increment zoom in each frame

  if (microphone.initialised) {
    const volume = microphone.getVolume();
    const samples = microphone.getSamples();

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Increase zoom factor
    zoomFactor += zoomIncrement;

    // Calculate the center of the visualizer
    const visualizerCenterX = canvas.width / 2;
    const visualizerCenterY = canvas.height / 2;

    // Apply zoom to the canvas context, centered around the visualizer
    // ctx.translate(visualizerCenterX, visualizerCenterY);
    // ctx.scale(zoomFactor, zoomFactor);
    // ctx.translate(-visualizerCenterX, -visualizerCenterY);

    // Animate bars based on mic data
    angle += 0.01 + (volume / 4);
    ctx.save();
    ctx.translate(canvas.width / (2 * zoomFactor), canvas.height / (2 * zoomFactor));
    ctx.rotate(angle);

    for (let i = 0; i < patternCount; i++) {
      bars.forEach((bar, index) => {
        bar.update(samples[index]);
        bar.draw(ctx, volume);
      });
      ctx.rotate(Math.PI / patternCount); // rotate the pattern by a fraction of PI
    }

    ctx.restore();

    softVolume = softVolume * 0.9 + volume * 0.1;
  }

  requestAnimationFrame(animate);
}
    
    animate();

}

// Add event listeners for pattern count control
document.getElementById("increment-pattern-count").addEventListener("click", () => {
    const patternCountInput = document.getElementById("pattern-count");
    patternCountInput.value = parseInt(patternCountInput.value) + 1;
    patternCount = parseInt(patternCountInput.value);
  });
  
  document.getElementById("decrement-pattern-count").addEventListener("click", () => {
    const patternCountInput = document.getElementById("pattern-count");
    patternCountInput.value = Math.max(parseInt(patternCountInput.value) - 1, 1);
    patternCount = parseInt(patternCountInput.value);
  });