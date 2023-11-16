import React, { Component } from "react";

import Dropzone from "react-dropzone";

import { DropContainer, UploadMessage } from "./styles";

export default class Upload extends Component {
  renderDragMessage = (isdragactive, isdragreject) => {
    if (!isdragactive) {
      return <UploadMessage>👉 Clique aqui ou arraste Imagens da sua pasta , pode ser várias ao mesmo tempo 😎</UploadMessage>;
    }

    if (isdragreject) {
      return <UploadMessage type="error">Arquivo não suportado</UploadMessage>;
    }

    return <UploadMessage type="success">Solte os Imagens aqui</UploadMessage>;
  };

  render() {
    const { onUpload } = this.props;

    return (
      <Dropzone accept={{image: ['image/*']}} onDropAccepted={onUpload}>
        {({ getRootProps, getInputProps, isdragactive, isdragreject }) => (
          <DropContainer
            {...getRootProps()}
            isdragactive={isdragactive}
            isdragreject={isdragreject}
          >
            <input {...getInputProps()} />
            {this.renderDragMessage(isdragactive, isdragreject)}
          </DropContainer>
        )}
      </Dropzone>
    );
  }
}
