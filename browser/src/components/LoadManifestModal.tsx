import React, { useRef } from "react";
import {Modal, Button} from "react-materialize";

export interface Props {
  trigger: React.ReactNode,
  onChangeManifestUrl: (url: string) => void
}

export function LoadManifestModal({ trigger, onChangeManifestUrl }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  return (
    <Modal
      actions={[
        <Button flat modal="close" node="button" waves="green">Close</Button>,
        <Button modal="close" className="waves-effect waves-light red lighten-2" node="button" onClick={() => {
          onChangeManifestUrl(inputRef.current!!.value)
        }}>Load</Button>
      ]}
      bottomSheet={false}
      fixedFooter={false}
      header="Load manifest from URL"
      id="modal-0"
      options={{
        dismissible: true,
        endingTop: '10%',
        inDuration: 250,
        onCloseEnd: null,
        onCloseStart: null,
        onOpenEnd: null,
        onOpenStart: null,
        opacity: 0.5,
        outDuration: 250,
        preventScrolling: true,
        startingTop: '4%'
      }}
      trigger={trigger}
    >
      <form className="">
        <input ref={inputRef} type="text" className="textbox" placeholder="Enter manifest URL" onKeyDown={(ev) => {
          if (ev.keyCode === 13) {
            onChangeManifestUrl(inputRef.current!!.value)
          }
        }} />
      </form>
    </Modal>
  );
}
