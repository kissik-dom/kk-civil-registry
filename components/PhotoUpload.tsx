'use client';

import { useState, useRef, useCallback } from 'react';

interface PhotoUploadProps {
  value?: string;
  onChange: (photo: string | undefined) => void;
  size?: 'sm' | 'md' | 'lg';
}

export default function PhotoUpload({ value, onChange, size = 'md' }: PhotoUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [cropMode, setCropMode] = useState(false);
  const [rawImage, setRawImage] = useState<string | null>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [scale, setScale] = useState(1);
  const [dragging, setDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const sizeMap = { sm: 100, md: 160, lg: 220 };
  const dim = sizeMap[size];

  const processImage = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      setRawImage(dataUrl);
      setCropMode(true);
      setOffset({ x: 0, y: 0 });
      setScale(1);
    };
    reader.readAsDataURL(file);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files[0]) processImage(e.dataTransfer.files[0]);
  }, [processImage]);

  const applyCrop = useCallback(() => {
    if (!rawImage || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.onload = () => {
      // Output: 600x600 square for passport/ID quality
      canvas.width = 600;
      canvas.height = 600;
      ctx.fillStyle = '#0a0a0f';
      ctx.fillRect(0, 0, 600, 600);

      const fitScale = Math.max(600 / img.width, 600 / img.height) * scale;
      const drawW = img.width * fitScale;
      const drawH = img.height * fitScale;
      const drawX = (600 - drawW) / 2 + offset.x * fitScale;
      const drawY = (600 - drawH) / 2 + offset.y * fitScale;

      ctx.drawImage(img, drawX, drawY, drawW, drawH);
      const croppedDataUrl = canvas.toDataURL('image/jpeg', 0.92);
      onChange(croppedDataUrl);
      setCropMode(false);
      setRawImage(null);
    };
    img.src = rawImage;
  }, [rawImage, scale, offset, onChange]);

  const handleMouseDown = (e: React.MouseEvent) => {
    setDragging(true);
    setDragStart({ x: e.clientX - offset.x, y: e.clientY - offset.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!dragging) return;
    setOffset({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
  };

  const handleMouseUp = () => setDragging(false);

  return (
    <>
      <canvas ref={canvasRef} className="hidden" />

      {cropMode && rawImage ? (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-[#12121a] rounded-xl p-6 max-w-md w-full">
            <h3 className="text-royal-gold font-medium mb-4 text-center">Adjust Photo</h3>
            <p className="text-royal-cream/50 text-xs text-center mb-4">Drag to reposition. Use slider to zoom. Photo will be cropped to a square for official documents.</p>

            <div
              className="relative w-64 h-64 mx-auto overflow-hidden rounded-lg border-2 border-royal-gold/40 cursor-move"
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
            >
              <img
                src={rawImage}
                alt="Crop preview"
                className="absolute pointer-events-none"
                style={{
                  transformOrigin: 'center center',
                  transform: `translate(${offset.x}px, ${offset.y}px) scale(${scale})`,
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                  left: 0,
                  top: 0,
                }}
                draggable={false}
              />
              {/* Overlay corners */}
              <div className="absolute inset-0 pointer-events-none border border-royal-gold/30" />
            </div>

            <div className="mt-4 flex items-center gap-3">
              <span className="text-[10px] text-royal-cream/40">ZOOM</span>
              <input
                type="range"
                min="0.5"
                max="3"
                step="0.05"
                value={scale}
                onChange={(e) => setScale(parseFloat(e.target.value))}
                className="flex-1 accent-royal-gold"
              />
              <span className="text-xs text-royal-cream/60 w-10 text-right">{Math.round(scale * 100)}%</span>
            </div>

            <div className="flex gap-3 mt-5">
              <button
                onClick={() => { setCropMode(false); setRawImage(null); }}
                className="flex-1 py-2 text-sm rounded-lg border border-royal-gold/30 text-royal-cream/60 hover:text-royal-cream hover:border-royal-gold/60 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={applyCrop}
                className="flex-1 py-2 text-sm rounded-lg bg-royal-gold text-royal-dark font-medium hover:bg-royal-gold/90 transition-colors"
              >
                Apply Photo
              </button>
            </div>
          </div>
        </div>
      ) : null}

      <div
        className={`photo-upload rounded-lg flex flex-col items-center justify-center cursor-pointer relative overflow-hidden ${isDragging ? 'border-royal-gold bg-royal-gold/5' : ''}`}
        style={{ width: dim, height: dim }}
        onClick={() => fileInputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => { if (e.target.files?.[0]) processImage(e.target.files[0]); }}
        />

        {value ? (
          <>
            <img src={value} alt="Citizen photo" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
              <span className="text-xs text-royal-gold">Change Photo</span>
            </div>
          </>
        ) : (
          <>
            <svg className="w-8 h-8 text-royal-gold/40 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            <span className="text-[10px] text-royal-cream/40 text-center px-2">Click or drag photo</span>
            <span className="text-[9px] text-royal-cream/20 mt-1">Passport quality</span>
          </>
        )}
      </div>
    </>
  );
}
