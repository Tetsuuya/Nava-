import React, { useEffect, useRef, useState } from 'react';

type Tool = 'pen' | 'eraser';

const Scratchpad: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [brushColor, setBrushColor] = useState('#000000');
  const [brushSize, setBrushSize] = useState(2);
  const [selectedTool, setSelectedTool] = useState<Tool>('pen');
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
      
      // Get context
      const context = canvas.getContext('2d');
      if (!context) return;
      
      // Set default styles
      context.lineCap = 'round';
      context.strokeStyle = brushColor;
      context.lineWidth = brushSize;
      contextRef.current = context;
    };

    resizeCanvas();
    
    // Add resize listener
    window.addEventListener('resize', resizeCanvas);
    
    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []); // Remove brushColor and brushSize from dependencies

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas || !contextRef.current) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;

    contextRef.current.beginPath();
    contextRef.current.moveTo(x, y);
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !contextRef.current || !canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const scaleX = canvasRef.current.width / rect.width;
    const scaleY = canvasRef.current.height / rect.height;
    
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;

    if (selectedTool === 'eraser') {
      // Save the current state
      contextRef.current.save();
      // Set composite operation to destination-out to create eraser effect
      contextRef.current.globalCompositeOperation = 'destination-out';
    }

    contextRef.current.lineTo(x, y);
    contextRef.current.stroke();

    if (selectedTool === 'eraser') {
      // Restore the previous state
      contextRef.current.restore();
    }
  };

  const stopDrawing = () => {
    if (!contextRef.current) return;
    contextRef.current.closePath();
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    if (!canvasRef.current || !contextRef.current) return;
    contextRef.current.clearRect(
      0,
      0,
      canvasRef.current.width,
      canvasRef.current.height
    );
  };

  const handleToolChange = (tool: Tool) => {
    setSelectedTool(tool);
    // Don't change the color when switching tools - keep the current color
  };

  useEffect(() => {
    if (!contextRef.current) return;
    contextRef.current.strokeStyle = brushColor;
    contextRef.current.lineWidth = brushSize;
  }, [brushColor, brushSize]);

  return (
    <div className="flex flex-col items-center p-2 sm:p-4 bg-gray-100 min-h-screen">
      <div className="w-full max-w-6xl">
        <div className="mb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Scratchpad</h1>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 items-start sm:items-center w-full sm:w-auto">
            <div className="flex gap-2 w-full sm:w-auto">
              <button
                onClick={() => handleToolChange('pen')}
                className={`px-3 sm:px-4 py-2 text-sm sm:text-base transition-colors bg-[#D9D9D9] text-black rounded active:bg-gray-300 focus:outline-none focus:ring-1
              focus:ring-blue-200 disabled:opacity-50
               disabled:cursor-not-allowed flex-1 sm:flex-none`}
              >
                ✏️ Pen
              </button>
              <button
                onClick={() => handleToolChange('eraser')}
                className={`px-3 sm:px-4 py-2 text-sm sm:text-base bg-[#D9D9D9] text-black rounded active:bg-gray-300 focus:outline-none focus:ring-1
              focus:ring-blue-200 disabled:opacity-50
               disabled:cursor-not-allowed flex-1 sm:flex-none`}
              >
                🧹 Eraser
              </button>
            </div>
            <div className="flex gap-2 sm:gap-4 items-center w-full sm:w-auto">
              <input
                type="color"
                value={brushColor}
                onChange={(e) => setBrushColor(e.target.value)}
                className={`w-8 h-8 sm:w-10 sm:h-10 cursor-pointer ${
                  selectedTool === 'eraser' ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                disabled={selectedTool === 'eraser'}
              />
              <input
                type="range"
                min="1"
                max="20"
                value={brushSize}
                onChange={(e) => setBrushSize(Number(e.target.value))}
                className="w-24 sm:w-32"
              />
              <button
                onClick={clearCanvas}
                className="px-3 sm:px-4 py-2 text-sm sm:text-base bg-[#D9D9D9] text-black rounded active:bg-gray-300 focus:outline-none focus:ring-1
              focus:ring-blue-200 disabled:opacity-50
               disabled:cursor-not-allowed hover:bg-gray-200 transition-colors"
              >
                Clear
              </button>
            </div>
          </div>
        </div>
        <div className="border rounded-lg shadow-lg bg-white p-2">
          <canvas
            ref={canvasRef}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            style={{
              touchAction: 'none',
              cursor: selectedTool === 'pen' ? 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'24\' height=\'24\' viewBox=\'0 0 24 24\'%3E%3Cpath fill=\'%23000\' d=\'M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a.996.996 0 0 0 0-1.41l-2.34-2.34a.996.996 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z\'/%3E%3C/svg%3E") 0 24, auto' : 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'24\' height=\'24\' viewBox=\'0 0 24 24\'%3E%3Cpath fill=\'%23000\' d=\'M15.14 3c-.51 0-1.02.2-1.41.59L2.59 14.73c-.78.77-.78 2.04 0 2.83L6.41 21h3.75L21.41 9.73c.78-.77.78-2.04 0-2.83L18.56 4.05c-.39-.39-.9-.59-1.41-.59l-2.01.54z\'/%3E%3C/svg%3E") 0 24, auto'
            }}
            className="w-full h-full border rounded"
          />
        </div>
      </div>
    </div>
  );
};

export default Scratchpad;