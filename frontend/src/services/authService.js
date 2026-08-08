/**
 * Client-Side Authentication Service Simulation for NeuronAI
 * 
 * Provides clean frontend abstraction with async Promise interface.
 * Easily replaceable by backend FastAPI endpoints (/api/v1/auth/*).
 */

const STORAGE_KEYS = {
  USER: 'neuron_ai_auth_user',
  SESSION: 'neuron_ai_session',
  PENDING_REGISTRATION: 'neuron_ai_pending_reg',
  REGISTERED_USERS: 'neuron_ai_registered_users',
  PROGRESS: 'neuron_ai_user_progress',
}

const AUTH_VERSION_KEY = 'neuron_ai_auth_version_v3'

// Reset stale legacy test data once to ensure clean authentication state
function checkAndClearLegacyAuthData() {
  try {
    const version = localStorage.getItem(AUTH_VERSION_KEY)
    if (version !== 'v3') {
      localStorage.removeItem(STORAGE_KEYS.USER)
      localStorage.removeItem(STORAGE_KEYS.SESSION)
      localStorage.removeItem(STORAGE_KEYS.PENDING_REGISTRATION)
      localStorage.removeItem(STORAGE_KEYS.REGISTERED_USERS)
      localStorage.removeItem(STORAGE_KEYS.PROGRESS)
      localStorage.setItem(AUTH_VERSION_KEY, 'v3')
    }
  } catch (e) {}
}

checkAndClearLegacyAuthData()

// Helper to simulate realistic backend network latency
const delay = (ms = 400) => new Promise((resolve) => setTimeout(resolve, ms))

// Email validation helper
export const isValidEmail = (email) => {
  if (!email || typeof email !== 'string') return false
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
  return emailRegex.test(email.trim())
}

/**
 * Progressive Live Email Requirements & Guidance Checker
 */
export const checkEmailRequirements = (email = '') => {
  if (!email || typeof email !== 'string') {
    return {
      hasText: false,
      hasAt: false,
      validPrefix: false,
      hasDomain: false,
      hasExtension: false,
      isAllValid: false,
      isMalformed: false,
      malformedReason: '',
    }
  }

  const raw = email
  const trimmed = email.trim()

  if (!trimmed) {
    return {
      hasText: false,
      hasAt: false,
      validPrefix: false,
      hasDomain: false,
      hasExtension: false,
      isAllValid: false,
      isMalformed: false,
      malformedReason: '',
    }
  }

  const hasSpaces = /\s/.test(raw)
  const atMatches = raw.match(/@/g)
  const atCount = atMatches ? atMatches.length : 0
  const hasDoubleDots = /\.\./.test(raw)

  let isMalformed = false
  let malformedReason = ''

  if (hasSpaces) {
    isMalformed = true
    malformedReason = 'Spaces are not allowed in email address'
  } else if (atCount > 1) {
    isMalformed = true
    malformedReason = 'Email cannot contain multiple @ symbols'
  } else if (hasDoubleDots) {
    isMalformed = true
    malformedReason = 'Email cannot contain consecutive dots'
  }

  const parts = trimmed.split('@')
  const prefix = parts[0] || ''
  const domainPart = parts.length > 1 ? parts[1] : ''

  const hasAt = atCount === 1
  const validPrefix = /^[a-zA-Z0-9._%+-]+$/.test(prefix) && prefix.length > 0 && !prefix.startsWith('.') && !prefix.endsWith('.')

  const domainSubparts = domainPart ? domainPart.split('.') : []
  const domainName = domainSubparts[0] || ''
  const domainExt = domainSubparts.length > 1 ? domainSubparts[domainSubparts.length - 1] : ''

  const hasDomain = Boolean(domainPart && domainName && /^[a-zA-Z0-9-]+$/.test(domainName))
  const hasExtension = Boolean(domainSubparts.length > 1 && domainExt && /^[a-zA-Z]{2,}$/.test(domainExt))

  const isAllValid = !isMalformed && hasAt && validPrefix && hasDomain && hasExtension && isValidEmail(trimmed)

  return {
    hasText: true,
    hasAt,
    validPrefix,
    hasDomain,
    hasExtension,
    isAllValid,
    isMalformed,
    malformedReason,
  }
}

