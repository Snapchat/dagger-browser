import React from "react";
import Spinner from 'react-spinner-material';

export const GraphSpinner = () => {
  return (
    <div className="graph-spinner">
        <Spinner visible={true} radius={"30"} color={"#ee6e73"} stroke={"3"} />
    </div>
  );
};

export default GraphSpinner;
