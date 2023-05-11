import React, { useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import Voice from 'react-native-voice';

const App = () => {
  const [result, setResult] = useState('');
  const [error, setError] = useState('');
  const [isRecording, setRecording] = useState(false);
  const [timeoutId, setTimeoutId] = useState<number | null>(null);

  Voice.onSpeechStart = () => {
    setRecording(true);
    if (timeoutId) clearTimeout(timeoutId);
  };
  Voice.onSpeechEnd = () => {
    setRecording(false);
    setTimeoutId(setTimeout(stopRecording, 1000));
    // Add the search function here /////////////////////////////////////////
  };
  Voice.onSpeechError = (err: any) => setError(err?.error);
  Voice.onSpeechResults = (res: any) => setResult(res?.value?.[0]);
  Voice.onSpeechPartialResults = (res: any) => {
    const partialResult = res?.value?.[0];
    if (partialResult && !timeoutId) {
      setTimeoutId(setTimeout(stopRecording, 1000));
    }
  };

  const startRecording = async () => {
    try {
      await Voice.start('en-US');
    } catch (err: any) {
      setError(err);
    }
  };

  const stopRecording = async () => {
    try {
      await Voice.stop();
      setTimeoutId(null);
    } catch (err: any) {
      setError(err);
    }
  };

  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Text>{result}</Text>
      <Text>{error}</Text>
      <Pressable onPress={isRecording ? stopRecording : startRecording}>
        <Text style={{ color: 'red' }}>
          {isRecording ? 'STOP' : 'START'}
        </Text>
      </Pressable>
    </View>
  );
};

export default App;
