
import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI, LiveServerMessage, Modality, Blob } from '@google/genai';
import { X, Mic, MicOff, Volume2, VolumeX, Loader2, Sparkles, MessageSquare } from 'lucide-react';

interface AIVoiceAssistantProps {
  onClose: () => void;
  userContext: any;
}

const AIVoiceAssistant: React.FC<AIVoiceAssistantProps> = ({ onClose, userContext }) => {
  const [isActive, setIsActive] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcription, setTranscription] = useState('');
  const [error, setError] = useState<string | null>(null);

  const audioContextRef = useRef<AudioContext | null>(null);
  const nextStartTimeRef = useRef<number>(0);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  const inputAudioContextRef = useRef<AudioContext | null>(null);
  const sessionRef = useRef<any>(null);

  const decode = (base64: string) => {
    const binaryString = atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
  };

  const encode = (bytes: Uint8Array) => {
    let binary = '';
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  };

  const decodeAudioData = async (
    data: Uint8Array,
    ctx: AudioContext,
    sampleRate: number,
    numChannels: number,
  ): Promise<AudioBuffer> => {
    const dataInt16 = new Int16Array(data.buffer);
    const frameCount = dataInt16.length / numChannels;
    const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);
    for (let channel = 0; channel < numChannels; channel++) {
      const channelData = buffer.getChannelData(channel);
      for (let i = 0; i < frameCount; i++) {
        channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
      }
    }
    return buffer;
  };

  const createBlob = (data: Float32Array): Blob => {
    const l = data.length;
    const int16 = new Int16Array(l);
    for (let i = 0; i < l; i++) {
      int16[i] = data[i] * 32768;
    }
    return {
      data: encode(new Uint8Array(int16.buffer)),
      mimeType: 'audio/pcm;rate=16000',
    };
  };

  const startSession = async () => {
    try {
      setIsActive(true);
      setError(null);
      
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      inputAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-12-2025',
        callbacks: {
          onopen: () => {
            const source = inputAudioContextRef.current!.createMediaStreamSource(stream);
            const scriptProcessor = inputAudioContextRef.current!.createScriptProcessor(4096, 1, 1);
            scriptProcessor.onaudioprocess = (e) => {
              if (isMuted) return;
              const inputData = e.inputBuffer.getChannelData(0);
              const pcmBlob = createBlob(inputData);
              sessionPromise.then((session) => {
                session.sendRealtimeInput({ media: pcmBlob });
              });
            };
            source.connect(scriptProcessor);
            scriptProcessor.connect(inputAudioContextRef.current!.destination);
          },
          onmessage: async (message: LiveServerMessage) => {
            if (message.serverContent?.outputTranscription) {
              setTranscription(prev => prev + ' ' + message.serverContent?.outputTranscription?.text);
            }

            const base64EncodedAudioString = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
            if (base64EncodedAudioString && audioContextRef.current) {
              setIsSpeaking(true);
              nextStartTimeRef.current = Math.max(nextStartTimeRef.current, audioContextRef.current.currentTime);
              const audioBuffer = await decodeAudioData(
                decode(base64EncodedAudioString),
                audioContextRef.current,
                24000,
                1
              );
              const source = audioContextRef.current.createBufferSource();
              source.buffer = audioBuffer;
              source.connect(audioContextRef.current.destination);
              source.addEventListener('ended', () => {
                sourcesRef.current.delete(source);
                if (sourcesRef.current.size === 0) setIsSpeaking(false);
              });
              source.start(nextStartTimeRef.current);
              nextStartTimeRef.current += audioBuffer.duration;
              sourcesRef.current.add(source);
            }

            if (message.serverContent?.interrupted) {
              for (const source of sourcesRef.current.values()) {
                source.stop();
                sourcesRef.current.delete(source);
              }
              nextStartTimeRef.current = 0;
              setIsSpeaking(false);
            }
          },
          onerror: (e) => {
            console.error('Live API Error:', e);
            setError('Connection error. Please retry.');
          },
          onclose: () => setIsActive(false),
        },
        config: {
          responseModalities: [Modality.AUDIO],
          outputAudioTranscription: {},
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } },
          },
          systemInstruction: `You are the SkillBarter AI Guide. Help the user ${userContext.name} navigate the app.
          PERSONALITY: Talk like a real person—conversational, quick, and natural. Do NOT give long lectures.
          STYLE: Use very short sentences. Stop and let the user talk back. No corporate talk. 
          CONTEXT: User teaches ${userContext.skillsToTeach.join(', ')} and wants to learn ${userContext.skillsToLearn.join(', ')}.
          Be their helpful buddy who knows the app inside out.`
        }
      });

      sessionRef.current = await sessionPromise;
    } catch (err) {
      console.error(err);
      setError('Could not access microphone or connect to AI.');
      setIsActive(false);
    }
  };

  useEffect(() => {
    startSession();
    return () => {
      if (sessionRef.current) sessionRef.current.close();
      if (audioContextRef.current) audioContextRef.current.close();
      if (inputAudioContextRef.current) inputAudioContextRef.current.close();
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[110] bg-slate-900/90 backdrop-blur-xl flex items-center justify-center p-6 animate-fadeIn">
      <div className="bg-white rounded-[3rem] w-full max-w-md overflow-hidden shadow-2xl flex flex-col items-center p-10 relative">
        <button onClick={onClose} className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-900 transition-colors">
          <X size={24} />
        </button>

        <div className="w-24 h-24 bg-indigo-100 rounded-full flex items-center justify-center mb-8 relative">
          <div className={`absolute inset-0 bg-indigo-400 rounded-full opacity-20 ${isActive && !isMuted ? 'animate-ping' : ''}`}></div>
          <Sparkles className="text-indigo-600 relative z-10" size={40} />
        </div>

        <h3 className="text-2xl font-black text-slate-900 mb-2">SkillBarter Buddy</h3>
        <p className="text-slate-500 text-center text-sm mb-10 leading-relaxed">
          {isSpeaking ? "Buddy is talking..." : "Listening... Go ahead!"}
        </p>

        <div className="flex-1 w-full bg-slate-50 rounded-3xl p-6 mb-10 min-h-[150px] overflow-y-auto border border-slate-100 italic text-slate-400 text-sm">
          {transcription || "Say something like 'How do I get more credits?'..."}
        </div>

        {error && <p className="text-rose-500 text-xs mb-6 font-bold">{error}</p>}

        <div className="flex items-center gap-6">
          <button 
            onClick={() => setIsMuted(!isMuted)}
            className={`w-16 h-16 rounded-full flex items-center justify-center transition-all shadow-xl ${isMuted ? 'bg-rose-100 text-rose-600' : 'bg-slate-100 text-slate-600'}`}
          >
            {isMuted ? <MicOff size={28} /> : <Mic size={28} />}
          </button>

          <button 
            onClick={onClose}
            className="px-10 py-5 bg-indigo-600 text-white font-black rounded-3xl shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-95"
          >
            I'm Done
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIVoiceAssistant;
