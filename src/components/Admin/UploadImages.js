import React from 'react';
import { useUploadImage } from './UploadImageProvider';
import Upload from './Uploads';
import FileList from './FileList';

export const UploadImages = () => {
  const {
    uploadedFiles,
    message,
    messageType,
    searchQuery,
    hasMore,
    page,
    searchPerformed,
    handleNextPage,
    handlePreviousPage,
    handleFirstPage,
    handleUpload,
    handleDelete,
    handleSearchSubmit,
    handleSearchChange,
  } = useUploadImage();


  return (
    <div className="container-upload">
      <h1 className="center-title">Upload de Imagens</h1>
      <Upload onUpload={handleUpload} />
      {uploadedFiles.length > 0 && (
        <FileList
          files={uploadedFiles}
          onDelete={handleDelete}
          hasMore={hasMore}
          onNextPage={handleNextPage}
          onPreviousPage={handlePreviousPage}
        />
      )}
      <div className="uploaded-images">
        <button className='button' onClick={handleFirstPage} disabled={page === 1 && !searchPerformed}>
          Inicio
        </button>
        <button className='button' onClick={handlePreviousPage} disabled={page === 1}>
          Voltar
        </button>
        <div className="center-title">
          {message && (
            <p style={{ color: messageType === 'success' ? 'green' : 'red' }}>
              {message}
            </p>
          )}
        </div>
        <p>Página {page}</p>
        <button className='button' onClick={handleNextPage} disabled={!hasMore}>
          Avançar
        </button>
      </div>
      <input
        className="search-bar"
        type="text"
        maxLength="40"
        value={searchQuery}
        onChange={handleSearchChange}
        onKeyDown={handleSearchSubmit}
        placeholder="Buscar imagens: Digite o nome da imagem e pressione enter... 🔍"
      />
    </div>
  );
};
