
import React, { useState, useEffect } from 'react';
import { Play, Pause, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';

interface TimerProps {
  minutes: number;
  stepNumber: number;
}

const Timer: React.FC<TimerProps> = ({ minutes, stepNumber }) => {
  const [seconds, setSeconds] = useState(minutes * 60);
  const [isActive, setIsActive] = useState(false);
  const [progress, setProgress] = useState(100);
  const totalSeconds = minutes * 60;
  const { toast } = useToast();

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (isActive && seconds > 0) {
      interval = setInterval(() => {
        setSeconds(prevSeconds => {
          const newSeconds = prevSeconds - 1;
          setProgress((newSeconds / totalSeconds) * 100);
          return newSeconds;
        });
      }, 1000);
    } else if (isActive && seconds === 0) {
      setIsActive(false);
      toast({
        title: "Timer Complete!",
        description: `Step ${stepNumber} is ready!`,
        duration: 5000,
      });
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, seconds, stepNumber, toast, totalSeconds]);

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    setSeconds(minutes * 60);
    setProgress(100);
  };

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="w-full space-y-2">
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium">{formatTime(seconds)}</span>
        <div className="space-x-1">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={toggleTimer}
            className="h-7 w-7 p-0"
          >
            {isActive ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={resetTimer}
            className="h-7 w-7 p-0"
          >
            <RefreshCw className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
      <Progress value={progress} className="h-2" />
    </div>
  );
};

export default Timer;
