import * as React from 'react';

import { ExpoScreenTimeViewProps } from './ExpoScreenTime.types';

export default function ExpoScreenTimeView(props: ExpoScreenTimeViewProps) {
  return (
    <div>
      <span>{props.name}</span>
    </div>
  );
}
