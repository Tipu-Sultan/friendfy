import { Realtime } from "ably";

let ably = null;

export const getAbly = () => {
    if (!ably) {
        ably = new Realtime({ key: process.env.NEXT_PUBLIC_ABLY_API_KEY });
    }
    return ably;
};
