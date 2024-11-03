/**
 * Børnetelefonen Chat & Callback System
 * 
 * Dette er hovedkomponenten for Børnetelefonens chat- og ring op ystem.
 * Komponenten håndterer:
 * - Chat funktionalitet med rådgivere
 * - Ring op booking
 * - Bruger input validering
 * - Kø simulation
 * - Real-time chat beskeder
 */

"use client"

// React hooks til state og side-effects
import { useState, useEffect, useRef, useCallback } from 'react'

// UI komponenter fra shadcn/ui biblioteket
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Ikoner fra Lucide biblioteket
import { MessageCircle, Phone, Star, HelpCircle, RefreshCw, Shield, LockIcon, Loader2 } from 'lucide-react'

// Tooltip komponenter til hjælpetekster
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

// Animationsbibliotek
import { motion, AnimatePresence } from "framer-motion"

// Type definitioner og interfaces
import { type ChatState, type Counselor, type FormErrors, type Message } from '@/lib/types'

// Data og hjælpefunktioner
import { counselors, moods, tips } from '@/data/data'
import { formatPhoneNumber, validatePhone } from '@/lib/utils'

// Layout komponenter
import Footer from '@/components/layout/footer'
import Navigation from '@/components/layout/nav'

// useMediaQuery hook bruges til at finde skærmstørrelse og tilpasse UI derefter
// Returnerer en boolean der indikerer om den givne media query matcher
// Bruges til at lave fikse responsivt design og tilpasse komponenter til mobil/desktop
import useMediaQuery from '@/lib/hooks/use-media-query'

// Side komponenter
import AboutPage from '@/components/pages/about'
import HelpPage from '@/components/pages/help'
import ContactPage from '@/components/pages/contact'

// Utility funktioner til styling og formatering
// cn (classnames) - Hjælpefunktion til at kombinere CSS klasser dynamisk og håndtere betingede styles
// Bruges til at kombinere Tailwind klasser og skræddersyede styles på en sikker måde
import { cn } from "@/lib/utils"

// Chat relaterede komponenter
import ChatContent from '@/components/chat/chat-content'


