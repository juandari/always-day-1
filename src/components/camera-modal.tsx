"use client"

import { useState, useRef, useEffect, ReactNode, PropsWithChildren } from "react"
import {  SwitchCamera as FlipCamera, X, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { cn } from "@/lib/utils"

interface Props { 
  onAccept: (image : string) => void
}
export default function CameraModal(props : PropsWithChildren<Props>) {

  const [open, setOpen] = useState(false)
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [facingMode, setFacingMode] = useState<"user" | "environment">("environment")
  const [capturedImage, setCapturedImage] = useState<string | null>(null)
  const [isCapturing, setIsCapturing] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const startCamera = async () => {
    try {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop())
      }

      const newStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode,
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      })

      setStream(newStream)

      if (videoRef.current) {
        videoRef.current.srcObject = newStream
      }

      setCapturedImage(null)
    } catch (err) {
      console.error("Error accessing camera:", err)
    }
  }

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop())
      setStream(null)
    }
  }

  const toggleCamera = () => {
    setFacingMode((prev) => (prev === "user" ? "environment" : "user"))
  }

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return

    setIsCapturing(true)

    const video = videoRef.current
    const canvas = canvasRef.current
    const context = canvas.getContext("2d")

    if (!context) return

    // Set canvas dimensions to match video
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight

    // Draw the current video frame to the canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height)

    // Convert canvas to data URL
    const imageDataUrl = canvas.toDataURL("image/jpeg")
    setCapturedImage(imageDataUrl)
    setIsCapturing(false)
  }

  const retakePhoto = () => {
    setCapturedImage(null)
  }

  const acceptPhoto = () => {
    // Here you would typically save or process the captured image
    props.onAccept(capturedImage)
    setOpen(false)
  }

  useEffect(() => {
    if (open) {
      startCamera()
    } else {
      stopCamera()
    }
  }, [open, facingMode])

  useEffect(() => {
    return () => {
      stopCamera()
    }
  }, [])

  return (
    <div>
      <Dialog open={open} onOpenChange={setOpen} modal={true}>
        <DialogTrigger asChild>
          {props.children}
        </DialogTrigger>
        <DialogContent className="max-w-full w-full h-full p-0 m-0 border-none rounded-none sm:rounded-none">
          <div className="relative w-full h-full flex flex-col bg-black">
            {/* Close button */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 z-10 rounded-full bg-background/20 backdrop-blur-sm hover:bg-background/40 text-white"
              onClick={() => setOpen(false)}
            >
              <X className="h-5 w-5" />
            </Button>

            {/* Camera view or captured image */}
            <div className="flex-1 relative">
              {!capturedImage ? (
                <>
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className={cn(
                      "absolute inset-0 w-full h-full object-cover",
                      facingMode === "user" && "scale-x-[-1]",
                    )}
                  />
                  <canvas ref={canvasRef} className="hidden" />
                </>
              ) : (
                <img
                  src={capturedImage || "/placeholder.svg"}
                  alt="Captured"
                  className={cn("absolute inset-0 w-full h-full object-cover", facingMode === "user" && "scale-x-[-1]")}
                />
              )}
            </div>

            {/* Camera controls */}
            <div className="flex items-center justify-between p-6 bg-black">
              {!capturedImage ? (
                <>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full bg-white/10 text-white hover:bg-white/20"
                    onClick={toggleCamera}
                  >
                    <FlipCamera className="h-6 w-6" />
                  </Button>
                  <Button
                    variant="default"
                    size="icon"
                    className="h-16 w-16 rounded-full bg-white"
                    onClick={capturePhoto}
                    disabled={isCapturing || !stream}
                  >
                    <div className="h-14 w-14 rounded-full border-2 border-black" />
                  </Button>
                  <div className="w-12" /> {/* Spacer for balance */}
                </>
              ) : (
                <>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full bg-white/10 text-white hover:bg-white/20"
                    onClick={retakePhoto}
                  >
                    <X className="h-6 w-6" />
                  </Button>
                  <Button
                    variant="default"
                    size="icon"
                    className="h-16 w-16 rounded-full bg-green-500 hover:bg-green-600"
                    onClick={acceptPhoto}
                  >
                    <Check className="h-8 w-8 text-white" />
                  </Button>
                  <div className="w-12" /> {/* Spacer for balance */}
                </>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

