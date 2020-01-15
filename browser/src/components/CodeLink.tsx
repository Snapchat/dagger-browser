import React from "react";
import Config from "../models/Config";

interface Props {
  link: string;
}

const CodeLink = ({ link }: Props) => {
  if (Config.REPO_URL) {
    let filename = link.split(".").pop();
    return (
      <a
        rel="noopener noreferrer"
        target="_blank"
        href={Config.REPO_URL + "/search?q=filename:" + filename}
        className="unselectable"
      >
        <i className="tiny material-icons">open_in_new</i>
      </a>
    );
  } else {
    return <span></span>;
  }
};

export default CodeLink;
