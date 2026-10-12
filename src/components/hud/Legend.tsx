import type { ReactNode } from 'react'
import { STATUS_LABELS } from '../../lib/skillMeta'
import { MATURITY_STATUSES } from '../../types/skill'
import { STATUS_TONE } from '../drawer/labels'

/** Miniatura do hexágono, para a legenda. Usa as mesmas proporções do hexágono da árvore. */
function HexSample({ children }: { children?: ReactNode }) {
  return (
    <span className="relative inline-flex size-7 shrink-0 items-center justify-center">
      <svg width="26" height="26" viewBox="0 0 26 26" aria-hidden>
        <polygon points="2,13 7,4 19,4 24,13 19,22 7,22" fill="var(--t-node-fill)" stroke="var(--t-text-muted)" strokeWidth="1.2" />
      </svg>
      {children}
    </span>
  )
}

function Item({ sample, title, text }: { sample: ReactNode; title: string; text: string }) {
  return (
    <li className="flex items-start gap-3">
      {sample}
      <div className="min-w-0">
        <p className="text-[12px] font-medium">{title}</p>
        <p className="text-[11px] leading-relaxed text-(--t-text-muted)">{text}</p>
      </div>
    </li>
  )
}

/** O que cada símbolo da árvore significa. Fica no painel de filtros, pronto para consultar durante a apresentação. */
export function Legend() {
  return (
    <ul className="space-y-3">
      <Item
        sample={
          <HexSample>
            <span className="absolute top-1 size-1 rounded-full bg-amber-400" aria-hidden />
          </HexSample>
        }
        title="Hexágono e ponto colorido"
        text="Cada hexágono é uma habilidade. O ponto é a cor de assinatura, a mesma em todas as réplicas."
      />
      <Item
        sample={
          <span className="relative inline-flex size-7 shrink-0 items-center justify-center" aria-hidden>
            <span className="absolute inset-0 border-t border-l border-(--t-accent)" style={{ width: 8, height: 8 }} />
            <span className="absolute right-0 bottom-0 border-r border-b border-(--t-accent)" style={{ width: 8, height: 8 }} />
          </span>
        }
        title="Cantoneiras"
        text="Aparecem com o mouse sobre a habilidade, ou quando ela é destacada por um filtro ou benchmark."
      />
      <Item
        sample={
          <span className="inline-flex size-7 shrink-0 items-center justify-center" aria-hidden>
            <svg width="26" height="26" viewBox="0 0 26 26">
              <polygon points="2,13 7,4 19,4 24,13 19,22 7,22" fill="none" stroke="var(--t-text-muted)" strokeWidth="1.2" strokeDasharray="3 2" />
            </svg>
          </span>
        }
        title="Contorno tracejado"
        text="Réplica: a mesma habilidade aparece também em outra área."
      />
      <Item
        sample={<span className="inline-flex size-7 shrink-0 items-center justify-center text-[10px] font-medium text-(--t-text)" aria-hidden>15%</span>}
        title="Cinza e apagado"
        text="Fora do filtro de área, empresa ou maturidade, ou fora do benchmark escolhido."
      />
      <Item
        sample={<span className="inline-flex size-7 shrink-0 items-center justify-center text-[9px] text-(--t-text-muted) opacity-60" aria-hidden>névoa</span>}
        title="Névoa"
        text="Tecnologia posterior à data do Time Slider. Some sem sair da posição."
      />
      <Item
        sample={
          <span className="inline-flex size-7 shrink-0 items-center justify-center" aria-hidden>
            <svg width="26" height="26" viewBox="0 0 26 26">
              <path d="M2 13 H10 V7 H24" fill="none" stroke="var(--t-edge)" strokeWidth="1.4" />
              <circle cx="10" cy="13" r="2" fill="var(--t-accent)" />
            </svg>
          </span>
        }
        title="Trilha com pulso"
        text="Dependência. A energia sai do pré-requisito e segue até a habilidade que ele desbloqueia."
      />
      <li>
        <p className="mb-1 text-[12px] font-medium">Patamares T1 a T5</p>
        <p className="mb-2 text-[11px] leading-relaxed text-(--t-text-muted)">Níveis de evolução, da base (T1, machine learning clássico) ao topo (T5, superinteligência teórica). A explicação completa de cada um está no FAQ.</p>
      </li>
      <li>
        <p className="mb-1.5 text-[12px] font-medium">Maturidade (selo)</p>
        <div className="flex flex-wrap gap-1.5">
          {MATURITY_STATUSES.map((st) => (
            <span
              key={st}
              className={`rounded border px-1.5 py-0.5 font-mono text-[10px] tracking-[0.12em] uppercase ${STATUS_TONE[st]}`}
            >
              {STATUS_LABELS[st]}
            </span>
          ))}
        </div>
      </li>
    </ul>
  )
}
