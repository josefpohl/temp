import React from "react";
import { Text } from "react-native";
import VolumeMeter from "AsyncRecording/volumemeter/VolumeMeter";

export default function VUMeter({ decibels }) {
  //A return value of 0 dB indicates full scale, or maximum power;
  //a return value of -160 dB indicates minimum power (that is, near silence).
  //If the signal provided to the audio recorder exceeds ±full scale,
  //then the return value may exceed 0 (that is, it may enter the positive range).

  return (
    <VolumeMeter value={decibels} minValue={-160} maxValue={0} size={300} />
  );
}
