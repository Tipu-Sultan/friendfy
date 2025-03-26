import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import Peer from 'simple-peer';

export const startCall = createAsyncThunk(
  'call/startCall',
  async ({ userToCall, stream, socket }, { getState }) => {
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream: stream,
    });

    return new Promise((resolve, reject) => {
      peer.on('signal', (data) => {
        socket.emit('callUser', { userToCall, signalData: data });
      });

      peer.on('stream', (userStream) => {
        resolve(userStream);
      });

      peer.on('error', (error) => {
        reject(error);
      });

      // Save the peer connection reference
      getState().call.connectionRef = peer;
    });
  }
);

export const answerCall = createAsyncThunk(
  'call/answerCall',
  async ({ callerSignal, stream, socket, caller }, { getState }) => {
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream: stream,
    });

    return new Promise((resolve, reject) => {
      peer.on('signal', (data) => {
        socket.emit('answerCall', { signal: data, to: caller });
      });

      peer.on('stream', (callerStream) => {
        resolve(callerStream);
      });

      peer.on('error', (error) => {
        reject(error);
      });

      peer.signal(callerSignal);

      // Save the peer connection reference
      getState().call.connectionRef = peer;
    });
  }
);

const callSlice = createSlice({
  name: 'call',
  initialState: {
    callType: '',
    stream: null,
    receivingCall: false,
    caller: '',
    callerSignal: null,
    callAccepted: false,
    callEnded: false,
    callDuration: 0,
    myVideo: null,
    userVideo: null,
    connectionRef: null,
    isOpen: false,
  },
  reducers: {
    setCallType(state, action) {
      state.callType = action.payload;
    },
    setReceivingCall(state, action) {
      state.receivingCall = action.payload;
    },
    setCaller(state, action) {
      state.caller = action.payload;
    },
    setCallerSignal(state, action) {
      state.callerSignal = action.payload;
    },
    setCallAccepted(state, action) {
      state.callAccepted = action.payload;
    },
    setCallEnded(state, action) {
      state.callEnded = action.payload;
    },
    setStream(state, action) {
      state.stream = action.payload;
    },
    toggleModal(state, action) {
      state.isOpen = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(startCall.fulfilled, (state, action) => {
        state.stream = action.payload;
        state.callAccepted = true;
      })
      .addCase(answerCall.fulfilled, (state, action) => {
        state.stream = action.payload;
        state.callAccepted = true;
      });
  },
});

export const {
  setCallType,
  setReceivingCall,
  setCaller,
  setCallerSignal,
  setCallAccepted,
  setCallEnded,
  setStream,
  toggleModal,
} = callSlice.actions;

export default callSlice.reducer;
