export const VALIDATION = {
  MIN_TITLE_LENGTH: 3,
  MAX_TITLE_LENGTH: 200,
  MIN_CONTENT_LENGTH: 10,
  MIN_PASSWORD_LENGTH: 6,
} as const

export const AUTO_SAVE_DELAY = 2000

export const PUBLIC_PATHS = ['/login', '/signup', '/auth'] as const