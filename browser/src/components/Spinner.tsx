import React from "react";
import Spinner from 'react-spinner-material';

export const GraphSpinner = () => {
  return (
    <div className="graph-spinner">
        <Spinner size={30} spinnerColor={"#ee6e73"} spinnerWidth={3} visible={true} radius={""} color={""} stroke={""} />
    </div>
  );
};

export default GraphSpinner;
