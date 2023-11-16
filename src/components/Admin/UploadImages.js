import React, { useState, useEffect, useCallback } from 'react';
import { uniqueId } from 'lodash';
import { filesize } from 'filesize';
import api from '../../api';
import Upload from './Uploads';
import FileList from './FileList';

const UploadImagesPage = () => {
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState(null); // 'success' or 'error'
  const [searchQuery, setSearchQuery] = useState('');
  const [hasMore, setHasMore] = useState(false);
  const [page, setPage] = useState(1);
  const [searchPerformed, setSearchPerformed] = useState(false);  // solução para liberar botao apos pesquisa

  // Função para exibir mensagem na tela por certo período de tempo.
  const showMessage = (message, messageType) => {
    setMessage(message);
    setMessageType(messageType);

    // Limpa a mensagem depois de 5 segundos.
    setTimeout(() => {
      setMessage(null);
      setMessageType(null);
    }, 5000);
  };

  // Busca as imagens na API.
  const fetchUploadedFiles = useCallback(async page => {
    const filesPerPage = 40; // imagens por pagina
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
  }, []);
  // Busca as imagens quando a página é carregada ou quando a página muda.
  useEffect(() => {
    fetchUploadedFiles(page);
  }, [page, fetchUploadedFiles]);

  // Vai para a próxima página de imagens.
  const handleNextPage = () => {
    if (hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchUploadedFiles(nextPage);
    }
  };

  // Vai para a página anterior de imagens.
  const handlePreviousPage = () => {
    if (page > 1) {
      const previousPage = page - 1;
      setPage(previousPage);
      fetchUploadedFiles(previousPage);
    }
  };

  const handleFirstPage = () => {
    setPage(1);
    fetchUploadedFiles(1);
    setSearchPerformed(false); // Reseta o estado de pesquisa
  };

  // Faz upload de arquivos.
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

    // Faz o upload dos arquivos.
    uploadedFiles.forEach(async uploadedFile => {
      const data = new FormData();
      data.append('file', uploadedFile.file, uploadedFile.name);

      // Inicialize o progresso com 0.
      updateFile(uploadedFile.id, { progress: 0 });

      // Simule o progresso do upload.
      const uploadProgressInterval = setInterval(() => {
        setUploadedFiles(prevState => {
          const uploadedFiles = [...prevState];
          const fileIndex = uploadedFiles.findIndex(
            file => file.id === uploadedFile.id,
          );

          // Verifique se o arquivo ainda existe antes de tentar acessar sua propriedade 'progress'. evitar erros ao iniciar um novo upload enquanto 1 upload ainda está em andamento
          if (fileIndex !== -1) {
            // Aumente o progresso em 3 a cada segundo.
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

        // Pare a simulação do progresso quando o upload for concluído.
        clearInterval(uploadProgressInterval);

        updateFile(uploadedFile.id, {
          uploaded: true,
          id: response.data.id,
          url: response.data.url,
        });
        let imageName = uploadedFile.name.substring(0, 20);
        showMessage(`Upload da Imagem ${imageName} foi Concluído`, 'success');
      } catch (error) {
        // Pare a simulação do progresso se ocorrer um erro.
        clearInterval(uploadProgressInterval);

        showMessage(
          'Erro no Upload da imagem, verifique o formato do arquivo ou o tamanho da imagem.',
          'error',
        );

        updateFile(uploadedFile.id, { error: true });
      }
    });
  };

  // Atualiza os dados de um arquivo.
  const updateFile = (id, data) => {
    setUploadedFiles(prevState =>
      prevState.map(file => (file.id === id ? { ...file, ...data } : file)),
    );
  };

  // Exclui um arquivo.
  const handleDelete = async id => {
    // Inicialize o progresso de exclusão com 0.
    updateFile(id, { deleteProgress: 0 });

    // Simule o progresso da exclusão.
    const deleteProgressInterval = setInterval(() => {
      setUploadedFiles(prevState => {
        const uploadedFiles = [...prevState];
        const file = uploadedFiles.find(file => file.id === id);

        // Aumente o progresso em 20 a cada segundo.
        file.deleteProgress = Math.min(file.deleteProgress + 20, 100);

        return uploadedFiles;
      });
    }, 1000);

    try {
      await api.delete(`admin/uploads/${id}`);

      // Pare a simulação do progresso quando a exclusão for concluída.
      clearInterval(deleteProgressInterval);

      setUploadedFiles(prevState => prevState.filter(file => file.id !== id));

      showMessage('Imagem Excluída', 'success');
    } catch (error) {
      // Pare a simulação do progresso se ocorrer um erro.
      clearInterval(deleteProgressInterval);

      showMessage('Erro ao excluir a imagem', 'error');
    }
  };

  // Faz a busca por imagens.
  const handleSearchSubmit = async event => {
    setPage(1); // pesquisa se inicia sempre na pagina 1
    if (event.key === 'Enter') {
      event.preventDefault();

      if (searchQuery.length < 3) {
        showMessage(
          'Digite pelo menos 3 caracteres para realizar a busca',
          'error',
        );
        return;
      }

      const filesPerPage = 40; // imagens por pagina
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
        setHasMore(response.data.hasMore); // verifica sem tem mais itens em proximas paginas
        setSearchPerformed(true); // Indica que uma pesquisa foi realizada
        showMessage('Busca realizada com sucesso', 'success');
      } catch (error) {
        showMessage(`Não existe imagens com o nome : ${searchQuery}`, 'error');
        console.error('Erro ao buscar as imagens:', error);
      }
      setSearchQuery(''); // Limpa o campo de pesquisa
    }
  };

  // Atualiza o estado da busca.
  const handleSearchChange = event => {
    setSearchQuery(event.target.value);
  };

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
      <button onClick={handleFirstPage} disabled={page === 1 && !searchPerformed}>
          Inicio

        </button>
        <button onClick={handlePreviousPage} disabled={page === 1}>
          Voltar
        </button>
        <p>Página {page}</p>
        <button onClick={handleNextPage} disabled={!hasMore}>
          Avançar
        </button>
      </div>
      <div className="center-title">
        {message && (
          <p style={{ color: messageType === 'success' ? 'green' : 'red' }}>
            {message}
          </p>
        )}
      </div>
      <input
        className="search-bar"
        type="text"
        value={searchQuery}
        onChange={handleSearchChange}
        onKeyDown={handleSearchSubmit}
        placeholder="Buscar imagens: Digite o nome da imagem e pressione enter... 🔍"
      />
    </div>
  );
};

export default UploadImagesPage;
