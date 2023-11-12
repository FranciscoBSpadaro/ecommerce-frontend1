import React, { Component } from "react";
import { uniqueId } from "lodash";
import { filesize } from "filesize";
import api from "../../api";
import Upload from "./Uploads";
import FileList from "./FileList";

class UploadImages extends Component {
  state = {
    uploadedFiles: []
  };

  // Fetch the uploaded files from the API on component mount
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
      // show error message to the user
    }
  };

  // Handle file upload
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

    this.setState({
      uploadedFiles: [...this.state.uploadedFiles, ...uploadedFiles]
    });

    uploadedFiles.forEach(this.processUpload);
  };

  // Process file upload for the given uploaded file
  processUpload = async uploadedFile => {
    const data = new FormData();
    data.append("file", uploadedFile.file, uploadedFile.name);

    try {
      const response = await api.post("admin/uploads", data, {
        onUploadProgress: e => {
          const progress = parseInt(Math.round((e.loaded * 100) / e.total));
          this.updateFile(uploadedFile.id, { progress });
        }
      });

      this.updateFile(uploadedFile.id, {
        uploaded: true,
        id: response.data.id,
        url: response.data.url
      });
    } catch (error) {
      console.error(error);
      this.updateFile(uploadedFile.id, { error: true });
      // show error message to the user
    }
  };

  // Update the file with the given ID with the new data
  updateFile = (id, data) => {
    this.setState({
      uploadedFiles: this.state.uploadedFiles.map(file =>
        file.id === id ? { ...file, ...data } : file
      )
    });
  };

  // Delete the uploaded file with the given ID
  handleDelete = async id => {
    try {
      await api.delete(`admin/uploads/${id}`);
      this.setState({
        uploadedFiles: this.state.uploadedFiles.filter(file => file.id !== id)
      });
    } catch (error) {
      console.error(error);
      // show error message to the user
    }
  };

  // Revoke the object URL for the preview image on component unmount
  componentWillUnmount() {
    this.state.uploadedFiles.forEach(file => URL.revokeObjectURL(file.preview));
  }

  render() {
    const { uploadedFiles } = this.state;

    return (
      <div className="container-upload">
        <h1>Upload de Imagens</h1>
        <Upload onUpload={this.handleUpload} />
        {uploadedFiles.length > 0 && (
          <FileList files={uploadedFiles} onDelete={this.handleDelete} />
        )}
      </div>
    );
  }
}

export default UploadImages;
