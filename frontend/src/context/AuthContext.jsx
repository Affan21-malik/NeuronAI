import React, { createContext, useState, useEffect } from 'react'
import { authService } from '../services/authService'

export const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [authStep, setAuthStep] = useState('SIGN_IN') // SIGN_IN | SIGN_UP | EMAIL_OTP | USERNAME_SETUP | WELCOME | FORGOT_PASSWORD_EMAIL | FORGOT_PASSWORD_OTP | FORGOT_PASSWORD_NEW
  const [pendingEmail, setPendingEmail] = useState('')
  const [suggestedUsername, setSuggestedUsername] = useState('')
  const [error, setError] = useState(null)
  const [successMessage, setSuccessMessage] = useState(null)

  // Initialize Auth State from localStorage
  useEffect(() => {
    try {
      const storedUser = authService.getCurrentUser()
      if (storedUser && authService.isAuthenticated()) {
        setUser(storedUser)
        setIsAuthenticated(true)
        if (!storedUser.hasCompletedOnboarding && storedUser.isNewUser) {
          setAuthStep('WELCOME')
        }
      }
    } catch (err) {
      console.error('Auth initialization error:', err)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const clearMessages = () => {
    setError(null)
    setSuccessMessage(null)
  }

  // Handle Login
  const login = async ({ email, password }) => {
    clearMessages()
    try {
      setIsLoading(true)
      const res = await authService.signIn({ email, password })
      setUser(res.user)
      setIsAuthenticated(true)
      setSuccessMessage(res.message)
      if (!res.user.hasCompletedOnboarding && res.user.isNewUser) {
        setAuthStep('WELCOME')
      }
      return res
    } catch (err) {
      setError(err.message || 'Failed to sign in. Please try again.')
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  // Handle Sign Up Submission (Step 1)
  const registerSignUp = async ({ firstName, lastName, email, password, confirmPassword }) => {
    clearMessages()
    try {
      setIsLoading(true)
      const res = await authService.signUp({ firstName, lastName, email, password, confirmPassword })
      setPendingEmail(res.email)
      setAuthStep('EMAIL_OTP')
      setSuccessMessage(res.message)
      return res
    } catch (err) {
      setError(err.message || 'Failed to create account.')
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  // Handle Email OTP Verification (Step 2)
  const verifyOtp = async (otp) => {
    clearMessages()
    try {
      setIsLoading(true)
      const res = await authService.verifyEmailOtp(pendingEmail, otp)
      setSuggestedUsername(res.suggestedUsername)
      setAuthStep('PROFILE_SETUP')
      setSuccessMessage('Email verified successfully! Please complete your profile.')
      return res
    } catch (err) {
      setError(err.message || 'Verification failed.')
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  // Resend Email OTP
  const resendOtp = async () => {
    clearMessages()
    try {
      setIsLoading(true)
      const res = await authService.resendEmailOtp(pendingEmail)
      setSuccessMessage(res.message)
      return res
    } catch (err) {
      setError(err.message || 'Failed to resend code.')
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  // Handle Profile Setup (Step 3: Username + Optional Photo)
  const submitProfileSetup = async ({ username, profilePhoto }) => {
    clearMessages()
    try {
      setIsLoading(true)
      const res = await authService.setupProfile({ username, profilePhoto })
      setUser(res.user)
      setIsAuthenticated(true)
      setAuthStep('WELCOME')
      setSuccessMessage('Profile setup complete!')
      return res
    } catch (err) {
      setError(err.message || 'Profile setup failed.')
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const submitUsername = async (username, profilePhoto = null) => {
    return submitProfileSetup({ username, profilePhoto })
  }

  // Handle Onboarding Completion
  const finishOnboarding = async () => {
    try {
      const updated = await authService.completeOnboarding()
      if (updated) setUser(updated)
      setAuthStep('DASHBOARD')
    } catch (err) {
      console.error('Onboarding completion error:', err)
    }
  }

  // Handle Google Auth
  const loginWithGoogle = async () => {
    clearMessages()
    try {
      setIsLoading(true)
      const res = await authService.googleAuth()
      setUser(res.user)
      setIsAuthenticated(true)
      setSuccessMessage(res.message)
      if (!res.user.hasCompletedOnboarding) {
        setAuthStep('WELCOME')
      }
      return res
    } catch (err) {
      setError(err.message || 'Google authentication failed.')
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  // Forgot Password Step 1
  const requestForgotPassword = async (email) => {
    clearMessages()
    try {
      setIsLoading(true)
      const res = await authService.forgotPassword(email)
      setPendingEmail(res.email)
      setAuthStep('FORGOT_PASSWORD_OTP')
      setSuccessMessage(res.message)
      return res
    } catch (err) {
      setError(err.message || 'Failed to initiate password reset.')
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  // Forgot Password Step 2
  const verifyForgotPasswordOtp = async (otp) => {
    clearMessages()
    try {
      setIsLoading(true)
      const res = await authService.verifyResetOtp(pendingEmail, otp)
      setAuthStep('FORGOT_PASSWORD_NEW')
      setSuccessMessage(res.message)
      return res
    } catch (err) {
      setError(err.message || 'Verification code invalid.')
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  // Forgot Password Step 3
  const submitNewPassword = async (newPassword, confirmPassword) => {
    clearMessages()
    try {
      setIsLoading(true)
      const res = await authService.resetPassword(pendingEmail, newPassword, confirmPassword)
      setAuthStep('SIGN_IN')
      setSuccessMessage(res.message)
      return res
    } catch (err) {
      setError(err.message || 'Failed to update password.')
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  // Update Profile
  const updateUserProfile = async (updates) => {
    try {
      const updated = await authService.updateProfile(updates)
      if (updated) setUser(updated)
      return updated
    } catch (err) {
      console.error('Update profile error:', err)
      throw err
    }
  }

  // Logout
  const logout = () => {
    authService.logout()
    setUser(null)
    setIsAuthenticated(false)
    setAuthStep('SIGN_IN')
    setPendingEmail('')
    setSuggestedUsername('')
    clearMessages()
  }

  const value = {
    user,
    isAuthenticated,
    isLoading,
    authStep,
    setAuthStep,
    pendingEmail,
    suggestedUsername,
    error,
    setError,
    successMessage,
    setSuccessMessage,
    login,
    registerSignUp,
    verifyOtp,
    resendOtp,
    submitUsername,
    submitProfileSetup,
    finishOnboarding,
    loginWithGoogle,
    requestForgotPassword,
    verifyForgotPasswordOtp,
    submitNewPassword,
    updateUserProfile,
    logout,
    clearMessages,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
