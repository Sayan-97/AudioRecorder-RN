import React, { Component } from 'react';
import { View, Text, Button } from 'react-native';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';

const audioRecorderPlayer = new AudioRecorderPlayer();

interface AppState {
  recordSecs: number;
  recordTime: string;
  currentPositionSec: number;
  currentDurationSec: number;
  playTime: string;
  duration: string;
}

class App extends Component<{}, AppState> {
  constructor(props: {}) {
    super(props);
    this.state = {
      recordSecs: 0,
      recordTime: '00:00',
      currentPositionSec: 0,
      currentDurationSec: 0,
      playTime: '00:00',
      duration: '00:00',
    };
  }

  onStartRecord = async () => {
    const result = await audioRecorderPlayer.startRecorder();
    audioRecorderPlayer.addRecordBackListener((e) => {
      this.setState({
        recordSecs: e.currentPosition,
        recordTime: audioRecorderPlayer.mmssss(Math.floor(e.currentPosition)),
      });
    });
    console.log(result);
  };

  onStopRecord = async () => {
    const result = await audioRecorderPlayer.stopRecorder();
    audioRecorderPlayer.removeRecordBackListener();
    this.setState({
      recordSecs: 0,
    });
    console.log(result);
    this.getAudioFile(result)
  };

  getAudioFile = async (result: any) => {
    console.log('Path:', result)
    const formData = new FormData();
    formData.append('sound', {
      uri: result,
      type: 'audio/mp4',
      name: 'sound.mp4'
    });

    fetch('http://10.0.2.2:5000/upload', {
      method: 'POST',
      body: formData,
      headers: {
        "Content-Type": "multipart/form-data"
      }
    }).then(response => response.json())
      .then(data => {
        console.log('Upload successful', data)
      })
      .catch(error => {
        console.error('Upload Error', error)
      })
  }

  // onStartPlay = async () => {
  //   console.log('onStartPlay');
  //   const msg = await audioRecorderPlayer.startPlayer();
  //   console.log(msg);
  //   audioRecorderPlayer.addPlayBackListener((e) => {
  //     this.setState({
  //       currentPositionSec: e.currentPosition,
  //       currentDurationSec: e.duration,
  //       playTime: audioRecorderPlayer.mmssss(Math.floor(e.currentPosition)),
  //       duration: audioRecorderPlayer.mmssss(Math.floor(e.duration)),
  //     });
  //   });
  // };

  // onPausePlay = async () => {
  //   await audioRecorderPlayer.pausePlayer();
  // };

  // onStopPlay = () => {
  //   console.log('onStopPlay');
  //   audioRecorderPlayer.stopPlayer();
  //   audioRecorderPlayer.removePlayBackListener();
  // };

  render() {
    return (
      <View>
        <Text>Record Time: {this.state.recordTime}</Text>
        <Text>Play Time: {this.state.playTime}</Text>
        <Button title="Start Recording" onPress={this.onStartRecord} />
        <Button title="Stop Recording" onPress={this.onStopRecord} />
        {/* <Button title="Start Playing" onPress={this.onStartPlay} />
        <Button title="Pause Playing" onPress={this.onPausePlay} />
        <Button title="Stop Playing" onPress={this.onStopPlay} /> */}
      </View>
    );
  }
}

export default App;