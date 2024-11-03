/**
 * Utility funktioner til formatering og validering
 */

import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Hjælpefunktion til at kombinere CSS klasser dynamisk
 * Bruger clsx og tailwind-merge til at håndtere klassenavne sikkert
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Formaterer et telefonnummer til korrekt format (XX XX XX XX)
 */
export const formatPhoneNumber = (value: string): string => {
  // Fjern alle ikke-tal
  const numbers = value.replace(/\D/g, '')
  
  // Formater som XX XX XX XX
  if (numbers.length <= 2) return numbers
  if (numbers.length <= 4) return `${numbers.slice(0, 2)} ${numbers.slice(2)}`
  if (numbers.length <= 6) return `${numbers.slice(0, 2)} ${numbers.slice(2, 4)} ${numbers.slice(4)}`
  return `${numbers.slice(0, 2)} ${numbers.slice(2, 4)} ${numbers.slice(4, 6)} ${numbers.slice(6, 8)}`
}

/**
 * Validerer et dansk telefonnummer
 * Tjekker om nummeret indeholder præcis 8 cifre
 */
export const validatePhone = (phone: string): boolean => {
  // Fjern mellemrum og tjek om vi har præcis 8 cifre
  const cleanPhone = phone.replace(/\s/g, '')
  return /^[0-9]{8}$/.test(cleanPhone)
}
