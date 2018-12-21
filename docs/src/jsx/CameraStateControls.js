// @flow

//  Copyright (c) 2018-present, GM Cruise LLC
//
//  This source code is licensed under the Apache License, Version 2.0,
//  found in the LICENSE file in the root directory of this source tree.
//  You may not use this file except in compliance with the License.

import React from "react";
import styled from "styled-components";

import Scrubber from "../utils/Scrubber";
import Slider from "../utils/Slider";
import Switch from "../utils/Switch";
import type { CameraState, Quat } from "regl-worldview";

const ControlsTable = styled.table`
  color: #88878a;
  &,
  td,
  th,
  tr {
    border: none !important;
  }
  tr {
    background-color: transparent !important;
  }
`;

function normalizeQuaternion([x, y, z, w]: number[]): Quat {
  const h = Math.hypot(x, y, z, w);
  return [x / h, y / h, z / h, w / h];
}

function ScrubberArray({ value, onChange }) {
  const elements = ["["];
  for (let i = 0; i < value.length; i++) {
    elements.push(
      <Scrubber
        key={i}
        value={value[i]}
        speed={0.2}
        onChange={(num) => {
          const newArray = Array.from(value);
          newArray[i] = num;
          onChange(newArray);
        }}
      />
    );
    if (i + 1 < value.length) {
      elements.push(", ");
    }
  }

  elements.push("]");
  return elements;
}

type Props = {|
  cameraState: CameraState,
  setCameraState: (CameraState) => void,
|};

export default function CameraStateControls({ cameraState, setCameraState }: Props) {
  const { target, targetOrientation, targetOffset } = cameraState;
  return (
    <ControlsTable className="monospace">
      <tbody>
        <tr>
          <td>perspective</td>
          <td>
            <Switch
              on={cameraState.perspective}
              onChange={(perspective) => setCameraState({ ...cameraState, perspective })}
            />
          </td>
        </tr>
        <tr>
          <td>target</td>
          <td>
            <ScrubberArray value={target} onChange={(target) => setCameraState({ ...cameraState, target })} />
          </td>
        </tr>
        <tr>
          <td>targetOrientation</td>
          <td>
            <ScrubberArray
              value={targetOrientation}
              onChange={(quat) => setCameraState({ ...cameraState, targetOrientation: normalizeQuaternion(quat) })}
            />
          </td>
        </tr>
        <tr>
          <td>targetOffset</td>
          <td>
            <ScrubberArray
              value={targetOffset}
              onChange={(targetOffset) => setCameraState({ ...cameraState, targetOffset })}
            />
          </td>
        </tr>
        <tr>
          <td>distance</td>
          <td>
            <Slider
              minLabel
              maxLabel
              value={cameraState.distance}
              min={0}
              max={400}
              step={1}
              onChange={(distance) => setCameraState({ ...cameraState, distance })}
            />
          </td>
        </tr>
        <tr>
          <td>phi</td>
          <td>
            <Slider
              value={cameraState.phi}
              minLabel
              maxLabel="π"
              min={0}
              max={Math.PI}
              step={0.01}
              onChange={(phi) => setCameraState({ ...cameraState, phi })}
            />
          </td>
        </tr>
        <tr>
          <td>thetaOffset</td>
          <td>
            <Slider
              showEndpoints
              minLabel
              maxLabel="2π"
              value={cameraState.thetaOffset}
              min={0}
              max={Math.PI * 2}
              step={0.01}
              onChange={(thetaOffset) => setCameraState({ ...cameraState, thetaOffset })}
            />
          </td>
        </tr>
      </tbody>
    </ControlsTable>
  );
}
