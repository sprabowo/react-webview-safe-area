import { SafeAreaProvider, SafeAreaView, useSafeArea } from '../../src'
import '../../src/style.css'

function InsetValues() {
  const insets = useSafeArea()

  return (
    <dl style={{ margin: 0, display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '4px 12px' }}>
      <dt>top</dt>
      <dd style={{ margin: 0 }}>{insets.top}px</dd>
      <dt>right</dt>
      <dd style={{ margin: 0 }}>{insets.right}px</dd>
      <dt>bottom</dt>
      <dd style={{ margin: 0 }}>{insets.bottom}px</dd>
      <dt>left</dt>
      <dd style={{ margin: 0 }}>{insets.left}px</dd>
    </dl>
  )
}

export function App() {
  return (
    <SafeAreaProvider fallback={{ top: 16, bottom: 16 }}>
      <div
        style={{
          minHeight: '100dvh',
          display: 'flex',
          flexDirection: 'column',
          fontFamily: 'system-ui, sans-serif',
          background: '#0f172a',
          color: '#e2e8f0',
        }}
      >
        <SafeAreaView
          edges={['top', 'left', 'right']}
          style={{
            background: '#1e293b',
            borderBottom: '1px solid #334155',
            paddingBlock: 12,
            paddingInline: 16,
          }}
        >
          <strong>react-webview-safe-area</strong>
          <div style={{ fontSize: 14, color: '#94a3b8', marginTop: 4 }}>
            Header respects top safe area
          </div>
        </SafeAreaView>

        <main style={{ flex: 1, padding: 16, display: 'grid', gap: 16 }}>
          <section
            style={{
              background: '#1e293b',
              borderRadius: 12,
              padding: 16,
              border: '1px solid #334155',
            }}
          >
            <h2 style={{ margin: '0 0 8px', fontSize: 16 }}>Current insets</h2>
            <InsetValues />
          </section>

          <SafeAreaView
            edges={['bottom', 'left', 'right']}
            style={{
              background: '#172554',
              borderRadius: 12,
              padding: 16,
              border: '1px solid #1d4ed8',
            }}
          >
            <h2 style={{ margin: '0 0 8px', fontSize: 16 }}>Bottom bar</h2>
            <p style={{ margin: 0, fontSize: 14, color: '#93c5fd' }}>
              This block applies bottom safe-area padding only.
            </p>
          </SafeAreaView>
        </main>
      </div>
    </SafeAreaProvider>
  )
}
