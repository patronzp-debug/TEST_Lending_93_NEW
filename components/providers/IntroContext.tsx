'use client'

import { createContext, useContext, useState, useCallback } from 'react'

/* ============================================================
   INTRO CONTEXT
   Shared state for the cinematic splash animation.
   isIntro = true  → logo/title centered on screen (splash phase)
   isIntro = false → logo/title fly to Header position
   ============================================================ */

interface IntroContextValue {
  isIntro: boolean
  finishIntro: () => void
}

const IntroContext = createContext<IntroContextValue>({
  isIntro: true,
  finishIntro: () => {},
})

export function IntroProvider({ children }: { children: React.ReactNode }) {
  const [isIntro, setIsIntro] = useState(true)

  const finishIntro = useCallback(() => {
    setIsIntro(false)
  }, [])

  return (
    <IntroContext.Provider value={{ isIntro, finishIntro }}>
      {children}
    </IntroContext.Provider>
  )
}

export function useIntro() {
  return useContext(IntroContext)
}