// Password requirements check helper
export const checkPasswordRequirements = (password = '', confirmPassword = '') => {
  const minLength = password.length >= 8
  const hasUppercase = /[A-Z]/.test(password)
  const hasLowercase = /[a-z]/.test(password)
  const hasNumber = /[0-9]/.test(password)
  const matchesConfirm = Boolean(password) && password === confirmPassword

  const isAllValid = minLength && hasUppercase && hasLowercase && hasNumber && matchesConfirm

  return {
    minLength,
    hasUppercase,
    hasLowercase,
    hasNumber,
    matchesConfirm,
    isAllValid,
  }
}

// Dynamic username generator from full name
export const generateSuggestedUsername = (fullName = '') => {
  if (!fullName || typeof fullName !== 'string') return 'candidate_ai'
  const cleaned = fullName
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s_]/g, '')
    .replace(/\s+/g, '_')
  
  if (!cleaned) return 'candidate_ai'
  return cleaned.slice(0, 20)
}

// Username validator
export const validateUsername = (username = '') => {
  const cleaned = username.trim()
  if (!cleaned) return { isValid: false, message: 'Username is required' }
  if (cleaned.length < 3) return { isValid: false, message: 'Minimum 3 characters required' }
  if (cleaned.length > 20) return { isValid: false, message: 'Maximum 20 characters allowed' }
  if (/\s/.test(cleaned)) return { isValid: false, message: 'Spaces are not allowed' }
  if (!/^[a-zA-Z0-9_]+$/.test(cleaned)) return { isValid: false, message: 'Only letters, numbers, and underscores allowed' }
  
  const takenUsernames = ['admin', 'root', 'neuron', 'neuronai', 'support', 'taken']
  if (takenUsernames.includes(cleaned.toLowerCase())) {
    return { isValid: false, isTaken: true, message: 'Username already taken' }
  }

  return { isValid: true, isTaken: false, message: 'Username available' }
}

