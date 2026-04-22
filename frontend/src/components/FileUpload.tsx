import React, { useRef } from 'react';
import { FiUploadCloud } from 'react-icons/fi';
import toast from 'react-hot-toast';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  isLoading: boolean;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileSelect, isLoading }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.currentTarget.classList.add('border-primary', 'bg-blue-50');
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.currentTarget.classList.remove('border-primary', 'bg-blue-50');
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.currentTarget.classList.remove('border-primary', 'bg-blue-50');

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      validateAndSelect(file);
    }
  };

  const validateAndSelect = (file: File) => {
    const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    const validExtensions = ['.pdf', '.doc', '.docx'];

    const ext = '.' + file.name.split('.').pop()?.toLowerCase();

    if (!validTypes.includes(file.type) && !validExtensions.includes(ext)) {
      toast.error('Please upload a PDF, DOC, or DOCX file');
      return;
    }

    if (file.size > 50 * 1024 * 1024) {
      toast.error('File size must be less than 50MB');
      return;
    }

    onFileSelect(file);
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-primary transition-colors cursor-pointer"
      onClick={() => fileInputRef.current?.click()}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.doc,.docx"
        onChange={(e) => {
          if (e.target.files?.[0]) {
            validateAndSelect(e.target.files[0]);
          }
        }}
        className="hidden"
        disabled={isLoading}
      />

      <FiUploadCloud className="mx-auto text-4xl text-gray-400 mb-4" />
      <h3 className="text-lg font-semibold text-gray-700 mb-2">
        Upload Research Paper
      </h3>
      <p className="text-gray-500 mb-4">
        Drag and drop your PDF, DOC, or DOCX file here, or click to browse
      </p>
      <p className="text-sm text-gray-400">Maximum file size: 50MB</p>
    </div>
  );
};

export default FileUpload;
