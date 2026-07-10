// ──────────────────────────────────────────
// FileUpload Component
// ──────────────────────────────────────────

import { useState, useRef } from 'react';
import { Upload, X, FileText, Image } from 'lucide-react';
import { validateFile } from '../../utils/validators';
import { formatFileSize } from '../../utils/formatters';

function FileUpload({
  accept = 'image/jpeg,image/png,image/jpg,application/pdf',
  maxSize, // in bytes, defaults to FILE_LIMITS.MAX_SIZE_BYTES via validator
  onChange,
  value = null,
  error,
  label = 'Upload File',
  hint = 'JPG, PNG, atau PDF (maks. 5MB)',
  className = '',
}) {
  const [preview, setPreview] = useState(null);
  const [localError, setLocalError] = useState(null);
  const inputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate
    const validationError = validateFile(file, {
      allowedTypes: accept.split(',').map((t) => t.trim()),
      maxSizeBytes: maxSize,
    });

    if (validationError) {
      setLocalError(validationError);
      onChange?.(null);
      setPreview(null);
      return;
    }

    setLocalError(null);

    // Create preview for images
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (ev) => setPreview(ev.target.result);
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }

    onChange?.(file);
  };

  const handleRemove = () => {
    setPreview(null);
    setLocalError(null);
    onChange?.(null);
    if (inputRef.current) inputRef.current.value = '';
  };

  const displayError = error || localError;
  const fileInfo = value instanceof File ? value : null;
  const isImage = fileInfo?.type?.startsWith('image/');

  return (
    <div className={`file-upload ${className} ${displayError ? 'file-upload-error' : ''}`}>
      {label && <label className="file-upload-label">{label}</label>}

      {fileInfo ? (
        <div className="file-upload-preview">
          {isImage && preview ? (
            <div className="file-upload-image">
              <img src={preview} alt="Preview" />
            </div>
          ) : (
            <div className="file-upload-file-icon">
              <FileText size={32} />
            </div>
          )}
          <div className="file-upload-info">
            <span className="file-upload-name">{fileInfo.name}</span>
            <span className="file-upload-size">{formatFileSize(fileInfo.size)}</span>
          </div>
          <button
            type="button"
            className="file-upload-remove"
            onClick={handleRemove}
            aria-label="Hapus file"
          >
            <X size={18} />
          </button>
        </div>
      ) : (
        <div
          className="file-upload-dropzone"
          onClick={() => inputRef.current?.click()}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') inputRef.current?.click();
          }}
        >
          <Upload size={24} className="file-upload-dropzone-icon" />
          <span className="file-upload-dropzone-text">
            Klik untuk memilih file
          </span>
          {hint && <span className="file-upload-hint">{hint}</span>}
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleFileChange}
        className="file-upload-input"
        tabIndex={-1}
      />

      {displayError && <span className="file-upload-error-text">{displayError}</span>}
    </div>
  );
}

export default FileUpload;
