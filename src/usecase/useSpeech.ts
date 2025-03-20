import { useState, useRef } from "react";
import { useToast } from "@/components/ui/use-toast";
import type { Instruction, Question } from "@/entity/recipe/types";

interface Props {
  instructions: Instruction[];
  questions: Record<number, Question[]>;
  scrollTo: (id: string) => void;
  markComplete: (id: number) => void;
  askQuestion: (index: number, question: string) => void;
}

const useSpeech = ({
  instructions,
  questions,
  scrollTo,
  markComplete,
  askQuestion,
}: Props) => {
  const { toast } = useToast();
  const synth = useRef<SpeechSynthesis | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recognition = useRef<any>(null);
  const [speechCommandsActive, setSpeechCommandsActive] = useState(false);

  const toggleSpeechCommands = () => {
    const newState = !speechCommandsActive;
    setSpeechCommandsActive(newState);

    if (typeof window !== "undefined" && !synth.current) {
      synth.current = window.speechSynthesis;
    }

    if (newState) {
      toast({
        title: "Speech Commands Activated",
        description: "Say 'hey' followed by your command.",
      });

      if (
        typeof window !== "undefined" &&
        ("SpeechRecognition" in window || "webkitSpeechRecognition" in window)
      ) {
        const SpeechRecognitionAPI =
          // @ts-expect-error ignore for now
          window.SpeechRecognition || window.webkitSpeechRecognition;
        if (SpeechRecognitionAPI) {
          recognition.current = new SpeechRecognitionAPI();
          recognition.current.continuous = true;
          recognition.current.interimResults = false;

          // @ts-expect-error ignore for now
          recognition.current.onresult = (event: SpeechRecognitionEvent) => {
            const command =
              event.results[
                event.results.length - 1
              ][0].transcript.toLowerCase();
            // console.log("Speech command detected:", command);
            toast({
              title: "Speech command detected:",
              description: command,
            });

            if (command.includes("hey")) {
              if (synth.current) {
                const utterance = new SpeechSynthesisUtterance(
                  "Yes, I'm listening"
                );
                synth.current.speak(utterance);
              }
            }

            if (command.includes("what is step")) {
              let utterance = null;
              if (command.includes("one") || command.includes("1")) {
                scrollTo(`step_1`);
                utterance = new SpeechSynthesisUtterance(
                  `${instructions[0].step}, ${instructions[0].description}.`
                );
              } else if (command.includes("two") || command.includes("2")) {
                scrollTo(`step_2`);
                utterance = new SpeechSynthesisUtterance(
                  `${instructions[1].step}, ${instructions[1].description}.`
                );
              } else if (command.includes("three") || command.includes("3")) {
                scrollTo(`step_3`);
                utterance = new SpeechSynthesisUtterance(
                  `${instructions[2].step}, ${instructions[2].description}.`
                );
              } else if (command.includes("four") || command.includes("4")) {
                scrollTo(`step_4`);
                utterance = new SpeechSynthesisUtterance(
                  `${instructions[3].step}, ${instructions[3].description}.`
                );
              } else if (command.includes("five") || command.includes("5")) {
                scrollTo(`step_5`);
                utterance = new SpeechSynthesisUtterance(
                  `${instructions[4].step}, ${instructions[4].description}.`
                );
              } else if (command.includes("six") || command.includes("6")) {
                scrollTo(`step_6`);
                utterance = new SpeechSynthesisUtterance(
                  `${instructions[5].step}, ${instructions[5].description}.`
                );
              } else if (command.includes("seven") || command.includes("7")) {
                scrollTo(`step_7`);
                utterance = new SpeechSynthesisUtterance(
                  `${instructions[6].step}, ${instructions[6].description}.`
                );
              } else if (command.includes("eight") || command.includes("8")) {
                scrollTo(`step_8`);
                utterance = new SpeechSynthesisUtterance(
                  `${instructions[7].step}, ${instructions[7].description}.`
                );
              } else if (command.includes("nine") || command.includes("9")) {
                scrollTo(`step_9`);
                utterance = new SpeechSynthesisUtterance(
                  `${instructions[8].step}, ${instructions[8].description}.`
                );
              } else if (command.includes("ten") || command.includes("10")) {
                scrollTo(`step_10`);
                utterance = new SpeechSynthesisUtterance(
                  `${instructions[9].step}, ${instructions[9].description}.`
                );
              } else {
                utterance = new SpeechSynthesisUtterance(
                  "I couln't understand which step you are mentioning, please try again."
                );
              }

              synth.current.speak(utterance);
            }

            if (command.includes("mark as complete step")) {
              let utterance = null;
              if (command.includes("one") || command.includes("1")) {
                scrollTo(`step_1`);
                markComplete(0);
                utterance = new SpeechSynthesisUtterance(
                  `Marked step 1 as complete`
                );
              } else if (command.includes("two") || command.includes("2")) {
                scrollTo(`step_2`);
                markComplete(1);
                utterance = new SpeechSynthesisUtterance(
                  `Marked step 2 as complete`
                );
              } else if (command.includes("three") || command.includes("3")) {
                scrollTo(`step_3`);
                markComplete(2);
                utterance = new SpeechSynthesisUtterance(
                  `Marked step 3 as complete`
                );
              } else if (command.includes("four") || command.includes("4")) {
                scrollTo(`step_4`);
                markComplete(3);
                utterance = new SpeechSynthesisUtterance(
                  `Marked step 4 as complete`
                );
              } else if (command.includes("five") || command.includes("5")) {
                scrollTo(`step_5`);
                markComplete(4);
                utterance = new SpeechSynthesisUtterance(
                  `Marked step 5 as complete`
                );
              } else if (command.includes("six") || command.includes("6")) {
                scrollTo(`step_6`);
                markComplete(5);
                utterance = new SpeechSynthesisUtterance(
                  `Marked step 6 as complete`
                );
              } else if (command.includes("seven") || command.includes("7")) {
                scrollTo(`step_7`);
                markComplete(6);
                utterance = new SpeechSynthesisUtterance(
                  `Marked step 7 as complete`
                );
              } else if (command.includes("eight") || command.includes("8")) {
                scrollTo(`step_8`);
                markComplete(7);
                utterance = new SpeechSynthesisUtterance(
                  `Marked step 8 as complete`
                );
              } else if (command.includes("nine") || command.includes("9")) {
                scrollTo(`step_9`);
                markComplete(8);
                utterance = new SpeechSynthesisUtterance(
                  `Marked step 9 as complete`
                );
              } else if (command.includes("ten") || command.includes("10")) {
                scrollTo(`step_10`);
                markComplete(9);
                utterance = new SpeechSynthesisUtterance(
                  `Marked step 10 as complete`
                );
              } else {
                utterance = new SpeechSynthesisUtterance(
                  "I couln't understand which step you are mentioning, please try again."
                );
              }

              synth.current.speak(utterance);
            }

            if (command.toLowerCase().includes("i have a question for step")) {
              let utterance = null;
              if (command.includes("one") || command.includes("1")) {
                scrollTo(`step_1`);
                const question = command.split("one");
                askQuestion(0, question[1]);
                utterance = new SpeechSynthesisUtterance(question[1]);
              } else if (command.includes("two") || command.includes("2")) {
                scrollTo(`step_2`);
                const question = command.split("two");
                askQuestion(1, question[1]);
                utterance = new SpeechSynthesisUtterance(question[1]);
              } else if (command.includes("three") || command.includes("3")) {
                scrollTo(`step_3`);
                const question = command.split("three");
                askQuestion(2, question[1]);
                utterance = new SpeechSynthesisUtterance(question[1]);
              } else if (command.includes("four") || command.includes("4")) {
                scrollTo(`step_4`);
                const question = command.split("four");
                askQuestion(3, question[1]);
                utterance = new SpeechSynthesisUtterance(question[1]);
              } else if (command.includes("five") || command.includes("5")) {
                scrollTo(`step_5`);
                const question = command.split("five");
                askQuestion(4, question[1]);
                utterance = new SpeechSynthesisUtterance(question[1]);
              } else if (command.includes("six") || command.includes("6")) {
                scrollTo(`step_6`);
                const question = command.split("six");
                askQuestion(5, question[1]);
                utterance = new SpeechSynthesisUtterance(question[1]);
              } else if (command.includes("seven") || command.includes("7")) {
                scrollTo(`step_7`);
                const question = command.split("seven");
                askQuestion(6, question[1]);
                utterance = new SpeechSynthesisUtterance(question[1]);
              } else if (command.includes("eight") || command.includes("8")) {
                scrollTo(`step_8`);
                const question = command.split("eight");
                askQuestion(7, question[1]);
                utterance = new SpeechSynthesisUtterance(question[1]);
              } else if (command.includes("nine") || command.includes("9")) {
                scrollTo(`step_9`);
                const question = command.split("nine");
                askQuestion(8, question[1]);
                utterance = new SpeechSynthesisUtterance(question[1]);
              } else if (command.includes("ten") || command.includes("10")) {
                scrollTo(`step_10`);
                const question = command.split("ten");
                askQuestion(9, question[1]);
                utterance = new SpeechSynthesisUtterance(question[1]);
              } else {
                utterance = new SpeechSynthesisUtterance(
                  "I couln't understand you, please try again."
                );
              }
              synth.current.speak(utterance);
            }
          };

          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          recognition.current.onerror = (event: any) => {
            console.error("Speech recognition error", event.error);
          };

          try {
            recognition.current.start();
          } catch (error) {
            console.error("Error starting speech recognition:", error);
          }
        }
      } else {
        toast({
          title: "Speech Recognition Not Supported",
          description: "Your browser doesn't support speech recognition.",
          variant: "destructive",
        });
      }
    } else {
      toast({
        title: "Speech Commands Deactivated",
        description: "Voice control is now turned off.",
      });

      if (recognition.current) {
        try {
          recognition.current.stop();
        } catch (error) {
          console.error("Error stopping speech recognition:", error);
        }
      }

      if (synth.current) {
        synth.current.cancel();
      }
    }
  };

  const speakOut = (message: string) => {
    if (typeof window !== "undefined" && !synth.current) {
      synth.current = window.speechSynthesis;
    }

    if (synth.current) {
      const utterance = new SpeechSynthesisUtterance(message);
      synth.current.speak(utterance);
    }
  };

  return {
    speechCommandsActive,
    toggleSpeechCommands,
    speakOut,
  };
};

export default useSpeech;
