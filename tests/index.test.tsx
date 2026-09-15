import { describe, it, expect, beforeEach } from 'vitest'
import { render } from 'vitest-browser-react'
import { page } from '@vitest/browser/context'
import { SafeAreaProvider, SafeAreaView, useSafeArea } from '../src/index'

const setEnvVariables = (top = '0px', right = '0px', bottom = '0px', left = '0px') => {
  const root = document.documentElement
  root.style.setProperty('--rw-safe-top', top)
  root.style.setProperty('--rw-safe-right', right)
  root.style.setProperty('--rw-safe-bottom', bottom)
  root.style.setProperty('--rw-safe-left', left)
}

function TestConsumer() {
  const insets = useSafeArea()
  return <div data-testid="insets">{JSON.stringify(insets)}</div>
}

describe('SafeAreaContext (Browser Mode)', () => {
  beforeEach(() => {
    setEnvVariables()
  })

  it('provides default fallback when CSS variables return 0px', async () => {
    render(
      <SafeAreaProvider>
        <TestConsumer />
      </SafeAreaProvider>
    )

    const expectedText = JSON.stringify({ top: 16, right: 0, bottom: 16, left: 0 })
    await expect.element(page.getByTestId('insets')).toHaveTextContent(expectedText)
  })

  it('prioritizes CSS variables when they are larger than fallback (iOS)', async () => {
    setEnvVariables('44px', '0px', '34px', '0px')

    render(
      <SafeAreaProvider fallback={{ top: 20, bottom: 20 }}>
        <TestConsumer />
      </SafeAreaProvider>
    )

    const expectedText = JSON.stringify({ top: 44, right: 0, bottom: 34, left: 0 })
    await expect.element(page.getByTestId('insets')).toHaveTextContent(expectedText)
  })

  it('prioritizes custom fallback when CSS returns 0px (Android bug)', async () => {
    render(
      <SafeAreaProvider fallback={{ top: 24, bottom: 24 }}>
        <TestConsumer />
      </SafeAreaProvider>
    )

    const expectedText = JSON.stringify({ top: 24, right: 0, bottom: 24, left: 0 })
    await expect.element(page.getByTestId('insets')).toHaveTextContent(expectedText)
  })
})

describe('SafeAreaView (Browser Mode)', () => {

  beforeEach(() => {
    setEnvVariables()
  })

  it('applies correct padding styles based on edges prop', async () => {
    render(
      <SafeAreaProvider fallback={{ top: 20, bottom: 20, left: 10, right: 10 }}>
        <SafeAreaView edges={['top', 'bottom']} data-testid="safe-view">
          Content
        </SafeAreaView>
      </SafeAreaProvider>
    )


    const view = page.getByTestId('safe-view')
    await expect.element(view).toHaveStyle({
      paddingTop: '20px',
      paddingBottom: '20px',
      paddingLeft: '0px',
      paddingRight: '0px'
    })
  })

  it('recalculates insets on window resize', async () => {
    render(
      <SafeAreaProvider fallback={{ top: 0 }}>
        <TestConsumer />
      </SafeAreaProvider>
    )

    await expect.element(page.getByTestId('insets')).toHaveTextContent(/"top":0/)
    setEnvVariables('20px', '0px', '0px', '0px')
    window.dispatchEvent(new Event('resize'))
    await expect.element(page.getByTestId('insets')).toHaveTextContent(/"top":20/)
  })
})