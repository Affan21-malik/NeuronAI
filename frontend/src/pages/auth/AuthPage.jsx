import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Cpu, 
  Sparkles, 
  Mail, 
  Lock, 
  User, 
  AtSign, 
  Check, 
  X, 
  Camera, 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle,
  KeyRound,
  Bot,
  BarChart3,
  Radar,
  Eye,
  EyeOff,
  Activity,
  ChevronRight,
  Target
} from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import { 
  isValidEmail, 
  checkEmailRequirements,
  checkPasswordRequirements, 
  generateSuggestedUsername, 
  validateUsername 
} from '../../services/authService'
import DefaultAvatar from '../../components/DefaultAvatar'

export default function AuthPage() {
  const { 
    authStep, 
    setAuthStep, 
    pendingEmail, 
    suggestedUsername: initialSuggestedUsername,
    error, 
    setError, 
    successMessage, 
    setSuccessMessage,
    login, 
    registerSignUp, 
    verifyOtp, 
    resendOtp, 
    submitProfileSetup, 
    finishOnboarding,
    loginWithGoogle, 
    continueWithGoogle, 
    requestForgotPassword, 
    verifyForgotPasswordOtp, 
    submitNewPassword,
    isLoading 
  } = useAuth()

  // Sign Up Form State
  const [signUpFirstName, setSignUpFirstName] = useState('')
  const [signUpLastName, setSignUpLastName] = useState('')
  const [signUpEmail, setSignUpEmail] = useState('')
  const [signUpPassword, setSignUpPassword] = useState('')
  const [signUpConfirmPassword, setSignUpConfirmPassword] = useState('')
  
  // Clean Form UX state
  const [emailTouched, setEmailTouched] = useState(false)
  const [passwordFocused, setPasswordFocused] = useState(false)

  // Password Show / Hide Toggles
  const [showSignInPw, setShowSignInPw] = useState(false)
  const [showSignUpPw, setShowSignUpPw] = useState(false)
  const [showSignUpConfirmPw, setShowSignUpConfirmPw] = useState(false)
  const [showForgotPw, setShowForgotPw] = useState(false)
  const [showForgotConfirmPw, setShowForgotConfirmPw] = useState(false)

  // Sign In Form State
  const [signInEmail, setSignInEmail] = useState('')
  const [signInPassword, setSignInPassword] = useState('')

  // OTP Form State
  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', ''])
  const [resendTimer, setResendTimer] = useState(60)
  const [canResend, setCanResend] = useState(false)

  // Profile Setup Form State
  const [profilePhoto, setProfilePhoto] = useState(null)
  const [customUsername, setCustomUsername] = useState('')
  const [usernameValidation, setUsernameValidation] = useState({ isValid: true, message: '' })

  // Forgot Password State
  const [forgotEmail, setForgotEmail] = useState('')
  const [forgotPassword, setForgotPassword] = useState('')
  const [forgotConfirmPassword, setForgotConfirmPassword] = useState('')

  // Helper to extract pending name components from form state or localStorage pending registration
  const getPendingFirstName = () => {
    if (signUpFirstName) return signUpFirstName.trim()
    try {
      const raw = localStorage.getItem('neuron_ai_pending_reg')
      if (raw) {
        const data = JSON.parse(raw)
        if (data.firstName) return data.firstName
        if (data.fullName) return data.fullName.split(' ')[0]
      }
    } catch (e) {}
    return ''
  }

  const getPendingLastName = () => {
    if (signUpLastName) return signUpLastName.trim()
    try {
      const raw = localStorage.getItem('neuron_ai_pending_reg')
      if (raw) {
        const data = JSON.parse(raw)
        if (data.lastName) return data.lastName
        if (data.fullName) return data.fullName.split(' ').slice(1).join(' ')
      }
    } catch (e) {}
    return ''
  }

  const getPendingFullName = () => {
    const f = getPendingFirstName()
    const l = getPendingLastName()
    return `${f} ${l}`.trim() || 'Candidate'
  }

  // Sync initial suggested username when auth step changes to PROFILE_SETUP or USERNAME_SETUP
  useEffect(() => {
    if (authStep === 'PROFILE_SETUP' || authStep === 'USERNAME_SETUP') {
      const fullName = getPendingFullName()
      const suggested = initialSuggestedUsername || generateSuggestedUsername(fullName || pendingEmail)
      setCustomUsername(suggested)
      setUsernameValidation(validateUsername(suggested))
    }
  }, [authStep, initialSuggestedUsername, signUpFirstName, signUpLastName, pendingEmail])

  // OTP Timer countdown
  useEffect(() => {
    let timer = null
    if ((authStep === 'EMAIL_OTP' || authStep === 'FORGOT_PASSWORD_OTP') && resendTimer > 0) {
      setCanResend(false)
      timer = setInterval(() => {
        setResendTimer((prev) => {
          if (prev <= 1) {
            setCanResend(true)
            return 0
          }
          return prev - 1
        })
      }, 1000)
    } else if (resendTimer === 0) {
      setCanResend(true)
    }
    return () => clearInterval(timer)
  }, [authStep, resendTimer])

  // Validation computations
  const signUpPwStatus = checkPasswordRequirements(signUpPassword, signUpConfirmPassword)
  const signUpEmailStatus = checkEmailRequirements(signUpEmail)
  const isSignUpEmailValid = signUpEmailStatus.isAllValid
  const isSignUpFormValid = Boolean(
    signUpFirstName.trim() && 
    signUpLastName.trim() && 
    isSignUpEmailValid && 
    signUpPwStatus.isAllValid
  )

  const forgotPwStatus = checkPasswordRequirements(forgotPassword, forgotConfirmPassword)
  const isForgotEmailValid = isValidEmail(forgotEmail)

  // Handle Photo Upload during Profile Setup
  const handlePhotoUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size should be less than 5MB.')
        return
      }
      const reader = new FileReader()
      reader.onloadend = () => {
        setProfilePhoto(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  // Handle OTP Inputs
  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return
    const newDigits = [...otpDigits]
    newDigits[index] = value.slice(-1)
    setOtpDigits(newDigits)

    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-input-${index + 1}`)
      if (nextInput) nextInput.focus()
    }
  }

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      const prevInput = document.getElementById(`otp-input-${index - 1}`)
      if (prevInput) prevInput.focus()
    }
  }

  const handleOtpPaste = (e) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData('text').trim()
    if (/^\d{6}$/.test(pastedData)) {
      setOtpDigits(pastedData.split(''))
    }
  }

  const handleUsernameChange = (val) => {
    setCustomUsername(val)
    setUsernameValidation(validateUsername(val))
  }

  // Handlers
  const handleSignUpSubmit = async (e) => {
    e.preventDefault()
    setEmailTouched(true)
    setPasswordFocused(true)
    if (!isSignUpFormValid) return
    try {
      await registerSignUp({
        firstName: signUpFirstName,
        lastName: signUpLastName,
        email: signUpEmail,
        password: signUpPassword,
        confirmPassword: signUpConfirmPassword,
      })
      setResendTimer(60)
      setOtpDigits(['', '', '', '', '', ''])
    } catch (err) {}
  }

  const handleSignInSubmit = async (e) => {
    e.preventDefault()
    if (!isValidEmail(signInEmail)) {
      setError('Please enter a valid email address.')
      return
    }
    if (!signInPassword) {
      setError('Password is required.')
      return
    }
    try {
      await login({ email: signInEmail, password: signInPassword })
    } catch (err) {}
  }

  const handleOtpSubmit = async (e) => {
    e.preventDefault()
    const fullOtp = otpDigits.join('')
    if (fullOtp.length !== 6) {
      setError('Please enter the 6-digit verification code.')
      return
    }

    if (authStep === 'EMAIL_OTP') {
      try {
        await verifyOtp(fullOtp)
      } catch (err) {}
    } else if (authStep === 'FORGOT_PASSWORD_OTP') {
      try {
        await verifyForgotPasswordOtp(fullOtp)
      } catch (err) {}
    }
  }

  const handleResendClick = async () => {
    if (!canResend) return
    try {
      await resendOtp()
      setResendTimer(60)
      setCanResend(false)
    } catch (err) {}
  }

  const handleProfileSetupSubmit = async (e) => {
    e.preventDefault()
    if (!usernameValidation.isValid) return
    try {
      await submitProfileSetup({
        username: customUsername,
        profilePhoto: profilePhoto,
      })
    } catch (err) {}
  }

  const handleForgotEmailSubmit = async (e) => {
    e.preventDefault()
    if (!isForgotEmailValid) {
      setError('Please enter a valid email address.')
      return
    }
    try {
      await requestForgotPassword(forgotEmail)
      setResendTimer(60)
      setOtpDigits(['', '', '', '', '', ''])
    } catch (err) {}
  }

  const handleResetPasswordSubmit = async (e) => {
    e.preventDefault()
    if (!forgotPwStatus.isAllValid) return
    try {
      await submitNewPassword(forgotPassword, forgotConfirmPassword)
    } catch (err) {}
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4 sm:p-6 lg:p-10 relative overflow-hidden select-none">
      
      {/* Background Neural Grid & Neon Glow Orbs */}
      <div className="absolute inset-0 bg-grid-pattern opacity-30 pointer-events-none" />
      <div className="absolute top-10 left-10 w-96 h-96 bg-indigo-600/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[500px] h-[500px] bg-purple-600/15 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-7xl h-full bg-gradient-to-tr from-indigo-950/20 via-slate-950 to-purple-950/20 pointer-events-none" />

      {/* Main Container Layout */}
      <div className="w-full max-w-5xl z-10 flex flex-col lg:flex-row items-stretch justify-center rounded-3xl bg-slate-900/70 border border-indigo-500/20 backdrop-blur-2xl shadow-[0_0_80px_rgba(15,23,42,0.9)] overflow-hidden min-h-[640px]">
        
        {/* ========================================================================= */}
        {/* LEFT COLUMN: HERO AI VISUAL & TELEMETRY PANEL */}
        {/* ========================================================================= */}
        <div className="hidden lg:flex lg:w-5/12 bg-gradient-to-br from-slate-950 via-indigo-950/50 to-slate-900 p-8 flex-col justify-between relative border-r border-indigo-500/15 overflow-hidden">
          
          <div className="absolute -top-24 -left-24 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-indigo-500/20 rounded-full blur-3xl" />

          {/* Top Brand Emblem */}
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-600 p-[1px] shadow-[0_0_20px_rgba(99,102,241,0.5)]">
                <div className="w-full h-full bg-slate-950 rounded-[11px] flex items-center justify-center">
                  <Cpu className="w-5 h-5 text-indigo-400 animate-pulse" />
                </div>
              </div>
              <div>
                <span className="font-black text-xl tracking-tight text-white block leading-tight">
                  Neur<span className="relative inline-block">o<span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[3px] h-[3px] bg-black rounded-full pointer-events-none" /></span>n<span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">AI</span>
                </span>
                <span className="text-[10px] text-slate-400 font-medium">Autonomous Probing OS</span>
              </div>
            </div>

            <div className="space-y-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">
                <Sparkles className="w-3 h-3 text-purple-400" />
                Next-Gen AI Technical Benchmarks
              </span>
              <h1 className="text-2xl font-extrabold text-white leading-tight tracking-tight">
                Benchmark Your Technical Integrity in Real Time.
              </h1>
              <p className="text-xs text-slate-300 leading-relaxed font-normal">
                NeuronAI uses Model Context Protocol (MCP) and adaptive multi-turn probing to evaluate candidate responses, skill matrices, and system design depth.
              </p>
            </div>
          </div>

          {/* Middle Interactive AI Probing Card */}
          <div className="relative z-10 my-6 p-4 rounded-2xl bg-slate-950/70 border border-indigo-500/20 space-y-3 shadow-inner">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-slate-400 font-medium flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-emerald-400" />
                Live Agent Probing Engine
              </span>
              <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Active v2.4
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/90 border border-indigo-500/15 space-y-1.5 text-xs">
              <div className="flex items-center justify-between font-mono text-[10px]">
                <span className="text-indigo-300 font-bold">MCP Transport Probing</span>
                <span className="text-purple-300">Question 04/10</span>
              </div>
              <p className="text-[11px] text-slate-200 leading-snug font-mono">
                "Explain how context window compression prevents tool-calling state degradation under high concurrency."
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[10px] text-slate-400">
              <div className="p-2 rounded-lg bg-slate-900/60 border border-indigo-500/10 flex items-center gap-2">
                <Radar className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                <span>Knowledge Radar</span>
              </div>
              <div className="p-2 rounded-lg bg-slate-900/60 border border-purple-500/10 flex items-center gap-2">
                <BarChart3 className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                <span>Skill Gap Telemetry</span>
              </div>
            </div>
          </div>

          {/* Bottom Security Footer */}
          <div className="relative z-10 pt-4 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400">
            <span className="flex items-center gap-1.5 font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
              Secured by NeuronAI Neural Encryption
            </span>
            <span className="font-mono text-slate-500">v2.4.0</span>
          </div>

        </div>

        {/* ========================================================================= */}
        {/* RIGHT COLUMN: AUTHENTICATION & PROFILE SETUP FORM CARD */}
        {/* ========================================================================= */}
        <div className="w-full lg:w-7/12 p-6 sm:p-8 lg:p-10 flex flex-col justify-between relative bg-slate-900/60">
          
          {/* Mobile Top Brand Badge */}
          <div className="lg:hidden flex items-center justify-center gap-2 mb-6">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-600 p-[1px] shadow-[0_0_15px_rgba(99,102,241,0.5)]">
              <div className="w-full h-full bg-slate-950 rounded-[11px] flex items-center justify-center">
                <Cpu className="w-4 h-4 text-indigo-400 animate-pulse" />
              </div>
            </div>
            <span className="font-extrabold text-2xl tracking-tight text-white">
              Neur<span className="relative inline-block">o<span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[3px] h-[3px] bg-black rounded-full pointer-events-none" /></span>n<span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">AI</span>
            </span>
          </div>

          {/* Error & Success Toast Messages */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mb-5 p-3.5 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-medium flex items-center gap-2.5 shadow-lg"
              >
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{error}</span>
              </motion.div>
            )}
            {successMessage && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mb-5 p-3.5 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-medium flex items-center gap-2.5 shadow-lg"
              >
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                <span>{successMessage}</span>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex-1 flex flex-col justify-center max-w-md mx-auto w-full">
            
            {/* ====================================================== */}
            {/* VIEW 1: SIGN IN SCREEN */}
            {/* ====================================================== */}
            {authStep === 'SIGN_IN' && (
              <motion.div key="sign-in" initial={{ opacity: 0, x: -15 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 15 }} className="space-y-6">
                
                <div className="text-center space-y-1.5">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500/20 via-purple-500/20 to-pink-500/20 border border-indigo-500/30 flex items-center justify-center mx-auto mb-2 text-indigo-400 shadow-[0_0_20px_rgba(99,102,241,0.2)]">
                    <Cpu className="w-6 h-6 animate-pulse" />
                  </div>
                  <h2 className="text-2xl font-extrabold text-white tracking-tight">Sign in to your account</h2>
                  <p className="text-xs text-slate-400">Welcome back! Please fill in the details to get started.</p>
                </div>

                <form onSubmit={handleSignInSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">Email address</label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                      <input
                        type="email"
                        value={signInEmail}
                        onChange={(e) => setSignInEmail(e.target.value)}
                        placeholder="Enter your email address"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950/80 border border-indigo-500/20 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-1.5">
                      <label className="block text-xs font-semibold text-slate-300">Password</label>
                      <button
                        type="button"
                        onClick={() => setAuthStep('FORGOT_PASSWORD_EMAIL')}
                        className="text-[11px] text-indigo-400 hover:text-indigo-300 transition-colors font-semibold"
                      >
                        Forgot Password?
                      </button>
                    </div>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                      <input
                        type={showSignInPw ? 'text' : 'password'}
                        value={signInPassword}
                        onChange={(e) => setSignInPassword(e.target.value)}
                        placeholder="Enter your password"
                        className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-950/80 border border-indigo-500/20 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowSignInPw(!showSignInPw)}
                        className="absolute right-3.5 top-3 text-slate-400 hover:text-white transition-colors"
                        title={showSignInPw ? 'Hide password' : 'Show password'}
                      >
                        {showSignInPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 text-white font-extrabold text-xs shadow-lg shadow-indigo-500/25 transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
                  >
                    {isLoading ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <span>Sign In</span>
                        <ChevronRight className="w-4 h-4 text-purple-200" />
                      </>
                    )}
                  </button>

                  <div className="relative my-4 flex items-center justify-center">
                    <div className="border-t border-slate-800 w-full" />
                    <span className="bg-slate-900 px-3 text-[10px] text-slate-500 uppercase tracking-wider font-semibold absolute">
                      or
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={continueWithGoogle}
                    disabled={isLoading}
                    className="w-full py-2.5 px-4 rounded-xl bg-slate-950/90 hover:bg-slate-800/80 border border-slate-800 text-slate-200 text-xs font-semibold transition-all flex items-center justify-center gap-2.5 hover:border-slate-700"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                    </svg>
                    <span>Continue with Google</span>
                  </button>
                </form>

                <div className="text-center text-xs text-slate-400 pt-2">
                  Don't have an account?{' '}
                  <button
                    onClick={() => setAuthStep('SIGN_UP')}
                    className="font-bold text-indigo-400 hover:text-indigo-300 transition-colors underline underline-offset-4"
                  >
                    Sign Up
                  </button>
                </div>
              </motion.div>
            )}

            {/* ====================================================== */}
            {/* VIEW 2: SIGN UP SCREEN */}
            {/* ====================================================== */}
            {authStep === 'SIGN_UP' && (
              <motion.div key="sign-up" initial={{ opacity: 0, x: 15 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -15 }} className="space-y-4">
                
                <div className="text-center space-y-1">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500/20 via-purple-500/20 to-pink-500/20 border border-indigo-500/30 flex items-center justify-center mx-auto mb-2 text-indigo-400 shadow-[0_0_20px_rgba(99,102,241,0.2)]">
                    <Sparkles className="w-6 h-6 animate-pulse text-purple-400" />
                  </div>
                  <h2 className="text-2xl font-extrabold text-white tracking-tight">Create your account</h2>
                  <p className="text-xs text-slate-400">Welcome! Please fill in the details to get started.</p>
                </div>

                <form onSubmit={handleSignUpSubmit} className="space-y-3.5">
                  
                  {/* First Name & Last Name (Side-by-side on desktop, responsive mobile) */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">First name</label>
                      <div className="relative">
                        <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                        <input
                          type="text"
                          value={signUpFirstName}
                          onChange={(e) => setSignUpFirstName(e.target.value)}
                          placeholder="First name"
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950/80 border border-indigo-500/20 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Last name</label>
                      <div className="relative">
                        <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                        <input
                          type="text"
                          value={signUpLastName}
                          onChange={(e) => setSignUpLastName(e.target.value)}
                          placeholder="Last name"
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950/80 border border-indigo-500/20 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Email Address */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Email address</label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                      <input
                        type="email"
                        value={signUpEmail}
                        onChange={(e) => {
                          setSignUpEmail(e.target.value)
                          if (!emailTouched) setEmailTouched(true)
                        }}
                        onBlur={() => {
                          if (signUpEmail) setEmailTouched(true)
                        }}
                        placeholder="Enter your email address"
                        className={`w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950/80 border text-xs text-white placeholder-slate-500 focus:outline-none transition-all ${
                          emailTouched && signUpEmail
                            ? signUpEmailStatus.isMalformed
                              ? 'border-rose-500/80 focus:ring-1 focus:ring-rose-500'
                              : signUpEmailStatus.isAllValid
                              ? 'border-emerald-500/50 focus:ring-1 focus:ring-emerald-500'
                              : 'border-indigo-500/40 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20'
                            : 'border-indigo-500/20 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20'
                        }`}
                        required
                      />
                    </div>

                    {/* Progressive Email Requirements & Guidance: ONLY shown when user starts typing */}
                    {emailTouched && signUpEmail && (
                      <div className="mt-2 p-2.5 rounded-xl bg-slate-950/60 border border-indigo-500/15 text-[10px]">
                        {signUpEmailStatus.isMalformed ? (
                          <span className="text-rose-400 font-medium flex items-center gap-1.5">
                            <X className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                            {signUpEmailStatus.malformedReason}
                          </span>
                        ) : signUpEmailStatus.isAllValid ? (
                          <span className="text-emerald-400 font-semibold flex items-center gap-1.5">
                            <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                            Valid email format
                          </span>
                        ) : (
                          <div className="space-y-1">
                            <div className="text-[10px] font-semibold text-slate-400 mb-0.5">Email requirements</div>
                            <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-[10px]">
                              <div className={`flex items-center gap-1.5 ${signUpEmailStatus.validPrefix ? 'text-emerald-400 font-medium' : 'text-slate-500'}`}>
                                {signUpEmailStatus.validPrefix ? <Check className="w-3 h-3 text-emerald-400 shrink-0" /> : <span className="w-1.5 h-1.5 rounded-full bg-slate-700 ml-0.5 mr-0.5" />}
                                Username prefix
                              </div>
                              <div className={`flex items-center gap-1.5 ${signUpEmailStatus.hasAt ? 'text-emerald-400 font-medium' : 'text-slate-500'}`}>
                                {signUpEmailStatus.hasAt ? <Check className="w-3 h-3 text-emerald-400 shrink-0" /> : <span className="w-1.5 h-1.5 rounded-full bg-slate-700 ml-0.5 mr-0.5" />}
                                Contains @
                              </div>
                              <div className={`flex items-center gap-1.5 ${signUpEmailStatus.hasDomain ? 'text-emerald-400 font-medium' : 'text-slate-500'}`}>
                                {signUpEmailStatus.hasDomain ? <Check className="w-3 h-3 text-emerald-400 shrink-0" /> : <span className="w-1.5 h-1.5 rounded-full bg-slate-700 ml-0.5 mr-0.5" />}
                                Domain present
                              </div>
                              <div className={`flex items-center gap-1.5 ${signUpEmailStatus.hasExtension ? 'text-emerald-400 font-medium' : 'text-slate-500'}`}>
                                {signUpEmailStatus.hasExtension ? <Check className="w-3 h-3 text-emerald-400 shrink-0" /> : <span className="w-1.5 h-1.5 rounded-full bg-slate-700 ml-0.5 mr-0.5" />}
                                Domain extension (.com, etc.)
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Password */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Password</label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                      <input
                        type={showSignUpPw ? 'text' : 'password'}
                        value={signUpPassword}
                        onChange={(e) => {
                          setSignUpPassword(e.target.value)
                          if (!passwordFocused) setPasswordFocused(true)
                        }}
                        onFocus={() => setPasswordFocused(true)}
                        placeholder="Create a password"
                        className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-950/80 border border-indigo-500/20 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowSignUpPw(!showSignUpPw)}
                        className="absolute right-3.5 top-3 text-slate-400 hover:text-white transition-colors"
                        title={showSignUpPw ? 'Hide password' : 'Show password'}
                      >
                        {showSignUpPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Confirm password</label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                      <input
                        type={showSignUpConfirmPw ? 'text' : 'password'}
                        value={signUpConfirmPassword}
                        onChange={(e) => {
                          setSignUpConfirmPassword(e.target.value)
                          if (!passwordFocused) setPasswordFocused(true)
                        }}
                        onFocus={() => setPasswordFocused(true)}
                        placeholder="Confirm your password"
                        className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-950/80 border border-indigo-500/20 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowSignUpConfirmPw(!showSignUpConfirmPw)}
                        className="absolute right-3.5 top-3 text-slate-400 hover:text-white transition-colors"
                        title={showSignUpConfirmPw ? 'Hide password' : 'Show password'}
                      >
                        {showSignUpConfirmPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Password requirements: Revealed ONLY when user focuses/types in password field */}
                  {passwordFocused && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="p-3 rounded-xl bg-slate-950/60 border border-indigo-500/15 space-y-1.5 overflow-hidden"
                    >
                      <div className="text-[11px] font-bold text-slate-300">Password requirements</div>
                      <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-[10px]">
                        <div className={`flex items-center gap-1.5 ${signUpPwStatus.minLength ? 'text-emerald-400 font-medium' : 'text-slate-500'}`}>
                          {signUpPwStatus.minLength ? <Check className="w-3 h-3 text-emerald-400" /> : <X className="w-3 h-3 text-slate-600" />}
                          8+ characters
                        </div>
                        <div className={`flex items-center gap-1.5 ${signUpPwStatus.hasUppercase ? 'text-emerald-400 font-medium' : 'text-slate-500'}`}>
                          {signUpPwStatus.hasUppercase ? <Check className="w-3 h-3 text-emerald-400" /> : <X className="w-3 h-3 text-slate-600" />}
                          Uppercase letter
                        </div>
                        <div className={`flex items-center gap-1.5 ${signUpPwStatus.hasLowercase ? 'text-emerald-400 font-medium' : 'text-slate-500'}`}>
                          {signUpPwStatus.hasLowercase ? <Check className="w-3 h-3 text-emerald-400" /> : <X className="w-3 h-3 text-slate-600" />}
                          Lowercase letter
                        </div>
                        <div className={`flex items-center gap-1.5 ${signUpPwStatus.hasNumber ? 'text-emerald-400 font-medium' : 'text-slate-500'}`}>
                          {signUpPwStatus.hasNumber ? <Check className="w-3 h-3 text-emerald-400" /> : <X className="w-3 h-3 text-slate-600" />}
                          Number
                        </div>
                        <div className={`col-span-2 flex items-center gap-1.5 ${signUpPwStatus.matchesConfirm ? 'text-emerald-400 font-medium' : 'text-slate-500'}`}>
                          {signUpPwStatus.matchesConfirm ? <Check className="w-3 h-3 text-emerald-400" /> : <X className="w-3 h-3 text-slate-600" />}
                          Passwords match
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Create Account Primary Button */}
                  <button
                    type="submit"
                    disabled={!isSignUpFormValid || isLoading}
                    className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 text-white font-extrabold text-xs shadow-lg shadow-indigo-500/25 transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-40 disabled:pointer-events-none"
                  >
                    {isLoading ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <span>Create Account</span>
                        <ChevronRight className="w-4 h-4 text-purple-200" />
                      </>
                    )}
                  </button>

                  <div className="relative my-3 flex items-center justify-center">
                    <div className="border-t border-slate-800 w-full" />
                    <span className="bg-slate-900 px-3 text-[10px] text-slate-500 uppercase tracking-wider font-semibold absolute">
                      or
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={continueWithGoogle}
                    disabled={isLoading}
                    className="w-full py-2.5 px-4 rounded-xl bg-slate-950/90 hover:bg-slate-800/80 border border-slate-800 text-slate-200 text-xs font-semibold transition-all flex items-center justify-center gap-2.5 hover:border-slate-700"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                    </svg>
                    <span>Continue with Google</span>
                  </button>
                </form>

                <div className="text-center text-xs text-slate-400 pt-1">
                  Already have an account?{' '}
                  <button
                    onClick={() => setAuthStep('SIGN_IN')}
                    className="font-bold text-indigo-400 hover:text-indigo-300 transition-colors underline underline-offset-4"
                  >
                    Sign In
                  </button>
                </div>
              </motion.div>
            )}

            {/* ====================================================== */}
            {/* VIEW 3: EMAIL OTP VERIFICATION SCREEN */}
            {/* ====================================================== */}
            {(authStep === 'EMAIL_OTP' || authStep === 'FORGOT_PASSWORD_OTP') && (
              <motion.div key="otp-view" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="space-y-6">
                <div className="text-center space-y-1.5">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center mx-auto mb-2 text-indigo-400">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <h2 className="text-xl font-bold text-white">Verify your email</h2>
                  <p className="text-xs text-slate-400 max-w-xs mx-auto">
                    We've sent a verification code to <span className="text-indigo-300 font-semibold">{pendingEmail || signUpEmail || 'your email'}</span>
                  </p>
                </div>

                <form onSubmit={handleOtpSubmit} className="space-y-6">
                  <div className="flex justify-center gap-2 sm:gap-2.5" onPaste={handleOtpPaste}>
                    {otpDigits.map((digit, idx) => (
                      <input
                        key={idx}
                        id={`otp-input-${idx}`}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpChange(idx, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                        className="w-10 h-12 sm:w-11 sm:h-13 rounded-xl bg-slate-950/80 border border-indigo-500/30 text-center font-mono font-bold text-lg text-white focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/40 transition-all shadow-inner"
                      />
                    ))}
                  </div>

                  <button
                    type="submit"
                    disabled={otpDigits.join('').length !== 6 || isLoading}
                    className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 text-white font-bold text-xs shadow-lg shadow-indigo-500/25 transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-40"
                  >
                    {isLoading ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <span>Verify Email</span>
                    )}
                  </button>

                  <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800">
                    <button
                      type="button"
                      onClick={handleResendClick}
                      disabled={!canResend || isLoading}
                      className={`font-semibold transition-colors ${
                        canResend ? 'text-indigo-400 hover:text-indigo-300' : 'text-slate-600 cursor-not-allowed'
                      }`}
                    >
                      Resend Code
                    </button>
                    <span className="font-mono text-slate-400">
                      {canResend ? 'Ready to resend' : `Resend in ${resendTimer}s`}
                    </span>
                  </div>
                </form>
              </motion.div>
            )}

            {/* ====================================================== */}
            {/* VIEW 4: PROFILE SETUP SCREEN ("Complete Your Profile") */}
            {/* ====================================================== */}
            {(authStep === 'PROFILE_SETUP' || authStep === 'USERNAME_SETUP') && (
              <motion.div key="profile-setup" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} className="space-y-5">
                
                {/* Brand Hexagon Emblem & Title */}
                <div className="text-center space-y-1.5">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-600 p-[1px] shadow-[0_0_25px_rgba(99,102,241,0.5)] mx-auto mb-2">
                    <div className="w-full h-full bg-slate-950 rounded-[15px] flex items-center justify-center">
                      <Cpu className="w-6 h-6 text-indigo-400 animate-pulse" />
                    </div>
                  </div>
                  <h2 className="text-2xl font-extrabold text-white">Complete Your Profile</h2>
                  <p className="text-xs text-slate-400">Enter your profile details to continue</p>
                </div>

                <form onSubmit={handleProfileSetupSubmit} className="space-y-4">
                  
                  {/* Profile Photo Section (Optional) */}
                  <div className="p-4 rounded-2xl bg-slate-950/70 border border-indigo-500/20 space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                        <span>Profile Photo</span>
                        <span className="px-2 py-0.5 rounded text-[9px] font-medium bg-slate-800 text-slate-400">Optional</span>
                      </label>
                    </div>

                    <div className="flex items-center gap-4">
                      {/* Avatar preview: uploaded photo OR automatically generated initials avatar */}
                      <div className="relative shrink-0">
                        <DefaultAvatar 
                          src={profilePhoto} 
                          name={getPendingFullName()} 
                          className="w-14 h-14"
                          ring={true}
                        />
                      </div>

                      {/* Upload button UI */}
                      <div className="space-y-1.5 flex-1">
                        <div className="flex items-center gap-2">
                          <label
                            htmlFor="profile-photo-upload"
                            className="px-3 py-1.5 rounded-xl bg-indigo-600/90 hover:bg-indigo-500 text-white text-xs font-semibold cursor-pointer transition-all flex items-center gap-1.5 shadow-md active:scale-95"
                          >
                            <Camera className="w-3.5 h-3.5" />
                            <span>Upload</span>
                            <input 
                              id="profile-photo-upload" 
                              type="file" 
                              accept="image/*" 
                              onChange={handlePhotoUpload} 
                              className="hidden" 
                            />
                          </label>
                          {profilePhoto && (
                            <button
                              type="button"
                              onClick={() => setProfilePhoto(null)}
                              className="text-[11px] text-rose-400 hover:text-rose-300 font-medium transition-colors"
                            >
                              Remove
                            </button>
                          )}
                        </div>
                        <p className="text-[10px] text-slate-400">Recommended size 1:1, up to 5MB.</p>
                      </div>
                    </div>
                  </div>

                  {/* Username Setup */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Choose your username</label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-3 text-slate-400 text-xs font-mono font-bold">@</span>
                      <input
                        type="text"
                        value={customUsername}
                        onChange={(e) => handleUsernameChange(e.target.value)}
                        placeholder="username"
                        className={`w-full pl-8 pr-4 py-2.5 rounded-xl bg-slate-950/80 border text-xs text-white placeholder-slate-500 focus:outline-none transition-all font-mono ${
                          usernameValidation.isValid
                            ? 'border-emerald-500/50 focus:ring-1 focus:ring-emerald-500'
                            : 'border-rose-500/60 focus:ring-1 focus:ring-rose-500'
                        }`}
                        required
                      />
                    </div>

                    <div className="mt-1.5 text-xs">
                      {usernameValidation.isValid ? (
                        <span className="text-emerald-400 font-semibold flex items-center gap-1">
                          <Check className="w-3.5 h-3.5" /> Username available
                        </span>
                      ) : (
                        <span className="text-rose-400 font-semibold flex items-center gap-1">
                          <X className="w-3.5 h-3.5" /> {usernameValidation.message}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Verified Email Display */}
                  <div className="p-2.5 rounded-xl bg-slate-950/50 border border-slate-800 text-center text-xs text-slate-400">
                    Signed in as <span className="font-semibold text-indigo-300">{pendingEmail || signUpEmail || user?.email || ''}</span>
                  </div>

                  {/* Submit CTA */}
                  <button
                    type="submit"
                    disabled={!usernameValidation.isValid || isLoading}
                    className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 text-white font-extrabold text-xs shadow-lg shadow-indigo-500/25 transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-40"
                  >
                    {isLoading ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <span>Continue</span>
                        <ChevronRight className="w-4 h-4 text-purple-200" />
                      </>
                    )}
                  </button>
                </form>
              </motion.div>
            )}

            {/* ====================================================== */}
            {/* VIEW 5: WELCOME / ONBOARDING SCREEN */}
            {/* ====================================================== */}
            {authStep === 'WELCOME' && (
              <motion.div key="welcome-view" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="space-y-6">
                <div className="text-center space-y-1.5">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-600 p-[1px] shadow-[0_0_30px_rgba(99,102,241,0.5)] mx-auto mb-2">
                    <div className="w-full h-full bg-slate-950 rounded-[15px] flex items-center justify-center">
                      <Sparkles className="w-7 h-7 text-indigo-400 animate-pulse" />
                    </div>
                  </div>
                  <h2 className="text-2xl font-extrabold text-white">Welcome to NeuronAI</h2>
                  <p className="text-xs text-indigo-300 font-medium">Your AI-powered technical interview companion</p>
                </div>

                <div className="grid grid-cols-2 gap-2.5 text-left">
                  <div className="p-3 rounded-2xl bg-slate-950/70 border border-indigo-500/20 space-y-1">
                    <Bot className="w-4 h-4 text-indigo-400" />
                    <h4 className="text-xs font-bold text-white">Adaptive Probing</h4>
                    <p className="text-[10px] text-slate-400">Intelligent follow-ups based on response depth</p>
                  </div>
                  <div className="p-3 rounded-2xl bg-slate-950/70 border border-purple-500/20 space-y-1">
                    <Radar className="w-4 h-4 text-purple-400" />
                    <h4 className="text-xs font-bold text-white">Knowledge Map</h4>
                    <p className="text-[10px] text-slate-400">Dynamic skill telemetry & mastery ratings</p>
                  </div>
                  <div className="p-3 rounded-2xl bg-slate-950/70 border border-pink-500/20 space-y-1">
                    <BarChart3 className="w-4 h-4 text-pink-400" />
                    <h4 className="text-xs font-bold text-white">Skill Gap Analysis</h4>
                    <p className="text-[10px] text-slate-400">Pinpoint weak areas & targeted practice</p>
                  </div>
                  <div className="p-3 rounded-2xl bg-slate-950/70 border border-emerald-500/20 space-y-1">
                    <Target className="w-4 h-4 text-emerald-400" />
                    <h4 className="text-xs font-bold text-white">Final Evaluation</h4>
                    <p className="text-[10px] text-slate-400">Hiring recommendations & roadmaps</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={finishOnboarding}
                  className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 text-white font-extrabold text-xs shadow-xl shadow-indigo-500/30 transition-all flex items-center justify-center gap-2 active:scale-95"
                >
                  <span>Let's Get Started</span>
                  <ChevronRight className="w-4 h-4 text-purple-200" />
                </button>
              </motion.div>
            )}

            {/* ====================================================== */}
            {/* VIEW 6: FORGOT PASSWORD - EMAIL STEP */}
            {/* ====================================================== */}
            {authStep === 'FORGOT_PASSWORD_EMAIL' && (
              <motion.div key="forgot-email" initial={{ opacity: 0, x: -15 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 15 }} className="space-y-5">
                <div className="text-center space-y-1.5">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center mx-auto mb-2 text-indigo-400">
                    <KeyRound className="w-6 h-6" />
                  </div>
                  <h2 className="text-xl font-bold text-white">Reset Your Password</h2>
                  <p className="text-xs text-slate-400">Enter your registered email address to receive an OTP code</p>
                </div>

                <form onSubmit={handleForgotEmailSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">Email address</label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                      <input
                        type="email"
                        value={forgotEmail}
                        onChange={(e) => setForgotEmail(e.target.value)}
                        placeholder="Enter your email address"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950/80 border border-indigo-500/20 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                        required
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={!isForgotEmailValid || isLoading}
                    className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 text-white font-bold text-xs shadow-lg shadow-indigo-500/25 transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-40"
                  >
                    {isLoading ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <span>Send Verification Code</span>
                        <ChevronRight className="w-4 h-4 text-purple-200" />
                      </>
                    )}
                  </button>
                </form>

                <div className="text-center text-xs text-slate-400 pt-2">
                  Remember your password?{' '}
                  <button
                    onClick={() => setAuthStep('SIGN_IN')}
                    className="font-bold text-indigo-400 hover:text-indigo-300 transition-colors underline underline-offset-4"
                  >
                    Sign In
                  </button>
                </div>
              </motion.div>
            )}

            {/* ====================================================== */}
            {/* VIEW 7: FORGOT PASSWORD - NEW PASSWORD STEP */}
            {/* ====================================================== */}
            {authStep === 'FORGOT_PASSWORD_NEW' && (
              <motion.div key="forgot-new-pw" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} className="space-y-4">
                <div className="text-center space-y-1">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto mb-2 text-emerald-400">
                    <Lock className="w-6 h-6" />
                  </div>
                  <h2 className="text-xl font-bold text-white">Create New Password</h2>
                  <p className="text-xs text-slate-400">Set a new strong password for your account</p>
                </div>

                <form onSubmit={handleResetPasswordSubmit} className="space-y-3.5">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">New password</label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                      <input
                        type={showForgotPw ? 'text' : 'password'}
                        value={forgotPassword}
                        onChange={(e) => setForgotPassword(e.target.value)}
                        placeholder="Create a new password"
                        className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-950/80 border border-indigo-500/20 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowForgotPw(!showForgotPw)}
                        className="absolute right-3.5 top-3 text-slate-400 hover:text-white transition-colors"
                        title={showForgotPw ? 'Hide password' : 'Show password'}
                      >
                        {showForgotPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Confirm new password</label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                      <input
                        type={showForgotConfirmPw ? 'text' : 'password'}
                        value={forgotConfirmPassword}
                        onChange={(e) => setForgotConfirmPassword(e.target.value)}
                        placeholder="Confirm new password"
                        className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-950/80 border border-indigo-500/20 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowForgotConfirmPw(!showForgotConfirmPw)}
                        className="absolute right-3.5 top-3 text-slate-400 hover:text-white transition-colors"
                        title={showForgotConfirmPw ? 'Hide password' : 'Show password'}
                      >
                        {showForgotConfirmPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Password Requirements Checklist */}
                  <div className="p-3 rounded-xl bg-slate-950/60 border border-indigo-500/15 space-y-1.5">
                    <div className="text-[11px] font-bold text-slate-300">Password requirements</div>
                    <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-[10px]">
                      <div className={`flex items-center gap-1.5 ${forgotPwStatus.minLength ? 'text-emerald-400 font-medium' : 'text-slate-500'}`}>
                        {forgotPwStatus.minLength ? <Check className="w-3 h-3 text-emerald-400" /> : <X className="w-3 h-3 text-slate-600" />}
                        8+ characters
                      </div>
                      <div className={`flex items-center gap-1.5 ${forgotPwStatus.hasUppercase ? 'text-emerald-400 font-medium' : 'text-slate-500'}`}>
                        {forgotPwStatus.hasUppercase ? <Check className="w-3 h-3 text-emerald-400" /> : <X className="w-3 h-3 text-slate-600" />}
                        Uppercase letter
                      </div>
                      <div className={`flex items-center gap-1.5 ${forgotPwStatus.hasLowercase ? 'text-emerald-400 font-medium' : 'text-slate-500'}`}>
                        {forgotPwStatus.hasLowercase ? <Check className="w-3 h-3 text-emerald-400" /> : <X className="w-3 h-3 text-slate-600" />}
                        Lowercase letter
                      </div>
                      <div className={`flex items-center gap-1.5 ${forgotPwStatus.hasNumber ? 'text-emerald-400 font-medium' : 'text-slate-500'}`}>
                        {forgotPwStatus.hasNumber ? <Check className="w-3 h-3 text-emerald-400" /> : <X className="w-3 h-3 text-slate-600" />}
                        Number
                      </div>
                      <div className={`col-span-2 flex items-center gap-1.5 ${forgotPwStatus.matchesConfirm ? 'text-emerald-400 font-medium' : 'text-slate-500'}`}>
                        {forgotPwStatus.matchesConfirm ? <Check className="w-3 h-3 text-emerald-400" /> : <X className="w-3 h-3 text-slate-600" />}
                        Passwords match
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={!forgotPwStatus.isAllValid || isLoading}
                    className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 text-white font-bold text-xs shadow-lg shadow-indigo-500/25 transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-40"
                  >
                    {isLoading ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <span>Update Password</span>
                    )}
                  </button>
                </form>
              </motion.div>
            )}

          </div>

          {/* Footer Metadata */}
          <div className="mt-6 text-center text-[10px] text-slate-500 flex items-center justify-center gap-2">
            <span>Secured by NeuronAI Neural Encryption</span>
            <span>•</span>
            <span className="font-mono">PRO v2.4</span>
          </div>

        </div>

      </div>

    </div>
  )
}
