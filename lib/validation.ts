import { VALIDATION } from './constants'

export interface ValidationResult {
  isValid: boolean
  error?: string
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

export function validateEmail(email: string): ValidationResult {
  if (!email.trim()) {
    return { isValid: false, error: 'Email is required' }
  }

  if (!EMAIL_REGEX.test(email)) {
    return { isValid: false, error: 'Please enter a valid email address (e.g., user@example.com)' }
  }

  return { isValid: true }
}

export function validatePassword(password: string): ValidationResult {
  if (!password) {
    return { isValid: false, error: 'Password is required' }
  }

  if (password.length < VALIDATION.MIN_PASSWORD_LENGTH) {
    return { 
      isValid: false, 
      error: `Password must be at least ${VALIDATION.MIN_PASSWORD_LENGTH} characters long` 
    }
  }

  if (!/[A-Z]/.test(password)) {
    return { isValid: false, error: 'Password must contain at least one uppercase letter' }
  }

  if (!/[a-z]/.test(password)) {
    return { isValid: false, error: 'Password must contain at least one lowercase letter' }
  }

  if (!/[0-9]/.test(password)) {
    return { isValid: false, error: 'Password must contain at least one number' }
  }

  return { isValid: true }
}

export function getPasswordStrength(password: string): {
  strength: 'weak' | 'medium' | 'strong'
  message: string
} {
  if (password.length === 0) {
    return { strength: 'weak', message: '' }
  }

  let strength = 0

  if (password.length >= VALIDATION.MIN_PASSWORD_LENGTH) strength++
  if (password.length >= 8) strength++
  if (/[A-Z]/.test(password)) strength++
  if (/[a-z]/.test(password)) strength++
  if (/[0-9]/.test(password)) strength++
  if (/[^A-Za-z0-9]/.test(password)) strength++

  if (strength <= 2) {
    return { strength: 'weak', message: 'Weak password' }
  } else if (strength <= 4) {
    return { strength: 'medium', message: 'Medium strength' }
  } else {
    return { strength: 'strong', message: 'Strong password' }
  }
}