export const authService = {
  /**
   * Get currently authenticated user from localStorage
   */
  getCurrentUser() {
    try {
      const userRaw = localStorage.getItem(STORAGE_KEYS.USER)
      if (!userRaw) return null
      return JSON.parse(userRaw)
    } catch (e) {
      console.error('Failed to parse authenticated user:', e)
      return null
    }
  },

  /**
   * Check if user has active session
   */
  isAuthenticated() {
    return Boolean(this.getCurrentUser() && localStorage.getItem(STORAGE_KEYS.SESSION))
  },

  /**
   * Step 1: Sign Up Registration Submission
   */
  async signUp({ firstName, lastName, email, password, confirmPassword }) {
    await delay(500)

    if (!firstName || !firstName.trim()) {
      throw new Error('First Name is required.')
    }

    if (!lastName || !lastName.trim()) {
      throw new Error('Last Name is required.')
    }

    if (!isValidEmail(email)) {
      throw new Error('Please enter a valid email address.')
    }

    const pwCheck = checkPasswordRequirements(password, confirmPassword)
    if (!pwCheck.isAllValid) {
      throw new Error('Please satisfy all password requirements.')
    }

    const trimmedFirst = firstName.trim()
    const trimmedLast = lastName.trim()
    const fullName = `${trimmedFirst} ${trimmedLast}`.trim()
    const cleanEmail = email.trim().toLowerCase()

    // Check if email already registered
    try {
      const regRaw = localStorage.getItem(STORAGE_KEYS.REGISTERED_USERS)
      const registered = regRaw ? JSON.parse(regRaw) : []
      const existing = registered.find((u) => u.email.toLowerCase() === cleanEmail)
      if (existing) {
        throw new Error('An account with this email address already exists. Please sign in.')
      }
    } catch (e) {
      if (e.message && e.message.includes('already exists')) throw e
    }

    const pendingData = {
      firstName: trimmedFirst,
      lastName: trimmedLast,
      fullName,
      email: cleanEmail,
      password,
      suggestedUsername: generateSuggestedUsername(fullName),
      createdAt: new Date().toISOString(),
    }

    localStorage.setItem(STORAGE_KEYS.PENDING_REGISTRATION, JSON.stringify(pendingData))

    return {
      success: true,
      message: 'Verification code sent to your email.',
      email: pendingData.email,
    }
  },

  /**
   * Step 2: Verify Email OTP Code
   */
  async verifyEmailOtp(email, otp) {
    await delay(400)

    if (!otp || otp.trim().length !== 6 || !/^\d+$/.test(otp.trim())) {
      throw new Error('Invalid verification code. Please enter 6 digits.')
    }

    const pendingRaw = localStorage.getItem(STORAGE_KEYS.PENDING_REGISTRATION)
    let pendingData = null
    if (pendingRaw) {
      pendingData = JSON.parse(pendingRaw)
    }

    return {
      success: true,
      message: 'Email verified successfully.',
      suggestedUsername: pendingData ? pendingData.suggestedUsername : generateSuggestedUsername((email || '').split('@')[0]),
    }
  },

  /**
   * Resend Email OTP Code
   */
  async resendEmailOtp(email) {
    await delay(400)
    return {
      success: true,
      message: 'A new 6-digit verification code has been sent.',
    }
  },

  /**
   * Step 3: Complete Profile Setup (Username + Optional Profile Photo) & Create Final User Session
   */
  async setupProfile({ username, profilePhoto }) {
    await delay(400)

    const check = validateUsername(username)
    if (!check.isValid) {
      throw new Error(check.message)
    }

    const pendingRaw = localStorage.getItem(STORAGE_KEYS.PENDING_REGISTRATION)
    const pendingData = pendingRaw ? JSON.parse(pendingRaw) : null

    if (!pendingData || !pendingData.email) {
      throw new Error('Registration session missing or expired. Please sign up again.')
    }

    const fName = pendingData.firstName || ''
    const lName = pendingData.lastName || ''
    const fullN = pendingData.fullName || `${fName} ${lName}`.trim() || pendingData.email.split('@')[0]

    const user = {
      id: `usr-${Date.now()}`,
      firstName: fName,
      lastName: lName,
      fullName: fullN,
      email: pendingData.email,
      password: pendingData.password,
      username: username.trim(),
      profilePhoto: profilePhoto || null,
      targetRole: 'AI Systems Engineer',
      createdAt: pendingData.createdAt || new Date().toISOString(),
      isNewUser: true,
      hasCompletedOnboarding: false,
    }

    // Persist session & update registered users store
    try {
      const regRaw = localStorage.getItem(STORAGE_KEYS.REGISTERED_USERS)
      const registered = regRaw ? JSON.parse(regRaw) : []
      const filtered = registered.filter((u) => u.email.toLowerCase() !== user.email.toLowerCase())
      filtered.push(user)
      localStorage.setItem(STORAGE_KEYS.REGISTERED_USERS, JSON.stringify(filtered))
    } catch (e) {}

    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user))
    localStorage.setItem(STORAGE_KEYS.SESSION, `session_${Date.now()}`)
    localStorage.removeItem(STORAGE_KEYS.PENDING_REGISTRATION)

    return {
      success: true,
      user,
      message: 'Profile setup completed successfully!',
    }
  },

  /**
   * Backwards compatible setupUsername wrapper
   */
  async setupUsername(username, profilePhoto = null) {
    return this.setupProfile({ username, profilePhoto })
  },

  /**
   * Sign In with Email & Password (Strict Credential Verification)
   */
  async signIn({ email, password }) {
    await delay(400)

    const cleanEmail = (email || '').trim().toLowerCase()
    const cleanPassword = (password || '').trim()

    if (!cleanEmail || !cleanPassword) {
      throw new Error('Please enter both email and password.')
    }

    if (!isValidEmail(cleanEmail)) {
      throw new Error('Please enter a valid email address.')
    }

    // Lookup user in registered users store in localStorage
    const regRaw = localStorage.getItem(STORAGE_KEYS.REGISTERED_USERS)
    const registered = regRaw ? JSON.parse(regRaw) : []
    const registeredAccount = registered.find((u) => u.email.toLowerCase() === cleanEmail)

    // Rule 1: If email is NOT registered -> reject login
    if (!registeredAccount) {
      throw new Error('Account not registered. Please sign up first.')
    }

    // Rule 2: If email exists but password does NOT match -> reject login
    if (registeredAccount.password && registeredAccount.password !== cleanPassword) {
      throw new Error('Incorrect email or password.')
    }

    // Rule 3: If email AND password match -> Sign In successful!
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(registeredAccount))
    localStorage.setItem(STORAGE_KEYS.SESSION, `session_${Date.now()}`)

    return {
      success: true,
      user: registeredAccount,
      message: 'Signed in successfully.',
    }
  },

  /**
   * Continue with Google OAuth Integration Point
   */
  async continueWithGoogle() {
    await delay(300)

    console.info('[AuthService] continueWithGoogle invoked. Backend Google OAuth integration pending.')

    return {
      success: false,
      requiresBackendOAuth: true,
      message: 'Google Sign-In will be available once backend OAuth is connected.',
    }
  },

  async googleAuth() {
    return this.continueWithGoogle()
  },

  /**
   * Forgot Password Flow - Step 1: Request OTP
   */
  async forgotPassword(email) {
    await delay(400)

    if (!isValidEmail(email)) {
      throw new Error('Please enter a valid email address.')
    }

    const regRaw = localStorage.getItem(STORAGE_KEYS.REGISTERED_USERS)
    const registered = regRaw ? JSON.parse(regRaw) : []
    const account = registered.find((u) => u.email.toLowerCase() === email.trim().toLowerCase())

    if (!account) {
      throw new Error('Account not registered.')
    }

    return {
      success: true,
      email: email.trim().toLowerCase(),
      message: 'Password reset code sent to your email.',
    }
  },

  /**
   * Forgot Password Flow - Step 2: Verify OTP
   */
  async verifyResetOtp(email, otp) {
    await delay(400)

    if (!otp || otp.trim().length !== 6 || !/^\d+$/.test(otp.trim())) {
      throw new Error('Invalid verification code. Please enter 6 digits.')
    }

    return {
      success: true,
      message: 'Reset code verified.',
    }
  },

  /**
   * Forgot Password Flow - Step 3: Set New Password
   */
  async resetPassword(email, newPassword, confirmPassword) {
    await delay(500)

    const pwCheck = checkPasswordRequirements(newPassword, confirmPassword)
    if (!pwCheck.isAllValid) {
      throw new Error('Please complete all password requirements.')
    }

    // Update password in REGISTERED_USERS store
    try {
      const regRaw = localStorage.getItem(STORAGE_KEYS.REGISTERED_USERS)
      if (regRaw) {
        const registered = JSON.parse(regRaw)
        const idx = registered.findIndex((u) => u.email.toLowerCase() === email.trim().toLowerCase())
        if (idx !== -1) {
          registered[idx].password = newPassword
          localStorage.setItem(STORAGE_KEYS.REGISTERED_USERS, JSON.stringify(registered))
        }
      }
    } catch (e) {}

    return {
      success: true,
      message: 'Password updated successfully. You can now sign in.',
    }
  },

  /**
   * Finish Onboarding
   */
  async completeOnboarding() {
    const currentUser = this.getCurrentUser()
    if (currentUser) {
      const updated = { ...currentUser, hasCompletedOnboarding: true }
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(updated))

      try {
        const regRaw = localStorage.getItem(STORAGE_KEYS.REGISTERED_USERS)
        if (regRaw) {
          const registered = JSON.parse(regRaw)
          const idx = registered.findIndex((u) => u.email.toLowerCase() === updated.email.toLowerCase())
          if (idx !== -1) {
            registered[idx] = { ...registered[idx], ...updated }
            localStorage.setItem(STORAGE_KEYS.REGISTERED_USERS, JSON.stringify(registered))
          }
        }
      } catch (e) {}

      return updated
    }
    return null
  },

  /**
   * Update Profile data
   */
  async updateProfile(updates) {
    const currentUser = this.getCurrentUser()
    if (currentUser) {
      const updated = { ...currentUser, ...updates }
      
      // 1. Update active session user in localStorage
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(updated))

      // 2. Sync changes into persistent REGISTERED_USERS array in localStorage
      try {
        const regRaw = localStorage.getItem(STORAGE_KEYS.REGISTERED_USERS)
        if (regRaw) {
          const registered = JSON.parse(regRaw)
          const idx = registered.findIndex((u) => u.email.toLowerCase() === updated.email.toLowerCase())
          if (idx !== -1) {
            registered[idx] = { ...registered[idx], ...updated }
            localStorage.setItem(STORAGE_KEYS.REGISTERED_USERS, JSON.stringify(registered))
          }
        }
      } catch (e) {
        console.error('Failed to sync updated profile to registered users store:', e)
      }

      return updated
    }
    return null
  },

  /**
   * Sign Out / Logout
   */
  logout() {
    localStorage.removeItem(STORAGE_KEYS.USER)
    localStorage.removeItem(STORAGE_KEYS.SESSION)
    localStorage.removeItem(STORAGE_KEYS.PENDING_REGISTRATION)
  },
}