export default function BorneTelefonen() {
  // Brugerens valgte humør/sindstilstand
  const [mood, setMood] = useState<string | null>(null)
  
  // Det daglige tip/råd der vises til brugeren
  const [dailyTip, setDailyTip] = useState("")
  
  // Brugerens kaldenavn/alias
  const [name, setName] = useState("")
  
  // Brugerens besked/henvendelse
  const [message, setMessage] = useState("")
  
  // Brugerens telefonnummer til opringning
  const [phone, setPhone] = useState("")
  
  // Brugerens foretrukne tidspunkt for opringning
  const [preferredTime, setPreferredTime] = useState("")
  
  // Indikerer om formularen er ved at blive indsendt
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  // Validerings-/inputfejl i formularen
  const [errors, setErrors] = useState<FormErrors>({})
  
  // Specifikt tidspunkt valgt til opringning
  const [specificTime, setSpecificTime] = useState("")
  
  // Indikerer om formularen er blevet indsendt
  const [isSubmitted, setIsSubmitted] = useState(false)
  
  // Brugerens position i køen
  const [queuePosition, setQueuePosition] = useState(0)
  
  // Estimeret ventetid i køen
  const [estimatedWaitTime, setEstimatedWaitTime] = useState("")
  
  // Type af henvendelse (chat eller opringning)
  const [submissionType, setSubmissionType] = useState<"chat" | "callback" | null>(null)
  
  // Chatvinduets tilstand (køer, forbinder, chatter)
  const [chatState, setChatState] = useState<ChatState>('queuing');
  
  // Liste over beskeder i chatten
  const [messages, setMessages] = useState<Message[]>([]);
  
  // Den aktuelle rådgiver i chatten
  const [currentCounselor, setCurrentCounselor] = useState<Counselor | null>(null);
  
  // Den aktuelle side der vises
  const [currentPage, setCurrentPage] = useState('home')
  
  // Indikerer om chatvinduet er minimeret
  const [isMinimized, setIsMinimized] = useState(false)
  
  // Responsiv UI tilstand og skærmhøjde
  const { isMobile, height } = useMediaQuery()
  
  // Reference til chat container elementet
  const chatContainerRef = useRef<HTMLDivElement>(null)
  
  // Den aktuelle besked der skrives i chat input
  const [chatMessage, setChatMessage] = useState('');
  
  // Reference til chat elementet
  const chatRef = useRef<HTMLDivElement>(null);

  /**
   * Håndterer afsendelse af chat beskeder
   * 
   * Funktionen:
   * - Forhindrer standard formular indsendelse og event bobling
   * - Validerer at beskeden ikke er tom
   * - Opretter en ny besked med:
   *   - Unikt ID baseret på tidsstempel
   *   - Afsender sat til 'user'
   *   - Den trimmede beskedtekst
   *   - Aktuel tidsstempel
   * - Tilføjer beskeden til message listen
   * - Nulstiller input feltet
   */
  const handleChatSendMessage = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!chatMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: chatMessage.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setChatMessage('');
  }, [chatMessage]);

  /**
   * Justerer chat vinduets højde på mobile enheder
   * 
   * Effekten:
   * - Kører når isMinimized, isMobile eller height ændres
   * - Sætter maksimal højde til 80% af skærmhøjden
   * - Bruger enten height fra useMediaQuery eller window.innerHeight
   * - Anvendes kun når:
   *   - Chat containeren eksisterer (chatContainerRef.current)
   *   - Chat ikke er minimeret (isMinimized er false)
   *   - Brugeren er på mobil (isMobile er true)
   */
  useEffect(() => {
    if (chatContainerRef.current && !isMinimized && isMobile) {
      const maxHeight = height ? height * 0.8 : window.innerHeight * 0.8
      chatContainerRef.current.style.maxHeight = `${maxHeight}px`
    }
  }, [isMinimized, isMobile, height])

  /**
   * Håndterer valg af humør
   * 
   * Funktionen:
   * - Modtager det valgte humør som parameter
   * - Opdaterer mood state med den nye værdi
   * 
   *
   */
  const handleMoodSelection = (selectedMood: string) => {
    setMood(selectedMood)
  }
  /**
   * Håndterer ændringer i telefonfeltet med real-time validering
   * 
   * Funktionen:
   * - Validerer at input kun indeholder tal og mellemrum
   * - Formaterer telefonnummeret med mellemrum (xx xx xx xx)
   * - Begrænser input til 11 tegn (8 cifre + 3 mellemrum)
   * - Opdaterer telefon state med det formaterede nummer
   * - Validerer at nummeret er præcis 8 cifre
   * - Opdaterer fejl tilstand med relevante fejlbeskeder
   */
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value
    // Tillad kun tal og mellemrum
    if (!/^[\d\s]*$/.test(input)) {
      return
    }

    const formatted = formatPhoneNumber(input)
    // Begræns til 11 tegn (8 cifre + 3 mellemrum)
    if (formatted.length <= 11) {
      setPhone(formatted)

      // Real-time validering
      if (formatted.replace(/\s/g, '').length === 8) {
        setErrors(prev => ({ ...prev, phone: undefined }))
      } else {
        setErrors(prev => ({
          ...prev,
          phone: formatted.length > 0 ? "Telefonnummeret skal være 8 cifre" : undefined
        }))
      }
    }
  }

  /**
   * Håndterer ændringer i navnefeltet med real-time validering
   * 
   * Funktionen:
   * - Opdaterer navn state med den nye værdi
   * - Validerer navnets længde (min 2, max 50 tegn)
   * - Opdaterer fejl tilstand med relevante fejlbeskeder
   * - Fjerner fejlbesked hvis input er tomt eller gyldigt
   */
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setName(value)
    //Tjek af navn længde
    if (value.length > 0 && value.length < 2) {
      setErrors(prev => ({ ...prev, name: "Dit navn skal være mindst 2 bogstaver langt" }))
    } else if (value.length > 50) {
      setErrors(prev => ({ ...prev, name: "Dit navn må ikke være længere end 50 bogstaver" }))
    } else {
      setErrors(prev => ({ ...prev, name: undefined }))
    }
  }

  /**
   * Håndterer ændringer i beskedfeltet med real-time validering
   * 
   * Funktionen:
   * - Opdaterer besked state med den nye værdi
   * - Validerer beskedens længde (min 10, max 500 tegn)
   * - Opdaterer fejl tilstand med relevante fejlbeskeder
   * - Fjerner fejlbesked hvis input er tomt eller gyldigt
   * 
   * 
   */
  const handleMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value
    setMessage(value)

    // Tjek af besked længde
    if (value.length > 0) {
      if (value.length < 10) {
        setErrors(prev => ({ ...prev, message: "Din besked skal være mindst 10 bogstaver lang" }))
      } else if (value.length > 500) {
        setErrors(prev => ({ ...prev, message: "Din besked må ikke være længere end 500 bogstaver" }))
      } else {
        setErrors(prev => ({ ...prev, message: undefined }))
      }
    } else {
      setErrors(prev => ({ ...prev, message: undefined }))
    }
  }

  /**
   * Håndterer indsendelse af chat formularen
   * 
   * Funktionen:
   * - Forhindrer standard form submission
   * - Validerer besked længde (10-500 tegn)
   * - Validerer valgfrit kaldenavn (2-50 tegn)
   * - Håndterer fejltilstande og opdaterer UI
   * - Starter kø simulation ved gyldig indsendelse
   * 
   * Kø simulation:
   * - Genererer tilfældig kø position (2-4 personer)
   * - Genererer tilfældig ventetid (2-10 minutter)
   * - Opdaterer UI med kø status
   * - Starter den gradvise kø simulation efter 1 sekund
   */
  const handleChatSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newErrors: FormErrors = {}
    // Valider besked (påkrævet)
    if (message.length < 10) {
      newErrors.message = "Din besked skal være mindst 10 bogstaver lang"
    }
    if (message.length > 500) {
      newErrors.message = "Din besked må ikke være længere end 500 bogstaver"
    }

    // Valider navn (valgfrit)
    if (name.length > 0 && name.length < 2) {
      newErrors.name = "Hvis du vælger et kaldenavn, skal det være mindst 2 bogstaver"
    }
    if (name.length > 50) {
      newErrors.name = "Kaldenavnet må ikke være længere end 50 bogstaver"
    }

    // Stop hvis der er valideringsfejl
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    // Nulstil fejl og vis loading tilstand
    setErrors({})
    setIsSubmitting(true)

    // Generer tilfældig kø position og ventetid
    const initialPosition = Math.floor(Math.random() * 3) + 2; // 2-4 personer
    const initialWaitMinutes = Math.floor(Math.random() * 9) + 2; // 2-10 minutter

    // Opdater UI med initial kø status
    setQueuePosition(initialPosition);
    setEstimatedWaitTime(`${initialWaitMinutes} minutter`);

    // Start kø simulation efter 1 sekund
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setSubmissionType("chat");
      startQueueSimulation(initialPosition, initialWaitMinutes);
    }, 1000);
  };
  /**
   * Simulerer en kø med gradvis reduktion af position og ventetid
   * 
   * Funktionen håndterer:
   * - Simulering af kø position fra 2-4 personer
   * - Simulering af ventetid fra 2-10 minutter
   * - Gradvis reduktion af begge værdier over 60 sekunder
   * - Automatisk start af chat når køen er færdig
   */
  const startQueueSimulation = (initialPosition: number, initialWaitMinutes: number) => {
    // Initialiser tracking variabler for position og ventetid
    let currentPosition = initialPosition;
    let currentWaitMinutes = initialWaitMinutes;

    // Beregn hvor ofte vi skal opdatere for at nå 0 inden for 60 sekunder
    const totalUpdates = 6; // Opdater hver 10. sekund i et minut
    const positionDecrement = initialPosition / totalUpdates;
    const timeDecrement = initialWaitMinutes / totalUpdates;

    const intervalId = setInterval(() => {
      // Reducer position
      currentPosition = Math.max(0, currentPosition - positionDecrement);
      setQueuePosition(Math.ceil(currentPosition));

      // Reducer ventetid proportionelt
      currentWaitMinutes = Math.max(0, currentWaitMinutes - timeDecrement);
      setEstimatedWaitTime(
        `${Math.ceil(currentWaitMinutes)} ${Math.ceil(currentWaitMinutes) === 1 ? 'minut' : 'minutter'}`
      );

      // Når køen er færdig eller efter 60 sekunder
      if (currentPosition <= 0) {
        clearInterval(intervalId);
        setTimeout(() => {
          setChatState('connecting');
          void startChat();
        }, 1000);
      }
    }, 10000); // Opdater hver 10. sekund

    // Sikkerhedsforanstaltning: Tving chatten til at starte efter præcis 60 sekunder
    setTimeout(() => {
      clearInterval(intervalId);
      setChatState('connecting');
      void startChat();
    }, 60000);

    // Cleanup interval når komponenten unmountes
    return () => clearInterval(intervalId);
  };

  /**
   * Håndterer indsendelse af ring op-formularen
   * 
   * Validerer:
   * - Telefonnummer (påkrævet, 8 cifre)
   * - Foretrukket tidspunkt (påkrævet)
   * - Specifikt tidspunkt (hvis foretrukket tidspunkt er 'specific')
   * - Kaldenavn (valgfrit, 2-50 tegn)
   * 
   * Ved succes:
   * - Nulstiller fejl
   * - Viser loading tilstand
   * - Simulerer API kald
   * - Opdaterer submission status
   */
  const handleCallbackSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newErrors: FormErrors = {}

    // Valider telefonnummer (påkrævet)
    if (!validatePhone(phone)) {
      newErrors.phone = "Indtast venligst et gyldigt telefonnummer (8 cifre)"
    }

    // Valider foretrukket tidspunkt (påkrævet) 
    if (!preferredTime) {
      newErrors.preferredTime = "Vælg venligst hvornår vi må ringe"
    }

    // Valider specifikt tidspunkt hvis nødvendigt
    if (preferredTime === 'specific' && !specificTime) {
      newErrors.preferredTime = "Vælg venligst et specifikt tidspunkt"
    }

    // Valider navn (valgfrit)
    if (name.length > 0 && name.length < 2) {
      newErrors.name = "Hvis du vælger et kaldenavn, skal det være mindst 2 bogstaver"
    }
    if (name.length > 50) {
      newErrors.name = "Kaldenavnet må ikke være længere end 50 bogstaver"
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setErrors({})
    setIsSubmitting(true)
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false)
      setIsSubmitted(true)
      setSubmissionType("callback")
    }, 1000)
  }

  /**
   * Henter og viser et nyt tilfældigt råd fra tips-listen
   * 
   * - Vælger et tilfældigt råd fra tips array
   * - Opdaterer dailyTip state med det nye råd
   * - Har en fallback værdi hvis ingen råd findes
   */
  const getNewTip = () => {
    const randomIndex = Math.floor(Math.random() * tips.length);
    const newTip = tips[randomIndex];

    if (newTip) {
      setDailyTip(newTip);
    } else {
      // Fallback i tilfælde af at newTip ikke er defineret (hvilket ikke burde ske, men det er god praksis at håndtere det)
      setDailyTip("Husk at være god ved dig selv i dag.");
    }
  };

  /**
   * Henter et nyt råd når komponenten mountes
   */
  useEffect(() => {
    getNewTip()
  }, [])

  /**
   * Håndterer ændringer i det foretrukne tidspunkt for opringning
   * 
   * - Opdaterer preferredTime state
   * - Håndterer fejlvalidering
   * - Fjerner fejl hvis en gyldig værdi vælges
   * - Tilføjer fejl hvis ingen værdi er valgt
   */
  const handlePreferredTimeChange = (value: string) => {
    setPreferredTime(value)
    if (value) {
      setErrors(prev => ({ ...prev, preferredTime: undefined }))
    } else {
      setErrors(prev => ({ ...prev, preferredTime: "Vælg venligst et tidspunkt" }))
    }
  }


  /**
   * Starter en ny chat session med en tilfældig rådgiver
   * 
   * Funktionen håndterer:
   * - Sætter chat status til 'connecting'
   * - Vælger en tilfældig rådgiver
   * - Opdaterer UI med den valgte rådgiver
   * - Sender en velkomstbesked hvis der ikke allerede er en
   */
  const startChat = async () => {
    // Sæt chat status til 'connecting' mens vi venter
    setChatState('connecting');

    // Vælg en tilfældig rådgiver fra listen
    const selectedCounselor = counselors[Math.floor(Math.random() * counselors.length)];

    if (selectedCounselor) {
      // Gem den valgte rådgiver i state
      setCurrentCounselor(selectedCounselor);

      // Simuler forbindelsestid på 2 sekunder
      setTimeout(() => {
        // Opdater chat status til 'chatting'
        setChatState('chatting');

        // Tjek om velkomstbeskeden allerede findes i messages
        const welcomeMessageExists = messages.some(msg =>
          msg.sender === 'counselor' &&
          msg.text.includes('Velkommen til Børnetelefonen')
        );

        // Hvis der ikke er en velkomstbesked, opret en ny
        if (!welcomeMessageExists) {
          const welcomeMessage: Message = {
            id: Date.now().toString(),
            sender: 'counselor',
            text: `Hej ${name || 'Anonym'}! Velkommen til Børnetelefonen. Jeg hedder ${selectedCounselor.name}, og jeg er her for at lytte og hjælpe dig.`,
            timestamp: new Date()
          };
          // Tilføj velkomstbeskeden til message listen
          setMessages(prev => [...prev, welcomeMessage]);
        }
      }, 2000);
    }
  };

  /**
   * ChatWrapper komponenten håndterer visningen af chat vinduet
   * 
   * Komponenten:
   * - Styrer hvornår chat vinduet skal vises baseret på tilstand og enhed
   * - Håndterer responsivt design for både mobil og desktop
   * - Implementerer minimering/maksimering af chat vinduet
   * - Indeholder selve chat indholdet via ChatContent komponenten
   */
  const ChatWrapper = () => {
    // Bestem om wrapper'en skal vises baseret på:
    // - Om der er valgt en rådgiver (currentCounselor)
    // - Om chat tilstanden er 'chatting'
    // - Om brugeren er på mobil eller ikke på forsiden
    const shouldShowWrapper = currentCounselor &&
      chatState === 'chatting' &&
      (isMobile || currentPage); //!== 'home');

    // Vis intet hvis wrapper'en ikke skal vises
    if (!shouldShowWrapper) return null;

    // Opret klassenavne for wrapper'en med conditional styling
    const wrapperClassName = cn(
      "fixed z-50 transition-all duration-300",
      {
        // Styling for mobil visning - fuld skærm når ikke minimeret
        "inset-0": isMobile && !isMinimized,
        // Styling for desktop visning - fast position i nederste højre hjørne
        "bottom-4 right-4": !isMobile || isMinimized,
        // Tilpas størrelse baseret på minimeret tilstand
        "w-auto h-auto": isMinimized,
        "w-[400px] h-[600px]": !isMinimized && !isMobile,
      }
    );

    return (
      <div className={wrapperClassName}>
        <div className={cn(
          "bg-white rounded-lg shadow-lg flex flex-col h-full",
          // Tilføj speciel styling når chat er minimeret
          isMinimized && "bg-teal-600 text-white rounded-full hover:bg-teal-700 cursor-pointer"
        )}>
          <ChatContent
            chatRef={chatRef}
            newMessage={chatMessage}
            setNewMessage={setChatMessage}
            handleSendMessage={handleChatSendMessage}
            isMinimized={isMinimized}
            setIsMinimized={setIsMinimized}
            showMinimize={true}
            messages={messages}
            counselor={currentCounselor}
          />
        </div>
      </div>
    );
  };

  // QueueStatus komponenten viser status beskeder til brugeren
  // Komponenten håndterer:
  // - Visning af kø position og ventetid for chat
  // - Status for chat forbindelse
  // - Bekræftelse på opringning
  // - Fejlmeddelelser hvis noget går galt
  // - Skjuler sig selv hvis ingen anmodning er sendt
  const QueueStatus = () => {
    // Vis intet hvis der ikke er indsendt en anmodning
    if (!isSubmitted) return null

    // Håndter chat status
    if (submissionType === "chat") {
      // Hvis chatten er aktiv, vis chat vinduet
      if (chatState === 'chatting') {
        return <ChatWrapper />;
      }

      // Vis "forbinder" status mens der etableres forbindelse
      if (chatState === 'connecting') {
        return (
          <Card className="border-l-4 border-l-teal-400">
            <CardHeader>
              <CardTitle className="text-teal-600 flex items-center gap-2">
                <Loader2 className="h-5 w-5 animate-spin" />
                Forbinder dig med en rådgiver
              </CardTitle>
              <div className="text-sm text-muted-foreground">
                <p>Vent venligst et øjeblik...</p>
              </div>
            </CardHeader>
          </Card>
        );
      }

      // Vis kø status med position og estimeret ventetid
      return (
        <Card className="border-l-4 border-l-teal-400">
          <CardHeader>
            <CardTitle className="text-teal-600 flex items-center gap-2">
              <MessageCircle className="h-5 w-5" />
              Du er i chat-køen
            </CardTitle>
            <div className="text-sm text-muted-foreground space-y-2">
              <div className="bg-teal-50 p-4 rounded-lg space-y-3">
                {queuePosition > 0 ? (
                  <>
                    <p className="font-medium">
                      Der er <span className="text-teal-600">{queuePosition} {queuePosition === 1 ? 'person' : 'personer'}</span> foran dig i køen
                    </p>
                    <p>
                      Estimeret ventetid: <span className="text-teal-600">{estimatedWaitTime}</span>
                    </p>
                    {/* Progressbar der viser position i køen */}
                    <div className="w-full bg-teal-100 rounded-full h-2">
                      <div
                        className={cn(
                          "bg-teal-500 h-2 rounded-full transition-all duration-500",
                          queuePosition === 3 && "w-1/4",
                          queuePosition === 2 && "w-1/2",
                          queuePosition === 1 && "w-3/4",
                          queuePosition === 0 && "w-full"
                        )}
                      />
                    </div>
                  </>
                ) : (
                  <p className="font-medium text-teal-600">
                    Det er snart din tur!
                  </p>
                )}
              </div>
              <p className="mt-4">
                Vi åbner et chat-vindue så snart en rådgiver er ledig.
              </p>
            </div>
          </CardHeader>
        </Card>
      )
    }

    // Håndter opkalds status
    if (submissionType === "callback") {
      return (
        <Card className="border-l-4 border-l-pink-400">
          <CardHeader>
            <CardTitle className="text-pink-600 flex items-center gap-2">
              <Phone className="h-5 w-5" />
              Vi ringer dig op
            </CardTitle>
            <div className="text-sm text-muted-foreground space-y-2">
              {/* Vis forskellige beskeder baseret på det valgte tidspunkt */}
              <div className="bg-pink-50 p-4 rounded-lg">
                {preferredTime === 'asap' ? (
                  <>
                    <p className="font-medium">Vi ringer dig op hurtigst muligt</p>
                    <p className="mt-2">Der er typisk 5-15 minutters ventetid i øjeblikket</p>
                  </>
                ) : preferredTime === 'today' ? (
                  <p className="font-medium">Vi ringer dig op i løbet af i dag</p>
                ) : preferredTime === 'tomorrow' ? (
                  <p className="font-medium">Vi ringer dig op i morgen</p>
                ) : (
                  <p className="font-medium">Vi ringer dig op {specificTime}</p>
                )}
              </div>
              <p className="mt-4">
                Du behøver ikke blive på siden - vi ringer til det nummer, du har oplyst.
              </p>
            </div>
          </CardHeader>
          <CardContent>
            {/* Knap til at annullere opkaldsanmodningen */}
            <Button
              onClick={() => {
                setIsSubmitted(false)
                setSubmissionType(null)
                setPhone('')
                setPreferredTime('')
                setSpecificTime('')
              }}
              variant="outline"
              className="w-full"
            >
              <RefreshCw className="mr-2 h-4 w-4" /> Annuller opkald
            </Button>
          </CardContent>
        </Card>
      )
    }

    return null
  }

  // Hovedkomponenten returnerer applikationens layout
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-green-50 flex flex-col">
      {/* Navigation komponenten håndterer sidens navigation */}
      <Navigation
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />

      {/* Hovedindhold container med conditional rendering baseret på currentPage */}
      <main className="flex-grow container mx-auto p-4 space-y-8">
        {currentPage === 'home' ? (
          // Forsideindhold med velkomst og interaktive elementer
          <>
            {/* Velkomstsektion med animeret overskrift og beskrivelse */}
            <section className="text-center my-8">
              <motion.h2
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-4xl font-bold text-teal-700 mb-4"
              >
                Velkommen til Børnetelefonen
              </motion.h2>
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="space-y-4"
              >
                <p className="text-xl text-teal-600">
                  Her kan du snakke med en voksen om alt, der fylder i dit liv
                </p>
                <div className="inline-block bg-teal-50 p-4 rounded-lg shadow-sm">
                  <p className="text-teal-700 flex items-center gap-2 justify-center">
                    <LockIcon className="h-5 w-5" />
                    <span>Du er altid 100% anonym hos os</span>
                  </p>
                </div>
              </motion.div>
            </section>

            {/* Humør-vælger kort med interaktive emoji-knapper */}
            <Card className="mb-8 shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white border-t-4 border-t-yellow-400">
              <CardHeader>
                <CardTitle className="text-2xl text-teal-600">Hvordan har du det i dag?</CardTitle>
                <CardDescription>Vælg det humør, der passer bedst til dig lige nu</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-wrap justify-center gap-4">
                <TooltipProvider>
                  {moods.map((m) => (
                    <Tooltip key={m.label}>
                      <TooltipTrigger asChild>
                        <motion.div
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleMoodSelection(m.label)}
                          className={`p-2 rounded-full cursor-pointer text-2xl ${mood === m.label ? 'ring-2 ring-offset-2 ring-teal-400' : ''
                            } ${m.color} transition-all duration-300 ease-in-out`}
                        >
                          {m.icon}
                          <span className="sr-only">{m.label}</span>
                        </motion.div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{m.label}: {m.description}</p>
                      </TooltipContent>
                    </Tooltip>
                  ))}
                </TooltipProvider>
              </CardContent>
            </Card>

            {/* Animeret feedback baseret på valgt humør */}
            <AnimatePresence>
              {mood && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="mb-8 bg-green-100 border-l-4 border-l-green-500">
                    <CardContent className="p-4">
                      <p className="text-green-800 text-lg">
                        {mood === "Glad" && "Det er dejligt at høre, at du har det godt i dag! Husk at dele din glæde med andre."}
                        {mood === "Ked af det" && "Det er okay at være ked af det. Husk, at du altid kan tale med os eller en voksen, du stoler på."}
                        {mood === "Forvirret" && "Hvis du har brug for hjælp til at forstå noget, er vi her for at hjælpe dig."}
                        {mood === "Ensom" && "Du føler dig alene eller savner nogen at tale med. Det er okay at have det svært nogle gange."}
                        {mood === "Rolig" && "Det er godt at føle sig rolig. Nyd denne fredelige følelse."}
                        {mood === "Overvældet" && "Hvis du føler dig overvældet, er det okay at tage en pause og bede om hjælp."}
                        {mood === "Nervøs" && "Det er normalt at føle sig nervøs nogle gange. Prøv at tage nogle dybe vejrtrækninger, det kan hjælpe."}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Hovedindholdsområde med chat/opkald funktionalitet */}
            <main className="container mx-auto px-4 py-8">
              {isSubmitted ? (
                <QueueStatus />
              ) : (
                <Tabs defaultValue="chat" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger
                      value="chat"
                      className="text-lg relative overflow-hidden
    bg-teal-100 
    data-[state=active]:bg-teal-200 
    text-teal-700
    before:content-[''] before:absolute before:bottom-0 before:left-0 
    before:w-full before:h-0.5 before:bg-teal-500
    before:transform before:scale-x-0 before:transition-transform
    data-[state=active]:before:scale-x-100"
                    >
                      Chat med os
                    </TabsTrigger>
                    {/* Opkalds-fane knap med pink styling */}
                    <TabsTrigger value="callback" className="text-lg bg-pink-100 data-[state=active]:bg-pink-200 text-pink-700">Ring mig op</TabsTrigger>
                  </TabsList>

                  {/* Chat sektion med formular eller aktiv chat */}
                  <TabsContent value="chat">
                    <Card>
                      <CardContent className="space-y-4">
                        {!currentCounselor ? (
                          // Chat tilmeldingsformular når ingen rådgiver er tilknyttet
                          <>
                            <div className="space-y-2">
                              <h3 className="text-lg font-medium">Start en chat</h3>
                              <p className="text-sm text-gray-500">
                                Chat med en rådgiver fra Børnetelefonen. Du er anonym og chatten er fortrolig.
                              </p>
                            </div>

                            {/* Formular til at starte en chat */}
                            <form onSubmit={handleChatSubmit} className="space-y-4">
                              {/* Navn input felt med validering */}
                              <div>
                                <Label htmlFor="name" className="flex items-center gap-2">
                                  <span>Hvad vil du gerne kaldes?</span>
                                  <TooltipProvider>
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <HelpCircle className="h-4 w-4 text-teal-500 cursor-help" />
                                      </TooltipTrigger>
                                      <TooltipContent>
                                        <p className="text-sm">Du behøver ikke at bruge dit rigtige navn -
                                          du kan være helt anonym og bruge et kaldenavn eller bare skrive &apos;anonym&apos;</p>
                                      </TooltipContent>
                                    </Tooltip>
                                  </TooltipProvider>
                                </Label>
                                <Input
                                  id="name"
                                  value={name}
                                  onChange={handleNameChange}
                                  placeholder="Fx 'anonym' eller et kaldenavn du vælger"
                                  className={cn(errors.name ? "border-red-500 focus:ring-red-500" : "focus:ring-teal-500")}
                                />
                                {/* Validerings feedback for navn */}
                                {errors.name ? (
                                  <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                                ) : (
                                  name.length >= 2 && name.length <= 50 && (
                                    <p className="text-green-500 text-sm mt-1">✓ Kaldenavn godkendt</p>
                                  )
                                )}
                              </div>

                              {/* Besked textarea med validering */}
                              <div>
                                <Label htmlFor="message" className="flex items-center gap-2">
                                  <span>Hvad vil du gerne tale om?</span>
                                  <TooltipProvider>
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <HelpCircle className="h-4 w-4 text-teal-500 cursor-help" />
                                      </TooltipTrigger>
                                      <TooltipContent>
                                        <p className="text-sm">Fortæl kort hvad du gerne vil tale med en rådgiver om</p>
                                      </TooltipContent>
                                    </Tooltip>
                                  </TooltipProvider>
                                </Label>
                                <Textarea
                                  id="message"
                                  value={message}
                                  onChange={handleMessageChange}
                                  placeholder="Skriv lidt om hvad du gerne vil tale om..."
                                  className={cn(
                                    "min-h-[100px]",
                                    errors.message ? "border-red-500 focus:ring-red-500" : "focus:ring-teal-500"
                                  )}
                                />
                                {/* Validerings feedback og tegnoptælling for besked */}
                                {errors.message ? (
                                  <p className="text-red-500 text-sm mt-1">{errors.message}</p>
                                ) : (
                                  message.length >= 10 && message.length <= 500 && (
                                    <p className="text-green-500 text-sm mt-1">✓ Besked godkendt</p>
                                  )
                                )}
                                <div className="text-sm text-gray-500 mt-1">
                                  {message.length}/500 tegn
                                </div>
                              </div>

                              {/* Visning af valgt humør hvis det er sat */}
                              {mood && (
                                <div>
                                  <Label>Dit valgte humør:</Label>
                                  <Input value={mood} readOnly className="bg-gray-100" />
                                </div>
                              )}

                              {/* Submit knap med loading tilstand */}
                              <Button
                                type="submit"
                                disabled={isSubmitting || message.length < 10}
                                className={cn(
                                  "w-full transition-all duration-200",
                                  isSubmitting || message.length < 10
                                    ? "bg-gray-300 cursor-not-allowed opacity-50"
                                    : "bg-teal-500 hover:bg-teal-600 text-white"
                                )}
                              >
                                {isSubmitting ? (
                                  <div className="flex items-center justify-center">
                                    <RefreshCw className="animate-spin mr-2 h-5 w-5" />
                                    Sender anmodning...
                                  </div>
                                ) : (
                                  <><MessageCircle className="mr-2 h-5 w-5" /> Start chat</>
                                )}
                              </Button>
                            </form>
                          </>
                        ) : null
                      }
                    </CardContent>
                  </Card>
                  </TabsContent>

                  {/* Opkalds sektion med formular */}
                  <TabsContent value="callback">
                    <Card className="border-t-4 border-t-pink-400">
                      <CardHeader>
                        <CardTitle className="text-pink-600">Få et opkald</CardTitle>
                        <div className="text-sm text-muted-foreground space-y-2">
                          <span>Vi ringer dig op, når en rådgiver er ledig</span>
                          <div className="font-medium text-teal-600 bg-teal-50 p-2 rounded-md flex items-center gap-2">
                            <Shield className="h-5 w-5" />
                            <span>Dit opkald er 100% anonymt - vi kan ikke se hvem du er</span>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        {/* Formular til opkaldsanmodning */}
                        <form onSubmit={handleCallbackSubmit} className="space-y-4">
                          {/* Navn input felt med validering */}
                          <div>
                            <Label htmlFor="callbackName" className="flex items-center gap-2">
                              <span>Hvad vil du gerne kaldes?</span>
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <HelpCircle className="h-4 w-4 text-teal-500 cursor-help" />
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p className="text-sm">Du behøver ikke at bruge dit rigtige navn -
                                      du kan være helt anonym og bruge et kaldenavn ellers kalder vi dig bare &apos;anonym&apos;</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </Label>
                            <Input
                              id="callbackName"
                              value={name}
                              onChange={handleNameChange}
                              placeholder="Fx 'anonym' eller et kaldenavn du vælger"
                              className={`${errors.name ? "border-red-500 focus:ring-red-500" : "focus:ring-teal-500"}`}
                            />
                            {/* Validerings feedback for navn */}
                            {errors.name ? (
                              <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                            ) : (
                              name.length >= 2 && name.length <= 50 && (
                                <p className="text-green-500 text-sm mt-1">✓ Kaldenavn godkendt</p>
                              )
                            )}
                          </div>

                          {/* Telefonnummer input felt med validering */}
                          <div>
                            <Label htmlFor="phone">Dit telefonnummer:</Label>
                            <Input
                              id="phone"
                              type="tel"
                              value={phone}
                              onChange={handlePhoneChange}
                              placeholder="12 34 56 78"
                              className={`${errors.phone ? "border-red-500 focus:ring-red-500" : "focus:ring-teal-500"}`}
                              required
                            />
                            {/* Validerings feedback for telefonnummer */}
                            {errors.phone ? (
                              <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                            ) : (
                              phone.replace(/\s/g, '').length === 8 && (
                                <p className="text-green-500 text-sm mt-1">✓ Telefonnummeret er godkendt</p>
                              )
                            )}
                          </div>

                          {/* Visning af valgt humør hvis det er sat */}
                          {mood && (
                            <div>
                              <Label>Dit valgte humør:</Label>
                              <Input value={mood} readOnly className="bg-gray-100" />
                            </div>
                          )}

                          {/* Dropdown til valg af opkaldstidspunkt */}
                          <div>
                            <Label htmlFor="preferredTime">Hvornår må vi ringe?</Label>
                            <Select
                              value={preferredTime}
                              onValueChange={handlePreferredTimeChange}
                              required
                            >
                              <SelectTrigger className={`w-full ${errors.preferredTime ? "border-red-500 focus:ring-red-500" : "focus:ring-teal-500"
                                }`}>
                                <SelectValue placeholder="Vælg tidspunkt" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="asap">Så hurtigt som muligt</SelectItem>
                                <SelectItem value="today">I løbet af i dag</SelectItem>
                                <SelectItem value="tomorrow">I morgen</SelectItem>
                                <SelectItem value="specific">På et bestemt tidspunkt</SelectItem>
                              </SelectContent>
                            </Select>
                            {/* Validerings feedback for tidspunkt */}
                            {errors.preferredTime ? (
                              <p className="text-red-500 text-sm mt-1">{errors.preferredTime}</p>
                            ) : (
                              preferredTime && (
                                <p className="text-green-500 text-sm mt-1">✓ Tidspunkt valgt</p>
                              )
                            )}
                          </div>

                          {/* Specifikt tidsvalg hvis det er valgt */}
                          {preferredTime === 'specific' && (
                            <div>
                              <Label htmlFor="specificTime">Vælg tidspunkt:</Label>
                              <Select
                                value={specificTime}
                                onValueChange={setSpecificTime}
                                required
                              >
                                <SelectTrigger className="w-full">
                                  <SelectValue placeholder="Vælg specifikt tidspunkt" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="9-12">Mellem 9-12</SelectItem>
                                  <SelectItem value="12-15">Mellem 12-15</SelectItem>
                                  <SelectItem value="15-18">Mellem 15-18</SelectItem>
                                  <SelectItem value="18-21">Mellem 18-21</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          )}

                          {/* Submit knap med loading tilstand */}
                          <Button
                            type="submit"
                            disabled={isSubmitting || message.length < 10}
                            className={cn(
                              "w-full transition-all duration-200",
                              isSubmitting || message.length < 10
                                ? "bg-gray-300 cursor-not-allowed opacity-50"
                                : "bg-teal-500 hover:bg-teal-600"
                            )}
                          >
                            {isSubmitting ? (
                              <div className="flex items-center justify-center">
                                <RefreshCw className="animate-spin mr-2 h-5 w-5" />
                                Sender anmodning...
                              </div>
                            ) : (
                              <><MessageCircle className="mr-2 h-5 w-5" /> Start chat</>
                            )}
                          </Button>
                        </form>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              )}
            </main>

            {/* Dagens råd sektion */}
            <Card className="shadow-md hover:shadow-lg transition-shadow duration-300 border-l-4 border-l-yellow-400">
              <CardHeader>
                <CardTitle className="flex items-center text-yellow-600">
                  <Star className="mr-2 h-6 w-6" />
                  Dagens råd
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-teal-700 text-lg mb-4">{dailyTip}</p>
                <Button onClick={getNewTip} variant="outline" className="flex items-center">
                  <RefreshCw className="mr-2 h-4 w-4" /> Få et nyt råd
                </Button>
              </CardContent>
            </Card>
          </>
        ) : currentPage === 'about' ? (
          <AboutPage />
        ) : currentPage === 'help' ? (
          <HelpPage />
        ) : currentPage === 'contact' ? (
          <ContactPage />
        ) : null}
      </main>

      {/* ChatWrapper komponenten håndterer chat-vinduet i applikationen.
          - Vises kun når en chat er aktiv
          - Håndterer både mobil og desktop visning
          - Styrer minimering/maksimering af chat
          - Placeres fast i bunden til højre på desktop
          - Vises i fuld skærm på mobil */}
      <ChatWrapper />

      <Footer />
    </div>
  )
}