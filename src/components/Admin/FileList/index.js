import React from "react";
import { CircularProgressbar } from "react-circular-progressbar";
import { MdCheckCircle, MdError, MdLink } from "react-icons/md";
import PropTypes from "prop-types";

import { Container, FileInfo, Preview, DeleteButton } from "./styles";

function FileList({ files, onDelete }) {
  return (
    <Container>
      {files.map((file) => (
        <li key={file.id}>
          <FileInfo>
            <Preview src={file.preview} />
            <div>
              <strong>{file.name}</strong>
              <span>
                {file.readableSize}
                {file.url && (
                  <DeleteButton onClick={() => onDelete(file.id)}>
                    Excluir
                  </DeleteButton>
                )}
              </span>
            </div>
          </FileInfo>

          <div>
            {!file.uploaded &&
              !file.error && (
                <CircularProgressbar
                  styles={{
                    root: { width: 24 },
                    path: { stroke: "#7159c1" }
                  }}
                  strokeWidth={10}
                  value={file.progress}
                />
              )}
            {file.deleteProgress && (
              <CircularProgressbar
                styles={{
                  root: { width: 30 },
                  path: { stroke: 'red' }
                }}
                strokeWidth={10}
                value={file.deleteProgress}
              />
            )}

            {file.url && (
              <a href={file.url} target="_blank" rel="noopener noreferrer">
                <MdLink style={{ marginRight: 8 }} size={24} color="#222" />
              </a>
            )}

            {file.uploaded && <MdCheckCircle size={24} color="#78e5d5" />}
            {file.error && <MdError size={24} color="#e57878" />}
          </div>
        </li>
      ))}
    </Container>
  );
}

FileList.propTypes = {
  files: PropTypes.array.isRequired,
  onDelete: PropTypes.func.isRequired
};

export default FileList;
