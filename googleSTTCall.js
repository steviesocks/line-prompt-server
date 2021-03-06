// Imports the Google Cloud client library
const speech = require('@google-cloud/speech');
const ss = require('socket.io-stream')
// Creates a client
const client = new speech.SpeechClient();
const encoding = 'LINEAR16';
const sampleRateHertz = 16000;
const languageCode = 'en-US';
const request = {
  config: {
    encoding: encoding,
    sampleRateHertz: sampleRateHertz,
    languageCode: languageCode,
  },
  interimResults: false,
  single_utterance: true
};
// Create a recognize stream
const recognizeStream = client
  .streamingRecognize(request)
  .on('error', console.error) 
  .on('data', data =>
    // process.stdout.write(
    //   data.results[0] && data.results[0].alternatives[0]
    //     ? `Transcription: ${data.results[0].alternatives[0].transcript}\n`
    //     : `\n\nReached transcription time limit, press Ctrl+C\n`
    // )
    console.log(data.results[0])
  );

const transcribeAudioStream = async (audio, callback) => {
  const recognizeStream = client.streamingRecognize(request)
    .on('error', console.error)
    .on('data', (data) => {
        callback(data);
    })
    .on('end', () => {
        console.log('on end');
        recognizeStream.end()
    });

    audio.pipe(recognizeStream);
    audio.on('end', () => {
    })
}

module.exports = transcribeAudioStream;