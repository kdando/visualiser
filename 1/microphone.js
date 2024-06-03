

//mediaDevices is an object that accesses connected mics, cameras etc
//getUserMedia returns a promise that resolves in a media stream object containing mic audio data
//AudioContext gives us access to web audio API
class Microphone {
    constructor(fftSize) {
        this.initialised = false;
        navigator.mediaDevices.getUserMedia({audio: true})
        .then((stream) => {
            this.audioContext = new AudioContext();
            this.microphone = this.audioContext.createMediaStreamSource(stream);
            this.analyser = this.audioContext.createAnalyser();
            //frequencyBinCount is half of fftSize, so visualiser will have 256 bars
            this.analyser.fftSize = fftSize;
            const bufferLength = this.analyser.frequencyBinCount;
            this.dataArray = new Uint8Array(bufferLength);
            this.microphone.connect(this.analyser);
            this.initialised = true;
        }).catch((error) => {
            alert(error);
        })
    }

    getSamples() {
        this.analyser.getByteTimeDomainData(this.dataArray);
        //convert data from Uint8 array of values 0 to 255 into normal array of values -1 to +1
        let normSamples = [...this.dataArray].map(element => element/128 - 1);
        return normSamples;
    }
    getVolume() {
        this.analyser.getByteTimeDomainData(this.dataArray);
        //same conversion as above, then total sum of current volumes to find average
        let normSamples = [...this.dataArray].map(element => element/128 - 1);
        let sum = 0;
        for (let i=0; i<normSamples.length; i++) {
            sum += normSamples[i] * normSamples[i];
        }
        let volume = Math.sqrt(sum / normSamples.length);
        return volume;
    }

}

