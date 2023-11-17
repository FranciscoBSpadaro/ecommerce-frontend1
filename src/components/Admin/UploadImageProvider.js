import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from 'react';
import { uniqueId } from 'lodash';
import { filesize } from 'filesize';
import api from '../../api';

// Crie um contexto
export const UploadImageContext = createContext();

// Crie um provedor de contexto que encapsula a lógica do componente UploadImages
export const UploadImageProvider = ({ children, filesPerPage = 40 }) => {
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [hasMore, setHasMore] = useState(false);
  const [page, setPage] = useState(1);
  const [searchPerformed, setSearchPerformed] = useState(false);

  const showMessage = (message, messageType) => {
    setMessage(message);
    setMessageType(messageType);

    setTimeout(() => {
      setMessage(null);
      setMessageType(null);
    }, 5000);
  };

  const fetchUploadedFiles = useCallback(
    async page => {
      try {
        const response = await api.get('admin/uploads', {
          params: {
            limit: filesPerPage,
            offset: (page - 1) * filesPerPage,
          },
        });
        const uploadedFiles = response.data.images.map(file => ({
          ...file,
          id: String(file.id),
          uploaded: true,
          preview: file.url,
        }));
        setUploadedFiles(uploadedFiles);
        setHasMore(response.data.hasMore);
      } catch (error) {
        console.error('Erro ao buscar as imagens:', error);
        showMessage('Erro ao buscar as imagens', 'error');
      }
    },
    [filesPerPage],
  );

  useEffect(() => {
    fetchUploadedFiles(page);
  }, [page, fetchUploadedFiles]);

  const handleNextPage = () => {
    if (hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
    }
  };

  const handlePreviousPage = () => {
    if (page > 1) {
      const previousPage = page - 1;
      setPage(previousPage);
    }
  };

  const handleFirstPage = () => {
    setPage(1);
    fetchUploadedFiles(1);  // faz o fetch da pagina 1 mesmo se a busca está na pagina 1
    setSearchPerformed(false);
  };

  const handleUpload = async files => {
    const uploadedFiles = files.map(file => ({
      file,
      id: uniqueId(),
      name: file.name,
      readableSize: filesize(file.size),
      preview: URL.createObjectURL(file),
      progress: 0,
      uploaded: false,
      error: false,
      url: null,
    }));
    setUploadedFiles(uploadedFiles);

    uploadedFiles.forEach(async uploadedFile => {
      const data = new FormData();
      data.append('file', uploadedFile.file, uploadedFile.name);

      updateFile(uploadedFile.id, { progress: 0 });

      const uploadProgressInterval = setInterval(() => {
        setUploadedFiles(prevState => {
          const uploadedFiles = [...prevState];
          const fileIndex = uploadedFiles.findIndex(
            file => file.id === uploadedFile.id,
          );

          if (fileIndex !== -1) {
            uploadedFiles[fileIndex].progress = Math.min(
              uploadedFiles[fileIndex].progress + 3,
              100,
            );
          }

          return uploadedFiles;
        });
      }, 1000);

      try {
        const response = await api.post('admin/uploads', data);

        clearInterval(uploadProgressInterval);

        updateFile(uploadedFile.id, {
          uploaded: true,
          id: response.data.id,
          url: response.data.url,
        });
        let imageName = uploadedFile.name.substring(0, 20);
        showMessage(`Upload da Imagem ${imageName} foi Concluído`, 'success');
      } catch (error) {
        clearInterval(uploadProgressInterval);

        showMessage(
          'Erro no Upload da imagem, verifique o formato do arquivo ou o tamanho da imagem.',
          'error',
        );

        updateFile(uploadedFile.id, { error: true });
      }
    });
  };

  const updateFile = (id, data) => {
    setUploadedFiles(prevState =>
      prevState.map(file => (file.id === id ? { ...file, ...data } : file)),
    );
  };

  const handleDelete = async id => {
    updateFile(id, { deleteProgress: 0 });

    const deleteProgressInterval = setInterval(() => {
      setUploadedFiles(prevState => {
        const uploadedFiles = [...prevState];
        const file = uploadedFiles.find(file => file.id === id);

        file.deleteProgress = Math.min(file.deleteProgress + 20, 100);

        return uploadedFiles;
      });
    }, 1000);

    try {
      await api.delete(`admin/uploads/${id}`);

      clearInterval(deleteProgressInterval);

      setUploadedFiles(prevState => prevState.filter(file => file.id !== id));

      showMessage('Imagem Excluída', 'success');
    } catch (error) {
      clearInterval(deleteProgressInterval);

      showMessage('Erro ao excluir a imagem', 'error');
    }
  };

  const handleSearchSubmit = async event => {
    setPage(1);
    if (event.key === 'Enter') {
      event.preventDefault();

      if (searchQuery.length < 3) {
        showMessage(
          'Digite pelo menos 3 caracteres para realizar a busca',
          'error',
        );
        return;
      }

      const queryParams = {
        name: searchQuery,
        limit: filesPerPage,
        offset: (page - 1) * filesPerPage,
      };
      try {
        const response = await api.get('/admin/uploads/images', {
          params: queryParams,
        });
        const uploadedFiles = response.data.images.map(file => ({
          ...file,
          uploaded: true,
          preview: file.url,
        }));
        setUploadedFiles(uploadedFiles);
        setHasMore(response.data.hasMore);
        setSearchPerformed(true);
        showMessage('Busca realizada com sucesso', 'success');
      } catch (error) {
        showMessage(`Não existe imagens com o nome : ${searchQuery}`, 'error');
        console.error('Erro ao buscar as imagens:', error);
      }
      setSearchQuery('');
    }
  };

  const handleSearchChange = event => {
    setSearchQuery(event.target.value);
  };

  return (
    <UploadImageContext.Provider
      value={{
        uploadedFiles,
        message,
        messageType,
        searchQuery,
        hasMore,
        page,
        searchPerformed,
        showMessage,
        fetchUploadedFiles,
        handleNextPage,
        handlePreviousPage,
        handleFirstPage,
        handleUpload,
        updateFile,
        handleDelete,
        handleSearchSubmit,
        handleSearchChange,
      }}
    >
      {children}
    </UploadImageContext.Provider>
  );
};

// Crie um hook personalizado para usar o contexto
export const useUploadImage = () => {
  const context = useContext(UploadImageContext);

  if (!context) {
    throw new Error(
      'useUploadImage must be used within an UploadImageProvider',
    );
  }

  return context;
};
