import React from "react";
import classNames from "classnames";

interface Props {
  kind: string | null | undefined;
}

const NodeIcon = ({ kind }: Props) => {
  let icon = getNodeIcon(kind);
  if (!icon) {
    return <span />;
  }

  return (
    <span className={classNames("node-icon", icon.color)} title={kind || ""}>
      {icon.label}
    </span>
  );
};

// TODO: Make this configurable
let getNodeIcon = (
  kind: string | null | undefined
): { label: string; color: string } | undefined => {
  switch (kind) {
    case "INSTANCE": {
      return { label: "I", color: "deep-purple" };
    }
    case "PROVIDER": {
      return { label: "P", color: "blue" };
    }
    case "LAZY": {
      return { label: "L", color: "indigo" };
    }
    default: {
      return undefined;
    }
  }
};

export default NodeIcon;
