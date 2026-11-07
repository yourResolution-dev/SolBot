import React, { createContext, useContext, useState, useEffect } from 'react'
import {
  type OnboardingState,
  type WorkspaceProfile,
  type WhatsAppSetupData,
  type AIAgentSetupData,
  type InvitedTeamMember,
  defaultOnboardingState,
  ONBOARDING_STORAGE_KEY,
  realisticDemoConversations,
} from '@/lib/onboardingData'
import type { Conversation } from '@/lib/inboxData'

interface OnboardingContextType {
  state: OnboardingState
  isOnboardingModalOpen: boolean
  openOnboardingModal: (step?: number) => void
  closeOnboardingModal: () => void
  setStep: (step: number) => void
  nextStep: () => void
  prevStep: () => void
  skipStep: () => void
  skipAll: () => void
  finishOnboarding: () => void
  resetOnboarding: () => void
  demoMode: boolean
  toggleDemoMode: () => void
  loadDemoConversations: () => void
  clearConversations: () => void
  simulateIncomingMessage: () => void
  conversations: Conversation[]
  setConversations: React.Dispatch<React.SetStateAction<Conversation[]>>
  updateWorkspace: (profile: Partial<WorkspaceProfile>) => void
  updateWhatsApp: (whatsapp: Partial<WhatsAppSetupData>) => void
  updateAIAgent: (agent: Partial<AIAgentSetupData>) => void
  addTeamMember: (member: Omit<InvitedTeamMember, 'id' | 'status'>) => void
  removeTeamMember: (id: string) => void
  testWhatsAppPing: () => Promise<{ success: boolean; latency: number }>
  verifyWhatsAppOtp: (otp: string) => boolean
  isTourActive: boolean
  tourStep: number
  startTour: () => void
  nextTourStep: () => void
  prevTourStep: () => void
  skipTour: () => void
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined)

