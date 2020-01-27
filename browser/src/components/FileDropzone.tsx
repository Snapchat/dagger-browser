import React, { useCallback, FunctionComponent } from 'react'
import { useDropzone } from 'react-dropzone'


type Props = {
    manifestUrl?: string;
    onFilesSelected: (files: File[]) => void
}

const FileDropzone: FunctionComponent<Props> = ({ manifestUrl, onFilesSelected, children }) => {
    const onDrop = useCallback(onFilesSelected, [])
    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop })

    return (
        <div {...getRootProps()}>
            {/* <input {...getInputProps()} /> */}
            {
                isDragActive ?
                    (<div>
                        {children}
                        <div className="full-screen-alert">
                            <p>Drop to load manifest...</p>
                        </div>
                    </div>
                    ) :

                    children
            }
        </div>
    )
}

export default FileDropzone