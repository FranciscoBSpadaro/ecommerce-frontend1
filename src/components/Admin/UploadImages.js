import React, { Component } from 'react';
import { uniqueId } from 'lodash';
import { filesize } from 'filesize';
import api from '../../api';
import Upload from './Uploads';
import FileList from './FileList';

class UploadImages extends Component {
  constructor(props) {
    super(props);
    this.state = {
      uploadedFiles: [],
      message: null,
      messageType: null, // 'success' or 'error'
      searchQuery: '',
      hasMore: false,
      page: 1,
    };
  }

  showMessage = (message, messageType) => {
    this.setState({ message, messageType });

    // Clear the message after 5 seconds
    setTimeout(() => {
      this.setState({ message: null, messageType: null });
    }, 5000);
  };

  componentDidMount() {
    this.fetchUploadedFiles(this.state.page);
  }

  fetchUploadedFiles = async page => {
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
      this.setState({ uploadedFiles, hasMore: response.data.hasMore });
    } catch (error) {
      console.error('Erro ao buscar as imagens:', error);
    }
  };

  handleNextPage = () => {
    if (this.state.hasMore) {
      const nextPage = this.state.page + 1;
      this.setState({ page: nextPage });
      this.fetchUploadedFiles(nextPage);
    }
  };

  handlePreviousPage = () => {
    if (this.state.page > 1) {
      const previousPage = this.state.page - 1;
      this.setState({ page: previousPage });
      this.fetchUploadedFiles(previousPage);
    }
  };

  handleUpload = files => {
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

    uploadedFiles.forEach(this.processUpload);

    this.setState(prevState => ({
      uploadedFiles: [...prevState.uploadedFiles, ...uploadedFiles],
    }));
  };

  processUpload = async uploadedFile => {
    const data = new FormData();
    data.append('file', uploadedFile.file, uploadedFile.name);

    // Inicialize o progresso com 0
    this.updateFile(uploadedFile.id, { progress: 0 });

    // Simule o progresso do upload
    const uploadProgressInterval = setInterval(() => {
      this.setState(prevState => {
        const uploadedFiles = [...prevState.uploadedFiles];
        const file = uploadedFiles.find(file => file.id === uploadedFile.id);

        // Aumente o progresso em 5 a cada segundo
        file.progress = Math.min(file.progress + 5, 100);

        return { uploadedFiles };
      });
    }, 1000);

    try {
      const response = await api.post('admin/uploads', data);

      // Pare a simulação do progresso quando o upload for concluído
      clearInterval(uploadProgressInterval);

      this.updateFile(uploadedFile.id, {
        uploaded: true,
        id: response.data.id,
        url: response.data.url,
      });
      this.showMessage('Upload de Imagem Concluído', 'success');
    } catch (error) {
      // Pare a simulação do progresso se ocorrer um erro
      clearInterval(uploadProgressInterval);

      this.showMessage(
        'Erro no Upload da imagem , verifique o formato do arquivo ou o tamanho da imagem.',
        'error',
      );
      this.updateFile(uploadedFile.id, { error: true });
    }
  };

  updateFile = (id, data) => {
    this.setState(prevState => ({
      uploadedFiles: prevState.uploadedFiles.map(file =>
        file.id === id ? { ...file, ...data } : file,
      ),
    }));
  };

  handleSearchChange = event => {
    this.setState({ searchQuery: event.target.value });
  };

  handleSearchSubmit = async event => {
    if (event.key === 'Enter') {
      event.preventDefault();
      const { searchQuery, page = 1, filesPerPage = 40 } = this.state;
      if (searchQuery.length < 3) {
        this.showMessage(
          'Digite pelo menos 3 caracteres para realizar a busca',
          'error',
        );
        return;
      }
      try {
        const response = await api.get('/admin/uploads/images', {
          params: {
            name: searchQuery,
            limit: filesPerPage,
            offset: (page - 1) * filesPerPage,
          },
        });
        const uploadedFiles = response.data.images.map(file => ({
          ...file,
          uploaded: true,
          preview: file.url,
        }));
        this.setState({ uploadedFiles, hasMore: response.data.hasMore });
        this.showMessage('Busca realizada com sucesso', 'success');
      } catch (error) {
        this.showMessage('Erro ao buscar as imagens', 'error');
        console.error('Erro ao buscar as imagens:', error);
      }
    }
  };

  handleDelete = async id => {
    // Inicialize o progresso de exclusão com 0
    this.updateFile(id, { deleteProgress: 0 });

    // Simule o progresso da exclusão
    const deleteProgressInterval = setInterval(() => {
      this.setState(prevState => {
        const uploadedFiles = [...prevState.uploadedFiles];
        const file = uploadedFiles.find(file => file.id === id);

        // Aumente o progresso em 20 a cada segundo
        file.deleteProgress = Math.min(file.deleteProgress + 20, 100);

        return { uploadedFiles };
      });
    }, 1000);

    try {
      await api.delete(`admin/uploads/${id}`);

      // Pare a simulação do progresso quando a exclusão for concluída
      clearInterval(deleteProgressInterval);

      this.setState({
        uploadedFiles: this.state.uploadedFiles.filter(file => file.id !== id),
      });
      this.showMessage('Imagem Excluída', 'success');
    } catch (error) {
      // Pare a simulação do progresso se ocorrer um erro
      clearInterval(deleteProgressInterval);

      this.showMessage('Erro ao excluir a imagem', 'error');
    }
  };

  componentWillUnmount() {
    this.state.uploadedFiles.forEach(file => URL.revokeObjectURL(file.preview));
  }

  render() {
    const { uploadedFiles, message, messageType, searchQuery, hasMore, page } =
      this.state;

    return (
      <div className="container-upload">
        <h1>Upload de Imagens</h1>
        <Upload onUpload={this.handleUpload} />
        {uploadedFiles.length > 0 && (
          <FileList
            files={uploadedFiles}
            onDelete={this.handleDelete}
            hasMore={hasMore}
            onNextPage={this.handleNextPage}
            onPreviousPage={this.handlePreviousPage}
          />
        )}
        <div className="uploaded-images">
          <button onClick={this.handlePreviousPage} disabled={page === 1}>
            Voltar
          </button>
          <button onClick={this.handleNextPage} disabled={!hasMore}>
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
          onChange={this.handleSearchChange}
          onKeyDown={this.handleSearchSubmit}
          placeholder="Buscar imagens: Digite o nome da imagem e pressione enter... 🔍"
        />
      </div>
    );
  }
}
export default UploadImages;
