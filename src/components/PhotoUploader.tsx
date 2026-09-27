import React, { useRef, useState } from 'react';
import { 
  UploadCloud, 
  Camera, 
  Image as ImageIcon, 
  Check, 
  X, 
  RotateCw, 
  Link as LinkIcon, 
  AlertCircle 
} from 'lucide-react';
import { processImageFile, formatFileSize, ProcessedImageResult } from '../lib/imageCompression';

interface PhotoUploaderProps {
  value: string;
  onChange: (imageUrl: string) => void;
  required?: boolean;
  presets?: { label: string; url: string }[];
}

export const PhotoUploader: React.FC<PhotoUploaderProps> = ({
  value,
  onChange,
  required = false,
  presets = []
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [photoMeta, setPhotoMeta] = useState<{
    fileName?: string;
    sizeFormatted?: string;
    dimensions?: string;
  } | null>(null);
  
  // State to toggle manual URL input if needed
  const [showUrlFallback, setShowUrlFallback] = useState(false);
  const [urlInput, setUrlInput] = useState('');

  const handleFile = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setErrorMessage('Please upload a valid image file (JPG, PNG, WebP, etc.)');
      return;
    }

    setIsProcessing(true);
    setErrorMessage(null);

    try {
      const result: ProcessedImageResult = await processImageFile(file, 1200, 1200, 0.85);
      onChange(result.dataUrl);
      setPhotoMeta({
        fileName: result.fileName,
        sizeFormatted: formatFileSize(result.compressedSize),
        dimensions: `${result.width} × ${result.height}px`
      });
    } catch (err: any) {
      setErrorMessage(err.message || 'Error processing photo. Please try another image.');
    } finally {
      setIsProcessing(false);
    }
  };

  const onFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleRemovePhoto = () => {
    onChange('');
    setPhotoMeta(null);
    setErrorMessage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleApplyUrl = () => {
    if (urlInput.trim()) {
      onChange(urlInput.trim());
      setPhotoMeta({ fileName: 'Web Image URL' });
      setUrlInput('');
      setShowUrlFallback(false);
    }
  };

  const hasPhoto = Boolean(value && value.trim().length > 0);

  return (
    <div className="space-y-3">
      {/* Label and Mode Indicator */}
      <div className="flex items-center justify-between">
        <label className="flex items-center gap-1.5 text-xs font-bold text-stone-700 uppercase tracking-wider">
          <Camera className="w-3.5 h-3.5 text-[#8E3B52]" />
          <span>Product Photo {required && <span className="text-rose-500">*</span>}</span>
        </label>

        <button
          type="button"
          onClick={() => setShowUrlFallback(!showUrlFallback)}
          className="text-[11px] text-stone-500 hover:text-[#8E3B52] font-medium flex items-center gap-1 transition-colors"
        >
          <LinkIcon className="w-3 h-3" />
          {showUrlFallback ? 'Back to Photo Upload' : 'Use web link / presets'}
        </button>
      </div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={onFileInputChange}
        className="hidden"
        id="product-photo-upload"
      />

      {/* Error Message */}
      {errorMessage && (
        <div className="flex items-center gap-2 p-2.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
          <span>{errorMessage}</span>
          <button
            type="button"
            onClick={() => setErrorMessage(null)}
            className="ml-auto text-rose-400 hover:text-rose-600"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Primary: Photo Upload & Preview UI */}
      {!showUrlFallback ? (
        <div>
          {hasPhoto ? (
            /* Active Photo Preview Box */
            <div className="relative p-3.5 bg-white border-2 border-emerald-300 rounded-2xl shadow-xs overflow-hidden">
              <div className="flex flex-col sm:flex-row items-center gap-4">
                {/* Photo Thumbnail */}
                <div className="relative w-28 h-28 sm:w-24 sm:h-24 rounded-xl overflow-hidden border border-stone-200 shrink-0 bg-stone-50 shadow-inner group">
                  <img
                    src={value}
                    alt="Product preview"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                  <div className="absolute bottom-1 right-1 bg-black/60 backdrop-blur-xs text-white p-1 rounded-md">
                    <Check className="w-3 h-3 text-emerald-400" />
                  </div>
                </div>

                {/* Photo Info & Actions */}
                <div className="flex-1 text-center sm:text-left min-w-0">
                  <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                      <Check className="w-3 h-3" /> Photo Attached
                    </span>
                    {photoMeta?.sizeFormatted && (
                      <span className="text-[11px] text-stone-500 font-medium">
                        {photoMeta.sizeFormatted}
                      </span>
                    )}
                  </div>

                  <p className="text-xs font-semibold text-stone-800 truncate mb-1" title={photoMeta?.fileName || 'Product Photo'}>
                    {photoMeta?.fileName || 'Photo uploaded from device'}
                  </p>

                  {photoMeta?.dimensions && (
                    <p className="text-[10px] text-stone-400 mb-3">
                      Dimensions: {photoMeta.dimensions}
                    </p>
                  )}

                  {/* Actions */}
                  <div className="flex items-center justify-center sm:justify-start gap-2">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isProcessing}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-rose-50 hover:text-[#8E3B52] text-xs font-semibold text-stone-700 transition-colors cursor-pointer"
                    >
                      <RotateCw className="w-3.5 h-3.5" />
                      <span>Change Photo</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleRemovePhoto}
                      disabled={isProcessing}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-rose-200 hover:bg-rose-50 text-xs font-semibold text-rose-600 transition-colors cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                      <span>Remove</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Upload Dropzone */
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`relative border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all duration-200 ${
                isDragging
                  ? 'border-[#8E3B52] bg-rose-50/70 scale-[0.99]'
                  : 'border-rose-200 bg-[#FAF6F6]/80 hover:bg-[#FAF6F6] hover:border-[#8E3B52]/50'
              }`}
            >
              {isProcessing ? (
                <div className="py-4 flex flex-col items-center justify-center text-center">
                  <div className="w-8 h-8 border-3 border-[#8E3B52] border-t-transparent rounded-full animate-spin mb-2" />
                  <p className="text-xs font-bold text-stone-700">Processing & Optimizing Photo...</p>
                  <p className="text-[10px] text-stone-400">Preparing high-resolution photo for store</p>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center">
                  <div className="w-12 h-12 rounded-2xl bg-white shadow-xs border border-rose-100 flex items-center justify-center text-[#8E3B52] mb-3 group-hover:scale-110 transition-transform">
                    <UploadCloud className="w-6 h-6" />
                  </div>

                  <p className="text-xs font-bold text-stone-800 mb-1">
                    Click to upload photo from your device
                  </p>
                  <p className="text-[11px] text-stone-500 mb-3">
                    Drag and drop or select from Photos / Files (JPG, PNG, WebP)
                  </p>

                  <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#8E3B52] text-white text-xs font-semibold hover:bg-[#783145] transition-colors shadow-xs">
                    <Camera className="w-3.5 h-3.5" />
                    <span>Select Photo</span>
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        /* Optional Fallback: URL Link & Presets */
        <div className="p-3.5 bg-[#FAF6F6] rounded-2xl border border-rose-200 space-y-3">
          <div>
            <span className="text-[11px] font-bold text-stone-700 block mb-1">
              Enter Image URL:
            </span>
            <div className="flex gap-2">
              <input
                type="url"
                placeholder="https://images.unsplash.com/..."
                value={urlInput || (hasPhoto && !value.startsWith('data:') ? value : '')}
                onChange={(e) => setUrlInput(e.target.value)}
                className="flex-1 p-2 bg-white border border-rose-200 rounded-xl text-xs font-mono focus:outline-none focus:ring-1 focus:ring-[#8E3B52]"
              />
              <button
                type="button"
                onClick={handleApplyUrl}
                className="px-3 py-1.5 bg-[#8E3B52] text-white rounded-xl text-xs font-semibold hover:bg-[#783145]"
              >
                Apply
              </button>
            </div>
          </div>

          {presets.length > 0 && (
            <div>
              <span className="text-[10px] text-stone-500 font-semibold uppercase tracking-wider block mb-1.5">
                Or choose from quick presets:
              </span>
              <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
                {presets.map((preset) => (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => {
                      onChange(preset.url);
                      setPhotoMeta({ fileName: preset.label });
                      setShowUrlFallback(false);
                    }}
                    className={`text-[11px] px-2 py-1 rounded-lg transition-colors ${
                      value === preset.url
                        ? 'bg-[#8E3B52] text-white font-semibold'
                        : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-50'
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="pt-1 text-right">
            <button
              type="button"
              onClick={() => setShowUrlFallback(false)}
              className="text-[11px] font-medium text-[#8E3B52] hover:underline"
            >
              ← Back to Photo Upload
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
