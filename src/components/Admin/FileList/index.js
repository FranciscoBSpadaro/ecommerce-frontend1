import React, { useState, useEffect, useCallback } from "react";
import { CircularProgressbar } from "react-circular-progressbar";
import { MdCheckCircle, MdError, MdLink } from "react-icons/md";
import PropTypes from "prop-types";

import { Container, FileInfo, Preview, DeleteButton } from "./styles";

function FileList({ files, onDelete }) {
  const [currentPage, setCurrentPage] = useState(1);
  const filesPerPage = 45;

  const totalPages = Math.ceil(files.length / filesPerPage);

  const handleNextPage = useCallback(() => {
    if (currentPage < totalPages) {
      setCurrentPage(prevPage => prevPage + 1);
    }
  }, [currentPage, totalPages]);

  const handlePreviousPage = useCallback(() => {
    if (currentPage > 1) {
      setCurrentPage(prevPage => prevPage - 1);
    }
  }, [currentPage]);

  useEffect(() => {
    if (files.length % filesPerPage === 0 && files.length !== 0) {
      handleNextPage();
    }
  }, [files.length, filesPerPage, handleNextPage]);

  useEffect(() => {
    setCurrentPage(totalPages);
  }, [totalPages]);

  const currentFiles = files.slice((currentPage - 1) * filesPerPage, currentPage * filesPerPage);


  return (
    <Container className="uploaded-images">
      {currentFiles.map(file => (
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
            {!file.uploaded && !file.error && (
              <CircularProgressbar
                styles={{
                  root: { width: 24 },
                  path: { stroke: '#7159c1' },
                }}
                strokeWidth={10}
                value={file.progress}
              />
            )}
            {file.deleteProgress && (
              <CircularProgressbar
                styles={{
                  root: { width: 30 },
                  path: { stroke: 'red' },
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
      <div className="uploaded-images">
      <button onClick={handlePreviousPage} disabled={currentPage === 1}>
        Voltar
      </button>
      <button onClick={handleNextPage} disabled={currentPage === totalPages}>
        Avançar
      </button>
      </div>
    </Container>
  );
}

FileList.propTypes = {
  files: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      name: PropTypes.string,
      readableSize: PropTypes.string,
      preview: PropTypes.string,
      progress: PropTypes.number,
      uploaded: PropTypes.bool,
      error: PropTypes.bool,
      url: PropTypes.string,
    })
  ).isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default FileList;