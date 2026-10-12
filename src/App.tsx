import { useEffect } from 'react'
import { SKILL_BY_ID } from './data'
import { hashForSkill, skillIdFromHash } from './lib/deeplink'
import { focusedSkillOf } from './store/appStore'
import { Moon, Sun } from 'lucide-react'
import { SKILLS } from './data'
import { applyTheme } from './theme/theme'
import { SkillCanvas } from './components/SkillCanvas'
import { SkillDrawer } from './components/drawer/SkillDrawer'
import { PresentationPanel } from './components/presentation/PresentationPanel'
import { PRESENTATION_MODES } from './presentation/modes'
import { BenchmarkVault } from './components/hud/BenchmarkVault'
import { FilterBar } from './components/hud/FilterBar'
import { ArrangeMenu } from './components/hud/ArrangeMenu'
import { FaqPanel } from './components/faq/FaqPanel'
import { TimeSlider } from './components/hud/TimeSlider'
import { useAppStore } from './store/appStore'

const UNIQUE_COUNT = SKILLS.filter((s) => !s.isDuplicateInstance).length

const iconButton =
  'inline-flex size-8 items-center justify-center rounded-md border border-(--t-border) text-(--t-text-muted) transition-colors hover:text-(--t-text)'

const toolButton =
  'hidden h-8 items-center rounded-md border border-(--t-border) px-3 font-mono text-[10px] tracking-[0.12em] text-(--t-text-muted) uppercase transition-colors hover:text-(--t-text) md:inline-flex'

export default function App() {
  const theme = useAppStore((s) => s.theme)
  const setTheme = useAppStore((s) => s.setTheme)
  const showModels = useAppStore((s) => s.showModels)
  const toggleModels = useAppStore((s) => s.toggleModels)
  const resetLayout = useAppStore((s) => s.resetLayout)
  const faqOpen = useAppStore((s) => s.faqOpen)
  const drawerOpen = useAppStore((s) => s.drawer.length > 0)
  // Com a gaveta aberta, o painel superior esquerdo encolhe para a área que sobra ao lado dela, sem ficar por baixo.
  const topPanelWidth = drawerOpen
    ? 'min(560px, calc(100% - min(620px, 60%) - 1.5rem))'
    : 'min(560px, calc(100% - 11rem))'
  const setFaqOpen = useAppStore((s) => s.setFaqOpen)
  const presenting = useAppStore((s) => s.presentation.active)
  const presentationMode = useAppStore((s) => s.presentation.mode)
  const startPresentation = useAppStore((s) => s.startPresentation)
  const stopPresentation = useAppStore((s) => s.stopPresentation)

  useEffect(() => {
    applyTheme(theme)
  }, [theme])

  // Link direto: #habilidade=llm abre a habilidade ao carregar, mesmo se uma apresentação estava aberta.
  // Também vale com a página aberta, quando o hash muda (colar um link na mesma aba).
  // Depois, o endereço acompanha a gaveta: abrir uma habilidade escreve o link, fechar o limpa.
  useEffect(() => {
    const openFromLink = () => {
      const fromLink = skillIdFromHash(window.location.hash)
      if (fromLink && SKILL_BY_ID.has(fromLink)) {
        // Um link pede aquela habilidade: encerra a apresentação que estava aberta na sessão e abre a habilidade.
        useAppStore.getState().stopPresentation()
        useAppStore.getState().openSkill(fromLink)
      }
    }
    openFromLink()
    window.addEventListener('hashchange', openFromLink)
    const unsubscribe = useAppStore.subscribe((state, prev) => {
      if (state.drawer === prev.drawer) return
      const id = focusedSkillOf(state.drawer)
      if (id === focusedSkillOf(prev.drawer)) return
      window.history.replaceState(null, '', window.location.pathname + window.location.search + hashForSkill(id))
    })
    return () => {
      window.removeEventListener('hashchange', openFromLink)
      unsubscribe()
    }
  }, [])

  const nextTheme = theme === 'dark' ? 'light' : 'dark'

  return (
    <div className="flex h-dvh flex-col">
      <header className="relative z-40 flex h-14 shrink-0 items-center justify-between gap-3 border-b border-(--t-border) bg-(--t-surface) px-4">
        <div className="flex min-w-0 items-baseline gap-3">
          <h1 className="truncate text-sm font-semibold tracking-tight">AI Tech Tree & Knowledge</h1>
          <span className="hidden font-mono text-[11px] text-(--t-text-muted) sm:inline">
            {UNIQUE_COUNT} habilidades
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={resetLayout}
            title="Volta cada hexágono para a posição padrão da área e do patamar"
            className={toolButton}
          >
            Padrão
          </button>
          <button
            type="button"
            onClick={() => setFaqOpen(!faqOpen)}
            aria-pressed={faqOpen}
            title="Perguntas frequentes e pesquisa sobre o sistema"
            className={`${toolButton} ${faqOpen ? 'border-(--t-accent) bg-(--t-accent) text-(--t-bg)' : 'hover:text-(--t-text)'}`}
          >
            FAQ
          </button>
          <ArrangeMenu buttonClass={toolButton} />
          {(['apresentacao', 'historia'] as const).map((m) => {
            const on = presenting && presentationMode === m
            return (
              <button
                key={m}
                type="button"
                onClick={() => (on ? stopPresentation() : startPresentation(m))}
                aria-pressed={on}
                title={
                  m === 'apresentacao'
                    ? 'Roteiro para apresentar o sistema: como ler, como explorar, filtros e modelos'
                    : 'Conta a história da IA em ordem, de 1950 até hoje, com a linha do tempo avançando junto'
                }
                className={`${toolButton} ${on ? 'border-(--t-accent) bg-(--t-accent) text-(--t-bg)' : 'hover:text-(--t-text)'}`}
              >
                {PRESENTATION_MODES[m].label}
              </button>
            )
          })}
          <button
            type="button"
            onClick={toggleModels}
            aria-pressed={showModels}
            className={`h-8 rounded-md border px-3 font-mono text-[10px] tracking-[0.12em] uppercase transition-colors ${
              showModels
                ? 'border-(--t-accent) bg-(--t-accent) text-(--t-bg)'
                : 'border-(--t-border) text-(--t-text-muted) hover:text-(--t-text)'
            }`}
          >
            Modelos
          </button>
          <button
            type="button"
            onClick={() => setTheme(nextTheme)}
            aria-label={`Trocar para o tema ${nextTheme === 'dark' ? 'escuro' : 'claro'}`}
            className={iconButton}
          >
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          </button>
        </div>
      </header>

      <div className="flex min-h-0 flex-1">
        <PresentationPanel />
        <main className="relative min-h-0 min-w-0 flex-1 overflow-hidden">
          <SkillCanvas skills={SKILLS} />
          <div className="absolute top-3 left-3 z-20 flex flex-col gap-2" style={{ width: topPanelWidth }}>
            <FilterBar />
          </div>
          <BenchmarkVault />
          <TimeSlider />
          <SkillDrawer />
          <FaqPanel />
        </main>
      </div>
    </div>
  )
}
