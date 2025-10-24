// Placeholder slice for room state
const initialState = { id: null, members: [], playback: { time: 0, playing: false } };
export function getInitialRoomState() { return { ...initialState }; }
export default { initialState };
