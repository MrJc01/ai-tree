import { useEffect } from 'react'
import { localSkillById, localSkills } from './data/localized'
import { hashForSkill, skillIdFromHash } from './lib/deeplink'
import { focusedSkillOf } from './store/appStore'
import { Moon, Sun } from 'lucide-react'
import { SKILLS } from './data'
import { applyTheme } from './theme/theme'
import { SkillCanvas } from './components/SkillCanvas'
import { SkillDrawer } from './components/drawer/SkillDrawer'
import { PresentationPanel } from './components/presentation/PresentationPanel'
import { BenchmarkVault } from './components/hud/BenchmarkVault'
import { FilterBar } from './components/hud/FilterBar'
import { ArrangeMenu } from './components/hud/ArrangeMenu'
import { LanguageSelect } from './components/hud/LanguageSelect'
import { ExportMenu } from './components/hud/ExportMenu'
import { MobileMenu } from './components/hud/MobileMenu'
import { DESKTOP_QUERY, useMedia } from './lib/useMedia'
import { FaqPanel } from './components/faq/FaqPanel'
import { AboutDialog } from './components/about/AboutDialog'
import { isFirstVisit, markVisited } from './components/about/welcome'
import { TimeSlider } from './components/hud/TimeSlider'
import { useAppStore } from './store/appStore'
import { t } from './i18n'

const UNIQUE_COUNT = SKILLS.filter((s) => !s.isDuplicateInstance).length

const iconButton =
  'inline-flex size-8 items-center justify-center rounded-md border border-(--t-border) text-(--t-text-muted) transition-colors hover:text-(--t-text)'

const toolButton =
  'hidden h-8 items-center whitespace-nowrap rounded-md border border-(--t-border) px-3 font-mono text-[10px] tracking-[0.12em] text-(--t-text-muted) uppercase transition-colors hover:text-(--t-text) lg:inline-flex'

export default function App() {
  const theme = useAppStore((s) => s.theme)
  const locale = useAppStore((s) => s.locale)
  const setTheme = useAppStore((s) => s.setTheme)
  const showModels = useAppStore((s) => s.showModels)
  const toggleModels = useAppStore((s) => s.toggleModels)
  const resetLayout = useAppStore((s) => s.resetLayout)
  const faqOpen = useAppStore((s) => s.faqOpen)
  const drawerOpen = useAppStore((s) => s.drawer.length > 0)
  const desktop = useMedia(DESKTOP_QUERY)
  // Com a gaveta aberta, o painel superior esquerdo encolhe para a área que sobra ao lado dela, sem ficar por baixo.
  // No celular a gaveta sobe por baixo, então o painel ocupa a largura toda.
  const topPanelWidth = !desktop
    ? 'calc(100% - 1.5rem)'
    : drawerOpen
      ? 'min(560px, calc(100% - min(620px, 60%) - 1.5rem))'
      : 'min(560px, calc(100% - 11rem))'
  const setFaqOpen = useAppStore((s) => s.setFaqOpen)
  const setAboutOpen = useAppStore((s) => s.setAboutOpen)
  const presenting = useAppStore((s) => s.presentation.active)
  const presentationMode = useAppStore((s) => s.presentation.mode)
  const startPresentation = useAppStore((s) => s.startPresentation)
  const stopPresentation = useAppStore((s) => s.stopPresentation)

  useEffect(() => {
    applyTheme(theme)
  }, [theme])

  // Primeira visita neste navegador: abre o slide Sobre uma vez. Depois, o botão do cabeçalho abre quando quiser.
  useEffect(() => {
    if (!isFirstVisit()) return
    markVisited()
    setAboutOpen(true)
  }, [setAboutOpen])

  // Link direto: #habilidade=llm abre a habilidade ao carregar, mesmo se uma apresentação estava aberta.
  // Também vale com a página aberta, quando o hash muda (colar um link na mesma aba).
  // Depois, o endereço acompanha a gaveta: abrir uma habilidade escreve o link, fechar o limpa.
  useEffect(() => {
    const openFromLink = () => {
      const fromLink = skillIdFromHash(window.location.hash)
      if (fromLink && localSkillById(fromLink) !== undefined) {
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
    <div key={locale} className="flex h-dvh flex-col">
      <header className="relative z-40 flex h-14 shrink-0 items-center justify-between gap-3 border-b border-(--t-border) bg-(--t-surface) px-4">
        <div className="flex min-w-0 items-baseline gap-3">
          <h1 className="truncate text-sm font-semibold tracking-tight">{t('app.title')}</h1>
          <span className="hidden whitespace-nowrap font-mono text-[11px] text-(--t-text-muted) xl:inline">
            {t('app.count', { count: UNIQUE_COUNT })}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="hidden items-center gap-2 lg:flex">
            <button
              type="button"
              onClick={resetLayout}
              title={t('app.resetTitle')}
              className={toolButton}
            >
              {t('app.reset')}
            </button>
            <button
              type="button"
              onClick={() => setFaqOpen(!faqOpen)}
              aria-pressed={faqOpen}
              title={t('app.faqTitle')}
              className={`${toolButton} ${faqOpen ? 'border-(--t-accent) bg-(--t-accent) text-(--t-bg)' : 'hover:text-(--t-text)'}`}
            >
              {t('app.faq')}
            </button>
            <button
              type="button"
              onClick={() => setAboutOpen(true)}
              aria-haspopup="dialog"
              title={t('app.aboutTitle')}
              className={toolButton}
            >
              {t('app.about')}
            </button>
            <a
              href="https://crom.run"
              target="_blank"
              rel="noreferrer"
              title={t('app.cromTitle')}
              className={toolButton}
            >
              crom.run
            </a>
            <ArrangeMenu buttonClass={toolButton} />
            <ExportMenu buttonClass={toolButton} />
            {(['apresentacao', 'historia'] as const).map((m) => {
              const on = presenting && presentationMode === m
              return (
                <button
                  key={m}
                  type="button"
                  onClick={() => (on ? stopPresentation() : startPresentation(m))}
                  aria-pressed={on}
                  title={m === 'apresentacao' ? t('app.presentationTitle') : t('app.historyTitle')}
                  className={`${toolButton} ${on ? 'border-(--t-accent) bg-(--t-accent) text-(--t-bg)' : 'hover:text-(--t-text)'}`}
                >
                  {m === 'apresentacao' ? t('app.presentation') : t('app.history')}
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
              {t('app.models')}
            </button>
          </div>
          <MobileMenu />
          <LanguageSelect />
          <button
            type="button"
            onClick={() => setTheme(nextTheme)}
            aria-label={nextTheme === 'dark' ? t('app.themeToDark') : t('app.themeToLight')}
            className={iconButton}
          >
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          </button>
        </div>
      </header>

      <div className="relative flex min-h-0 flex-1">
        <PresentationPanel />
        <main className="relative min-h-0 min-w-0 flex-1 overflow-hidden">
          <SkillCanvas skills={localSkills()} />
          <div className="absolute top-3 left-3 z-20 flex flex-col gap-2" style={{ width: topPanelWidth }}>
            <FilterBar />
          </div>
          <BenchmarkVault />
          <TimeSlider />
          <SkillDrawer />
          <FaqPanel />
        </main>
      </div>
      <AboutDialog />
    </div>
  )
}
