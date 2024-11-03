/**
 * Type definition for en rådgiver
 */
export type Counselor = {
    id: number;            // Unik identifikator
    name: string;          // Rådgiverens navn
    gender: 'male' | 'female'; // Rådgiverens køn
    avatar: string;        // Sti til profilbillede
  };
  
/**
 * Type definition for en chat besked
 */
export type Message = {
    id: string;                    // Unik besked ID
    sender: 'user' | 'counselor';  // Afsender af beskeden
    text: string;                  // Beskedens indhold
    timestamp: Date;               // Tidspunkt for beskeden
  };

/**
 * Type definition for humør/sindstilstand
 */
export type Mood = {
    icon: string;      // Ikon der repræsenterer humøret
    label: string;     // Kort beskrivelse
    description: string; // Uddybende beskrivelse
    color: string;     // Farve til visuel indikation
  }
  
/**
 * Type definition for formular fejl
 */
export type FormErrors = {
    name?: string;         // Fejl i navn felt
    message?: string;      // Fejl i besked felt
    phone?: string;        // Fejl i telefon felt
    preferredTime?: string; // Fejl i foretrukket tid felt
  };
  
/**
 * Type definition for chat tilstande
 */
export type ChatState = 'initial' | 'queuing' | 'connecting' | 'chatting' | 'ended';
  
/**
 * Interface for ChatContent komponentens props
 */
export interface ChatContentProps {
  chatRef: React.RefObject<HTMLDivElement>;  // Reference til chat container
  newMessage: string;                        // Ny besked tekst
  setNewMessage: (message: string) => void;  // Funktion til at opdatere besked
  handleSendMessage: (e: React.FormEvent) => void; // Håndter afsendelse af besked
  isMinimized: boolean;                      // Om chatten er minimeret
  setIsMinimized: (isMinimized: boolean) => void; // Skift minimeret tilstand
  showMinimize: boolean;                     // Vis minimer knap
  messages: Message[];                       // Array af beskeder
  counselor: Counselor | null;               // Den aktive rådgiver
}