export function OnboardingProvider({ children }: { children: React.ReactNode }) {
  // Load state from localStorage or default
  const [state, setState] = useState<OnboardingState>(() => {
    try {
      const stored = localStorage.getItem(ONBOARDING_STORAGE_KEY)
      if (stored) {
        return JSON.parse(stored)
      }
    } catch {
      // Fallback
    }
    return defaultOnboardingState
  })

  const [isOnboardingModalOpen, setIsOnboardingModalOpen] = useState(() => {
    // Show welcome modal if not yet completed and not closed in current session
    return !state.isCompleted
  })

  const [conversations, setConversations] = useState<Conversation[]>(() => {
    return state.demoMode ? realisticDemoConversations : []
  })

  // Tour state
  const [isTourActive, setIsTourActive] = useState(false)
  const [tourStep, setTourStep] = useState(0)

  // Persist to localStorage on state changes
  useEffect(() => {
    try {
      localStorage.setItem(ONBOARDING_STORAGE_KEY, JSON.stringify(state))
    } catch {
      // Ignore
    }
  }, [state])

  // Sync conversations when demoMode changes
  const toggleDemoMode = () => {
    setState((prev) => {
      const nextMode = !prev.demoMode
      if (nextMode) {
        setConversations(realisticDemoConversations)
      } else {
        setConversations([])
      }
      return { ...prev, demoMode: nextMode }
    })
  }

  const loadDemoConversations = () => {
    setConversations(realisticDemoConversations)
    setState((prev) => ({ ...prev, demoMode: true }))
  }

  const clearConversations = () => {
    setConversations([])
    setState((prev) => ({ ...prev, demoMode: false }))
  }

  const simulateIncomingMessage = () => {
    const randomTicketNum = `RES-${Math.floor(10000 + Math.random() * 90000)}`
    const simulatedConv: Conversation = {
      id: `conv-sim-${Date.now()}`,
      ticketNumber: randomTicketNum,
      customer: {
        id: `cust-sim-${Date.now()}`,
        name: 'Chiara Valenti',
        email: 'chiara.valenti@venicearts.it',
        phone: '+39 333 481 9920',
        avatar: 'CV',
        company: 'Valenti Studio',
        tier: 'Growth',
        location: 'Venice, Italy',
        timezone: 'Europe/Rome (UTC+1)',
        joinedDate: 'Today',
        totalOrders: 1,
        lifetimeValue: '€320.00',
        tags: ['New Customer', 'WhatsApp Direct'],
        orders: [
          {
            id: `ord-sim-1`,
            orderNumber: 'IT-5501-V',
            date: 'Today, 10:15',
            total: '€320.00',
            status: 'Processing',
            items: 'Silk Scarf & Leather Portfolio × 1',
          },
        ],
      },
      channel: 'whatsapp',
      subject: 'Inquiry regarding express delivery timeline to Venice Laguna',
      status: 'open',
      priority: 'high',
      assignedTo: 'Resolution AI Copilot',
      unreadCount: 1,
      lastMessage: 'Customer: Hello! Can order IT-5501-V be delivered by water taxi courier by Friday?',
      lastMessageTime: 'Just now',
      aiActive: true,
      aiConfidence: 93,
      suggestedReplies: [
        'Ciao Chiara! Yes, DHL Express water taxi delivery to Venice Laguna runs daily with guaranteed Friday 12:00 PM delivery.',
        'Would you like me to add lagoon dock instructions for the boat courier?',
        'Escalate to Italian regional logistics specialist for express confirmation.',
      ],
      messages: [
        {
          id: `msg-sim-1`,
          sender: 'customer',
          text: 'Hello! I placed order IT-5501-V this morning. Can it be delivered by water taxi courier to Venice Laguna before Friday evening?',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          status: 'delivered',
        },
      ],
      notes: [
        {
          id: `note-sim-1`,
          author: 'Resolution AI Copilot',
          text: 'New WhatsApp inbound message parsed via Meta Cloud API webhook. Venice Laguna water taxi SLA is 48 hours.',
          time: 'Just now',
        },
      ],
    }

    setConversations((prev) => [simulatedConv, ...prev])
  }

  const openOnboardingModal = (step?: number) => {
    if (typeof step === 'number') {
      setState((prev) => ({ ...prev, currentStep: step }))
    }
    setIsOnboardingModalOpen(true)
  }

  const closeOnboardingModal = () => {
    setIsOnboardingModalOpen(false)
  }

  const setStep = (step: number) => {
    setState((prev) => ({ ...prev, currentStep: step }))
  }

  const nextStep = () => {
    setState((prev) => {
      const next = Math.min(prev.currentStep + 1, 5)
      const completed = Array.from(new Set([...prev.completedSteps, prev.currentStep]))
      return {
        ...prev,
        currentStep: next,
        completedSteps: completed,
      }
    })
  }

  const prevStep = () => {
    setState((prev) => ({
      ...prev,
      currentStep: Math.max(prev.currentStep - 1, 0),
    }))
  }

  const skipStep = () => {
    nextStep()
  }

  const skipAll = () => {
    setState((prev) => ({
      ...prev,
      isCompleted: true,
      currentStep: 5,
    }))
    setIsOnboardingModalOpen(false)
  }

  const finishOnboarding = () => {
    setState((prev) => ({
      ...prev,
      isCompleted: true,
      completedSteps: [0, 1, 2, 3, 4, 5],
      currentStep: 5,
    }))
    setIsOnboardingModalOpen(false)
  }

  const resetOnboarding = () => {
    const resetState: OnboardingState = {
      ...defaultOnboardingState,
      isCompleted: false,
      currentStep: 0,
      completedSteps: [],
      hasSeenTour: false,
    }
    setState(resetState)
    setConversations(realisticDemoConversations)
    setIsOnboardingModalOpen(true)
  }

  const updateWorkspace = (profile: Partial<WorkspaceProfile>) => {
    setState((prev) => ({
      ...prev,
      workspace: { ...prev.workspace, ...profile },
    }))
  }

  const updateWhatsApp = (whatsapp: Partial<WhatsAppSetupData>) => {
    setState((prev) => ({
      ...prev,
      whatsapp: { ...prev.whatsapp, ...whatsapp },
    }))
  }

  const updateAIAgent = (agent: Partial<AIAgentSetupData>) => {
    setState((prev) => ({
      ...prev,
      aiAgent: { ...prev.aiAgent, ...agent },
    }))
  }

  const addTeamMember = (member: Omit<InvitedTeamMember, 'id' | 'status'>) => {
    const newMember: InvitedTeamMember = {
      ...member,
      id: `tm-${Date.now()}`,
      status: 'invited',
    }
    setState((prev) => ({
      ...prev,
      team: [...prev.team, newMember],
    }))
  }

  const removeTeamMember = (id: string) => {
    setState((prev) => ({
      ...prev,
      team: prev.team.filter((m) => m.id !== id),
    }))
  }

  const testWhatsAppPing = async (): Promise<{ success: boolean; latency: number }> => {
    const latency = Math.floor(Math.random() * 40) + 25 // 25-65ms realistic ping
    return new Promise((resolve) => {
      setTimeout(() => {
        setState((prev) => ({
          ...prev,
          whatsapp: {
            ...prev.whatsapp,
            status: 'connected',
            healthLatencyMs: latency,
            lastTestedAt: 'Just now',
          },
        }))
        resolve({ success: true, latency })
      }, 700)
    })
  }

  const verifyWhatsAppOtp = (otp: string): boolean => {
    if (otp.length === 6) {
      setState((prev) => ({
        ...prev,
        whatsapp: {
          ...prev.whatsapp,
          status: 'connected',
          healthLatencyMs: 38,
          lastTestedAt: 'Verified just now',
        },
      }))
      return true
    }
    return false
  }

  // Tour controls
  const startTour = () => {
    setIsOnboardingModalOpen(false)
    setTourStep(0)
    setIsTourActive(true)
  }

  const nextTourStep = () => {
    setTourStep((prev) => {
      if (prev >= 4) {
        setIsTourActive(false)
        setState((s) => ({ ...s, hasSeenTour: true }))
        return 0
      }
      return prev + 1
    })
  }

  const prevTourStep = () => {
    setTourStep((prev) => Math.max(0, prev - 1))
  }

  const skipTour = () => {
    setIsTourActive(false)
    setState((s) => ({ ...s, hasSeenTour: true }))
  }

  return (
    <OnboardingContext.Provider
      value={{
        state,
        isOnboardingModalOpen,
        openOnboardingModal,
        closeOnboardingModal,
        setStep,
        nextStep,
        prevStep,
        skipStep,
        skipAll,
        finishOnboarding,
        resetOnboarding,
        demoMode: state.demoMode,
        toggleDemoMode,
        loadDemoConversations,
        clearConversations,
        simulateIncomingMessage,
        conversations,
        setConversations,
        updateWorkspace,
        updateWhatsApp,
        updateAIAgent,
        addTeamMember,
        removeTeamMember,
        testWhatsAppPing,
        verifyWhatsAppOtp,
        isTourActive,
        tourStep,
        startTour,
        nextTourStep,
        prevTourStep,
        skipTour,
      }}
    >
      {children}
    </OnboardingContext.Provider>
  )
}

export function useOnboarding() {
  const context = useContext(OnboardingContext)
  if (!context) {
    throw new Error('useOnboarding must be used within an OnboardingProvider')
  }
  return context
}
