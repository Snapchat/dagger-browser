import { Link } from "react-router-dom";
import Config from "../models/Config";
import Routes from "../Routes";
import { LoadManifestModal } from "./LoadManifestModal";
import React, { useRef } from "react";
import {Navbar, Icon, NavItem, Dropdown, Divider, Modal, Button} from "react-materialize";

export interface Props {
  manifestUrl?: string;
  onChangeManifestUrl: (url: string) => void
}

export function BrowserHeader({ manifestUrl, onChangeManifestUrl }: Props) {
  return (
    <nav>
      <div className="container">
        <div className="nav-wrapper">
          <Link to={Routes.Home} className="brand-logo">
            {Config.TITLE}
          </Link>
          {manifestUrl && (
          <div className="right hide-on-med-and-down">
            <Dropdown
            options={{
              alignment: 'right',
              autoTrigger: true,
              closeOnClick: true,
              constrainWidth: false,
              container: null,
              coverTrigger: false,
              hover: false,
              inDuration: 150,
              onCloseEnd: null,
              onCloseStart: null,
              onOpenEnd: null,
              onOpenStart: null,
              outDuration: 250
            }}
            trigger={<a href="#!" className="settings-icon"><Icon right>settings</Icon></a>}
          >
            <LoadManifestModal onChangeManifestUrl={onChangeManifestUrl} trigger={<a href="#" className="manifest-model">Load manifest from URL</a>} />
            <a href={manifestUrl}
              target="_blank"
              className="manifest-model"
              title="Download JSON">
              Download manifest
            </a>
          </Dropdown>
          </div>
          )}
        </div>
      </div>
    </nav>
  );
}
