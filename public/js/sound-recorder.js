var soundRecorder = (function($) {


    return {
        init: init,
        startUserMedia: startUserMedia,
        startRecording: startRecording,
        stopRecording: stopRecording
    };
    
	
	
    function startUserMedia(stream) {
        var input = audio_context.createMediaStreamSource(stream);

        // Uncomment if you want the audio to feedback directly
        //input.connect(audio_context.destination);
        //__log('Input connected to audio context destination.');

        recorder = new Recorder(input);
    }

    function startRecording() {
        recorder && recorder.record();
    }

    function stopRecording(sendvoice) {
        recorder.stop();
        displaySound(sendvoice);
        recorder.clear();

    }

        
function displaySound(sendvoice) {
     recorder.exportWAV(function (interleaved) {
		 function mergeBuffersUint8(channelBuffer, recordingLength){
	var result = new Uint8Array(recordingLength);
	var offset = 0;
	var lng = channelBuffer.length;
	for (var i = 0; i < lng; i++){
		var buffer = channelBuffer[i];
		result.set(buffer, offset);
		offset += buffer.length;
	}
	return result;
}

		 var flac_encoder,
    BUFSIZE = 4096,
    CHANNELS = 1,
    SAMPLERATE = 44100,
    COMPRESSION = 5,
    BPS = 16,
    VERIFY = false,
    flac_ok = 1;

		 flac_encoder = Flac.init_libflac_encoder(audio_context.sampleRate, 1, 16, 5, 0, false);
if (flac_encoder == 0){
	return;
}
var encodedDatalength=0;
var encBuffer = [];
var status_encoder = Flac.init_encoder_stream(flac_encoder, function(encodedData /*Uint8Array*/, bytes, samples, current_frame){
	//store all encoded data "pieces" into a buffer 
	encBuffer.push(encodedData);
		encodedDatalength += encodedData.byteLength;

});
flac_ok &= (status_encoder == 0);


////////
// [2] ENCODE -> IN: PCM Float32 audio data (this example: mono stream)
// ... repeat encoding step [2] as often as necessary
var buf_length = interleaved.length;
var buffer_i32 = new Uint32Array(buf_length);
var view = new DataView(buffer_i32.buffer);
var volume = 1;
var index = 0;
for (var i = 0; i < buf_length; i++){
    view.setInt32(index, (interleaved[i] * (0x7FFF * volume)), true);
    index += 4;
}
var flac_return = Flac.FLAC__stream_encoder_process_interleaved(flac_encoder, buffer_i32, buf_length);
if (flac_return != true){
    console.log("Error: FLAC__stream_encoder_process_interleaved returned false. " + flac_return);
	 }


////////
// [3] FINISH ENCODING

flac_ok &= Flac.FLAC__stream_encoder_finish(flac_encoder);
console.log("flac finish: " + flac_ok);

//after usage: free up all resources for the encoder
Flac.FLAC__stream_encoder_delete(flac_encoder);

	var samples = mergeBuffersUint8(encBuffer , encodedDatalength);
		var blob = new Blob([samples], { type: 'audio/flac' });
       var url = URL.createObjectURL(blob);
            var au = document.createElement('audio');
             au.controls = true;
             au.src = url;    
        var reader = new window.FileReader();
            reader.readAsDataURL(blob); 
            reader.onloadend = function() {
                base64data = reader.result; 
                //console.log(base64data.split(',')[1])
     sendvoice(base64data.split(',')[1],'<audio controls src='+ url+ '>'+'</audio>');

  } 
				})
				}
    

    
    function init(callback,callback2) {
        try {
            // webkit shim
            window.AudioContext = window.AudioContext || window.webkitAudioContext;
            var media=navigator.getUserMedia  = ( navigator.getUserMedia ||navigator.webkitGetUserMedia || navigator.mozGetUserMedia ||navigator.msGetUserMedia);
            callback2(media);
            if(!media)
                return;
            window.URL = window.URL || window.webkitURL;

            audio_context = new AudioContext;
            callback(audio_context.sampleRate);
        } catch (e) {
            console.log(e);
            alert('No web audio support in this browser!');
        }

        navigator.getUserMedia({
            audio: true
        }, startUserMedia, function (e) {});
    };

})();
