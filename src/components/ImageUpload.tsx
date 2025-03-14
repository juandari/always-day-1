import React, { useState } from "react";
import { Camera, Upload, CircleX, Image } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/components/ui/use-toast";
import CameraModal from "./camera-modal";
import { TextDivider } from "./text-divider";
import { getPromptAi } from "@/lib/get-prompt-ai";
import { useRecipe } from "@/context/recipe";
import safeParse from "@/lib/safe-parse";
import { identifyFood as identifyFoodPrompt } from "@/prompts/identify";

interface ImageUploadProps {
  onImageUpload: (uploaded: boolean) => void;
}

const ImageUpload = ({ onImageUpload }: ImageUploadProps) => {
  const {setData} = useRecipe()

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
        processImage();
      };
      reader.readAsDataURL(file);
    }
  };

  const processImage = async () => {
    setIsProcessing(true);
    setProgress(0);
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsProcessing(false);
          onImageUpload(true);
          toast({
            title: "Dish Recognition Complete",
            description:
              "We've identified your dish and prepared a recipe for you!",
            duration: 3000,
          });
          return 100;
        }
        return prev + 10;
      });
    }, 800);

    try {
      const session = await getPromptAi();
      const caputureImage = document.getElementById("uploaded-image");

      const result = await session.prompt([
        identifyFoodPrompt,
        { type: "image", content: caputureImage },
      ]);

      const _result = safeParse(result)
      setData({
        dish_name: _result.dish_name,
        match_percentage: _result.match_percentage,
      })
    } catch (error) {
      toast({
        title: "Error Occurred",
        description:
          error.message || "An error occurred while processing the image",
        duration: 3000,
      });
      console.log("error", error);
    }
  };

  const handleRemoveImage = () => {
    setImage(null);
    onImageUpload(false);
  };

  const onCaptureImage = (image: string) => {
    setImage(image);
    processImage();
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
          <>
            <div className="flex flex-col items-center space-y-4 cursor-pointer">
              <div className="p-4 rounded-full bg-primary/5 hover:bg-primary/10 transition-colors dark:bg-primary/10 dark:hover:bg-primary/20">
                <CameraModal onAccept={onCaptureImage}>
                  <Camera className="w-8 h-8 text-primary" />
                </CameraModal>
              </div>
              <div className="flex flex-col items-center gap-2 text-center">
                <span className="font-medium">
                  Take a photo or upload an image of any dish
                </span>
                <p className="text-sm text-muted-foreground max-w-md">
                  Our AI will identify the dish, list ingredients, and provide
                  cooking instructions
                </p>
              </div>

              <TextDivider>OR</TextDivider>

              <div className="col-span-2 mt-6 text-center">
                <Button
                  onClick={() =>
                    document.getElementById("image-upload")?.click()
                  }
                  size="lg"
                  className="bg-gradient-to-r from-primary to-primary/80"
                >
                  <Image className="w-5 h-5 mr-2" /> Upload a Dish Photo
                </Button>
                <p className="mt-2 text-sm text-muted-foreground">
                  Take a photo of any prepared dish or meal to get the recipe
                </p>
              </div>
            </div>
          </>
        ) : (
          <div className="relative w-full">
            <img
              src={image}
              id="uploaded-image"
              alt="Uploaded food"
              className="w-full h-full object-cover rounded-xl"
            />
            <button
              onClick={handleRemoveImage}
              className="absolute top-2 right-2 p-2 rounded-full bg-white/10 backdrop-blur-lg hover:bg-white/20 transition-colors dark:bg-black/30"
            >
              <CircleX className="w-5 h-5" />
            </button>
          </div>
        )}

        {isProcessing && (
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm rounded-2xl flex flex-col items-center justify-center gap-4">
            <Progress value={progress} className="w-56" />
            <p className="text-white text-sm">
              AI is analyzing your dish and generating a recipe...
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageUpload;
