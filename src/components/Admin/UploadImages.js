import React, { Component } from "react";
import { uniqueId } from "lodash";
import { filesize } from "filesize";
import api from "../../api";
import Upload from "./Uploads";
import FileList from "./FileList";


class Uploads extends Component {
    state = {
        uploadedFiles: []
    };

    async componentDidMount() {
        try {
            console.log('componentDidMount called');
            const response = await api.get("admin/uploads");
            console.log('API response:', response);
    
            // Verifique se os dados retornados pela API são diferentes dos dados atuais no estado
            if (JSON.stringify(this.state.uploadedFiles) !== JSON.stringify(response.data)) {
                this.setState({
                    uploadedFiles: response.data.map(file => ({
                        id: file._id,
                        name: file.name,
                        readableSize: filesize(file.size),
                        preview: file.url,
                        uploaded: true,
                        url: file.url
                    }))
                }, () => console.log('State updated:', this.state));
            }
        } catch (error) {
            console.error('API call failed:', error);
        }
    }

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
            uploadedFiles: this.state.uploadedFiles.concat(uploadedFiles)
        });

        uploadedFiles.forEach(this.processUpload);
    };

    updateFile = (id, data) => {
        this.setState({
            uploadedFiles: this.state.uploadedFiles.map(uploadedFile => {
                return id === uploadedFile.id
                    ? { ...uploadedFile, ...data }
                    : uploadedFile;
            })
        });
    };

    processUpload = uploadedFile => {
        const data = new FormData();

        data.append("file", uploadedFile.file, uploadedFile.name);

        api
            .post("admin/uploads", data, {
                onUploadProgress: e => {
                    const progress = parseInt(Math.round((e.loaded * 100) / e.total));

                    this.updateFile(uploadedFile.id, {
                        progress
                    });
                }
            })
            .then(response => {
                this.updateFile(uploadedFile.id, {
                    uploaded: true,
                    id: response.data._id,
                    url: response.data.url
                });
            })
            .catch(() => {
                this.updateFile(uploadedFile.id, {
                    error: true
                });
            });
    };

    handleDelete = async id => {
        await api.delete(`admin/uploads/${id}`);

        this.setState({
            uploadedFiles: this.state.uploadedFiles.filter(file => file.id !== id)
        });
    };

    componentWillUnmount() {
        this.state.uploadedFiles.forEach(file => URL.revokeObjectURL(file.preview));
    }

    render() {
        const { uploadedFiles } = this.state;

        return (
            <div className="container">
                <header>
                    <h1>Upload de Imagens</h1>
                </header>

                <main>
                    <Upload onUpload={this.handleUpload} />

                    {!!uploadedFiles.length && (
                        <FileList files={uploadedFiles} onDelete={this.handleDelete} />
                    )}
                </main>
            </div>
        );
    }
}


export default Uploads;
