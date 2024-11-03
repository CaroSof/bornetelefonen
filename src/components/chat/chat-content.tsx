'use client';

/**
 * ChatContent komponent til håndtering af chat interface
 * Viser chat beskeder, input felt og minimeret tilstand
 * Bruger memo for at optimere genrendering
 */

import { useRef, memo, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MinusIcon } from 'lucide-react';
import { cn } from "@/lib/utils";
import type { ChatContentProps } from '@/lib/types';

const ChatContent = memo(function ChatContent({ 
  chatRef, // Reference til chat container
  newMessage, // Besked input værdi
  setNewMessage, // Funktion til at opdatere besked input
  handleSendMessage, // Funktion til at sende beskeder
  isMinimized, // Om chatten er minimeret
  setIsMinimized, // Funktion til at ændre minimeret tilstand
  showMinimize, // Om minimer knap skal vises
  messages, // Array af chat beskeder
  counselor // Rådgiver information
}: ChatContentProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  // Automatisk fokus på input felt når chat åbnes
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isMinimized && inputRef.current) {
        inputRef.current.focus();
      }
    }, 100);
    return () => clearTimeout(timer);
  }, [isMinimized]);

  // Håndter ændringer i input felt
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewMessage(e.target.value);
  };

  // Håndter afsendelse af besked
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    handleSendMessage(e);
    // Sæt fokus tilbage på input efter afsendelse
    inputRef.current?.focus();
  };

  // Vis minimeret version af chatten
  if (isMinimized && showMinimize) {
    return (
      <button 
        onClick={(e) => {
          e.stopPropagation();
          setIsMinimized(false);
        }}
        className="p-4 flex items-center gap-2 w-full"
      >
        <img 
          src={counselor?.avatar} 
          alt={`${counselor?.name}'s avatar`}
          className="w-8 h-8 rounded-full bg-white"
        />
        <span className="font-medium">Chat med {counselor?.name}</span>
      </button>
    );
  }

  // Vis fuld chat interface
  return (
    <>
      {/* Chat overskrift med rådgiver info */}
      <div className="p-4 bg-teal-600 text-white flex items-center justify-between rounded-t-lg">
        <div className="flex items-center gap-3">
          <img 
            src={counselor?.avatar} 
            alt={`${counselor?.name}'s avatar`}
            className="w-12 h-12 rounded-full bg-white"
          />
          <div>
            <p className="font-medium">{counselor?.name}</p>
            <p className="text-sm opacity-75">Børnetelefonen Rådgiver</p>
          </div>
        </div>
        {/* Minimer knap */}
        {showMinimize && (
          <button 
            onClick={(e) => {
              e.stopPropagation();
              setIsMinimized(true);
            }}
            className="p-2 hover:bg-teal-700 rounded-full transition-colors"
          >
            <MinusIcon className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Besked container */}
      <div 
        ref={chatRef} 
        className="flex-1 overflow-y-auto p-4 space-y-4"
        onClick={(e) => e.stopPropagation()}
      >
        {messages.map((message) => (
          <div
            key={message.id}
            className={cn("flex", {
              "justify-end": message.sender === 'user',
              "justify-start": message.sender === 'counselor'
            })}
          >
            <div className={cn("max-w-[80%] rounded-lg p-3", {
              "bg-teal-500 text-white": message.sender === 'user',
              "bg-gray-100": message.sender === 'counselor'
            })}>
              <p>{message.text}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Input formular */}
      <div className="p-4 border-t">
        <form 
          onSubmit={handleSubmit} 
          className="flex gap-2"
          onClick={(e) => e.stopPropagation()}
        >
          <Input
            ref={inputRef}
            value={newMessage}
            onChange={handleChange}
            placeholder="Skriv din besked..."
            className="flex-1"
          />
          <Button 
            type="submit" 
            disabled={!newMessage.trim()}
            className="bg-teal-600 hover:bg-teal-700"
          >
            Send
          </Button>
        </form>
      </div>
    </>
  );
});

export default ChatContent;