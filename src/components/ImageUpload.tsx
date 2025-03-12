
import React, { useState } from 'react';
import { Camera, Upload, CircleX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/components/ui/use-toast';

const ImageUpload = () => {
  const [image, setImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const { toast } = useToast();

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImage(e.target?.result as string);
        simulateProcessing();
      };
      reader.readAsDataURL(file);
    }
  };

  const simulateProcessing = () => {
    setIsProcessing(true);
    setProgress(0);
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsProcessing(false);
          return 100;
        }
        return prev + 10;
      });
    }, 300);
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-6">
      <div className="relative glass p-8 flex flex-col items-center justify-center min-h-[300px] transition-all duration-300">
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="hidden"
          id="image-upload"
        />
        
        {!image ? (
          <label
            htmlFor="image-upload"
            className="flex flex-col items-center space-y-4 cursor-pointer"
          >
            <div className="p-4 rounded-full bg-primary/5 hover:bg-primary/10 transition-colors">
              <Camera className="w-8 h-8 text-primary" />
            </div>
            <div className="flex items-center gap-2">
              <Upload className="w-4 h-4" />
              <span>Upload or take a photo</span>
            </div>
          </label>
        ) : (
          <div className="relative w-full">
            <img
              src={image}
              alt="Uploaded food"
              className="w-full h-full object-cover rounded-xl"
            />
            <button
              onClick={() => setImage(null)}
              className="absolute top-2 right-2 p-2 rounded-full bg-white/10 backdrop-blur-lg hover:bg-white/20 transition-colors"
            >
              <CircleX className="w-5 h-5" />
            </button>
          </div>
        )}

        {isProcessing && (
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm rounded-2xl flex flex-col items-center justify-center gap-4">
            <Progress value={progress} className="w-56" />
            <p className="text-white text-sm">AI is analyzing your dish...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageUpload;
