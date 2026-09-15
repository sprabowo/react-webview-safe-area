import React, { createContext, useContext, useState, useEffect, useMemo } from 'react'

export type Edge = 'top' | 'right' | 'bottom' | 'left'

export interface EdgeInsets {
  top: number
  right: number
  bottom: number
  left: number
}

export interface SafeAreaProviderProps {
  children: React.ReactNode
  fallback?: Partial<EdgeInsets>
}

export interface SafeAreaViewProps extends React.HTMLAttributes<HTMLDivElement> {
  edges?: Edge[]
  children: React.ReactNode
}

const DEFAULT_FALLBACK: EdgeInsets = { top: 16, right: 0, bottom: 16, left: 0 }

const SafeAreaContext = createContext<EdgeInsets>(DEFAULT_FALLBACK)

const getInsets = (fallback: EdgeInsets): EdgeInsets => {
  if (typeof window === 'undefined') return fallback

  const rootStyle = getComputedStyle(document.documentElement)
  const parsePx = (val: string) => parseInt(val.replace('px', ''), 10) || 0

  return {
    top: Math.max(parsePx(rootStyle.getPropertyValue('--rw-safe-top')), fallback.top),
    right: Math.max(parsePx(rootStyle.getPropertyValue('--rw-safe-right')), fallback.right),
    bottom: Math.max(parsePx(rootStyle.getPropertyValue('--rw-safe-bottom')), fallback.bottom),
    left: Math.max(parsePx(rootStyle.getPropertyValue('--rw-safe-left')), fallback.left),
  }
}

export function SafeAreaProvider({ children, fallback }: SafeAreaProviderProps) {
  const mergedFallback = { ...DEFAULT_FALLBACK, ...fallback }
  const [insets, setInsets] = useState<EdgeInsets>(mergedFallback)

  useEffect(() => {
    const updateInsets = () => setInsets(getInsets(mergedFallback))
    updateInsets()

    window.addEventListener('resize', updateInsets)
    window.addEventListener('orientationchange', updateInsets)

    return () => {
      window.removeEventListener('resize', updateInsets)
      window.removeEventListener('orientationchange', updateInsets)
    }
  }, [mergedFallback.top, mergedFallback.right, mergedFallback.bottom, mergedFallback.left])

  return <SafeAreaContext.Provider value={insets}>{children}</SafeAreaContext.Provider>
}

export function useSafeArea() {
  return useContext(SafeAreaContext)
}

export function SafeAreaView({
  children,
  edges = ['top', 'bottom', 'left', 'right'],
  style,
  ...rest
}: SafeAreaViewProps) {
  const insets = useSafeArea()

  const computedStyle = useMemo(() => ({
    paddingTop: edges.includes('top') ? insets.top : 0,
    paddingBottom: edges.includes('bottom') ? insets.bottom : 0,
    paddingLeft: edges.includes('left') ? insets.left : 0,
    paddingRight: edges.includes('right') ? insets.right : 0,
    ...style
  }), [insets, edges, style])

  return (
    <div style={computedStyle} {...rest}>
      {children}
    </div>
  )
}