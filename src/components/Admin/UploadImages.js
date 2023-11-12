import React, { Component } from "react";
import { uniqueId } from "lodash";
import { filesize } from "filesize";
import api from "../../api";
import Upload from "./Uploads";
import FileList from "./FileList";

class UploadImages extends Component {
  constructor(props) {
    super(props);
    this.state = {
      uploadedFiles: [],
      message: null,
      messageType: null // 'success' or 'error'
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
    this.fetchUploadedFiles();
  }

  fetchUploadedFiles = async () => {
    try {
      const response = await api.get("admin/uploads");
      const uploadedFiles = response.data.map(file => ({
        id: file.id,
        name: file.name,
        readableSize: filesize(file.size),
        preview: file.url,
        uploaded: true,
        url: file.url
      }));
      this.setState({ uploadedFiles });
    } catch (error) {
      console.error(error);
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
      url: null
    }));

    uploadedFiles.forEach(this.processUpload);
    
    this.setState(prevState => ({
      uploadedFiles: [...prevState.uploadedFiles, ...uploadedFiles]
    }));
  };

  processUpload = async uploadedFile => {
    const data = new FormData();
    data.append("file", uploadedFile.file, uploadedFile.name);
  
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
      const response = await api.post("admin/uploads", data);
  
      // Pare a simulação do progresso quando o upload for concluído
      clearInterval(uploadProgressInterval);
  
      this.updateFile(uploadedFile.id, {
        uploaded: true,
        id: response.data.id,
        url: response.data.url
      });
      this.showMessage('Upload de Imagem Concluído', 'success');
    } catch (error) {
      // Pare a simulação do progresso se ocorrer um erro
      clearInterval(uploadProgressInterval);
  
      this.showMessage('Erro no upload da imagem', 'error');
      this.updateFile(uploadedFile.id, { error: true });
    }
  };

  updateFile = (id, data) => {
    this.setState(prevState => ({
      uploadedFiles: prevState.uploadedFiles.map(file =>
        file.id === id ? { ...file, ...data } : file
      )
    }));
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
        uploadedFiles: this.state.uploadedFiles.filter(file => file.id !== id)
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
    const { uploadedFiles, message, messageType } = this.state;

    return (
      <div className="container-upload">
        <h1>Upload de Imagens</h1>
        <Upload onUpload={this.handleUpload} />
        {message && (
          <p style={{ color: messageType === 'success' ? 'green' : 'red' }}>
            {message}
          </p>
        )}
        {uploadedFiles.length > 0 && (
          <FileList files={uploadedFiles} onDelete={this.handleDelete} />
        )}
      </div>
    );
  }
}

export default UploadImages;
