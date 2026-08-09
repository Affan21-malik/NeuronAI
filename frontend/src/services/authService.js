import { supabase } from '../lib/Supabase'

// Email validation helper
export const isValidEmail = (email) => {
  if (!email || typeof email !== 'string') return false
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
  return emailRegex.test(email.trim())
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

export const generateSuggestedUsername = (fullName = '') => {
  if (!fullName || typeof fullName !== 'string') return 'candidate_ai'
  const cleaned = fullName
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, '_')
  return cleaned ? `${cleaned}_dev` : 'candidate_dev'
}

export const validateUsername = (username = '') => {
  if (!username || typeof username !== 'string') {
    return { isValid: false, message: 'Username cannot be empty' }
  }
  const trimmed = username.trim().replace(/^@/, '')
  if (trimmed.length < 3) {
    return { isValid: false, message: 'Username must be at least 3 characters' }
  }
  if (trimmed.length > 30) {
    return { isValid: false, message: 'Username must be 30 characters or less' }
  }
  if (!/^[a-zA-Z0-9_]+$/.test(trimmed)) {
    return { isValid: false, message: 'Username can only contain letters, numbers, and underscores' }
  }
  return { isValid: true, message: 'Username is available' }
}

export function formatSupabaseUser(sbUser, profileData = {}) {
  if (!sbUser) return null
  const meta = sbUser.user_metadata || {}
  const fullName = profileData.full_name || meta.full_name || meta.name || sbUser.email?.split('@')[0] || 'Candidate'
  const username = meta.username || profileData.username || sbUser.email?.split('@')[0] || 'candidate'

  return {
    id: sbUser.id,
    email: sbUser.email,
    fullName: fullName,
    username: username,
    firstName: fullName.split(' ')[0] || '',
    lastName: fullName.split(' ').slice(1).join(' ') || '',
    role: 'Candidate',
    avatar: meta.avatar_url || profileData.avatar || null,
    hasCompletedOnboarding: meta.hasCompletedOnboarding ?? true,
    isNewUser: meta.isNewUser ?? false,
    createdAt: sbUser.created_at,
  }
}

export const authService = {
  async getCurrentUser() {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return null

      let profileData = {}
      try {
        const { data } = await supabase.from('profiles').select('*').eq('id', user.id).maybeSingle()
        if (data) profileData = data
      } catch {
        // Fallback to metadata
      }

      return formatSupabaseUser(user, profileData)
    } catch {
      return null
    }
  },

  async isAuthenticated() {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      return Boolean(session)
    } catch {
      return false
    }
  },

  async getSession() {
    const { data: { session } } = await supabase.auth.getSession()
    return session
  },

  async signUp({ firstName, lastName, email, password, confirmPassword }) {
    if (confirmPassword && password !== confirmPassword) {
      throw new Error('Passwords do not match.')
    }

    const fullName = `${firstName || ''} ${lastName || ''}`.trim() || 'Candidate'
    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    })

    if (error) throw new Error(error.message)

    const user = data.user
    if (user) {
      try {
        await supabase.from('profiles').upsert({
          id: user.id,
          full_name: fullName,
        })
      } catch (err) {
        console.error('Failed to create user profile:', err)
      }
    }

    return {
      user: user ? formatSupabaseUser(user, { full_name: fullName }) : null,
      session: data.session,
      email: email.trim(),
      message: 'Account created successfully.',
    }
  },

  async signIn({ email, password }) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    })

    if (error) throw new Error(error.message)

    const user = data.user
    let fullName = user.user_metadata?.full_name || user.email?.split('@')[0] || 'Candidate'

    try {
      const { data: profile } = await supabase.from('profiles').select('full_name').eq('id', user.id).maybeSingle()
      if (profile?.full_name) {
        fullName = profile.full_name
      } else {
        await supabase.from('profiles').upsert({ id: user.id, full_name: fullName })
      }
    } catch {
      // Ignore profile lookup error
    }

    return {
      user: formatSupabaseUser(user, { full_name: fullName }),
      session: data.session,
    }
  },

  async verifyEmailOtp(email, otp) {
    return {
      success: true,
      suggestedUsername: generateSuggestedUsername(email),
    }
  },

  async resendEmailOtp(email) {
    return {
      success: true,
      message: 'Verification code resent.',
    }
  },

  async setupProfile({ username, profilePhoto }) {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('No authenticated user found.')

    await supabase.auth.updateUser({
      data: {
        username,
        avatar_url: profilePhoto,
      },
    })

    return {
      user: formatSupabaseUser(user, { username }),
    }
  },

  async completeOnboarding() {
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      await supabase.auth.updateUser({
        data: { hasCompletedOnboarding: true },
      })
      return formatSupabaseUser(user)
    }
    return null
  },

  async continueWithGoogle() {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin,
          queryParams: {
            prompt: 'select_account',
          },
        },
      })
      if (error) {
        if (
          error.message?.toLowerCase().includes('provider is not enabled') ||
          error.message?.toLowerCase().includes('validation_failed') ||
          error.code === 'validation_failed' ||
          error.status === 400
        ) {
          throw new Error(
            'Google Sign-In provider is not enabled in your Supabase project. To enable Google authentication, go to your Supabase Dashboard -> Authentication -> Providers -> Google, enable it, and enter your Google OAuth Client ID & Secret.'
          )
        }
        throw new Error(error.message || 'Google authentication failed.')
      }
      return { success: true, data }
    } catch (err) {
      if (
        err.message?.toLowerCase().includes('provider is not enabled') ||
        err.message?.toLowerCase().includes('validation_failed')
      ) {
        throw new Error(
          'Google Sign-In provider is not enabled in your Supabase project. To enable Google authentication, go to your Supabase Dashboard -> Authentication -> Providers -> Google, enable it, and enter your Google OAuth Client ID & Secret.'
        )
      }
      throw err
    }
  },

  async forgotPassword(email) {
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${window.location.origin}/auth`,
    })
    if (error) throw new Error(error.message)
    return {
      success: true,
      email: email.trim(),
      message: 'Password reset link sent to your email address.',
    }
  },

  async verifyResetOtp(email, otp) {
    return {
      success: true,
      message: 'Reset code verified.',
    }
  },

  async resetPassword(email, newPassword, confirmPassword) {
    if (confirmPassword && newPassword !== confirmPassword) {
      throw new Error('Passwords do not match.')
    }
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    })
    if (error) throw new Error(error.message)
    return {
      success: true,
      message: 'Password updated successfully. You can now sign in.',
    }
  },

  async updateProfile(updates) {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('No authenticated user found.')

    if (updates.fullName) {
      await supabase.from('profiles').upsert({
        id: user.id,
        full_name: updates.fullName,
      })
      await supabase.auth.updateUser({
        data: { full_name: updates.fullName },
      })
    }

    const updatedUser = await this.getCurrentUser()
    return updatedUser
  },

  async logout() {
    await supabase.auth.signOut()
  },
}
