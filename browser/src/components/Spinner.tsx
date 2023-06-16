import React from "react";
import Spinner from 'react-spinner-material';

export const GraphSpinner = () => {
  return (
    <div className="graph-spinner">
        <Spinner size={30} visible={true} radius={""} color={""} stroke={""} />
    </div>
  );
};

export default GraphSpinner;
