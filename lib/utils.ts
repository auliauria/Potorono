import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function calculateAge(tanggalLahir: string): number {
  const today = new Date()
  const birth = new Date(tanggalLahir)
  let age = today.getFullYear() - birth.getFullYear()
  const m = today.getMonth() - birth.getMonth()
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--
  return age
}

export function isLansia(tanggalLahir: string): boolean {
  return calculateAge(tanggalLahir) >= 60
}

export function isBalita(tanggalLahir: string): boolean {
  return calculateAge(tanggalLahir) < 5
}

export function formatWA(no: string): string {
  const cleaned = no.replace(/\D/g, '')
  return cleaned.startsWith('0')
    ? '62' + cleaned.slice(1)
    : cleaned
}