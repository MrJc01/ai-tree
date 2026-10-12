import { describeHexagon, type HexItem } from '../../guide/hexGuide'
import { summarizeSkill } from '../../guide/skillSummary'
import type { SkillNode } from '../../types/skill'
import { t } from '../../i18n'

function Items({ items }: { items: HexItem[] }) {
  return (
    <dl className="space-y-2.5">
      {items.map((it) => (
        <div key={it.term} className="grid grid-cols-[minmax(7rem,auto)_1fr] gap-x-3 text-[13px] leading-relaxed">
          <dt className="font-medium">{it.term}</dt>
          <dd className="text-(--t-text-muted)">{it.text}</dd>
        </div>
      ))}
    </dl>
  )
}

/**
 * Aba "Como usar" do hexágono aberto. Explica o que cada parte deste hexágono significa para esta habilidade
 * e como usá-la. O manual do sistema em geral está no FAQ (botão FAQ no topo).
 */
export function GuideSheet({ skill }: { skill: SkillNode }) {
  const summary = summarizeSkill(skill)
  const guide = describeHexagon(skill)

  return (
    <div className="space-y-7">
      <section aria-labelledby="guia-sobre-esta" className="space-y-3 rounded-lg border border-(--t-border) p-4">
        <h2 id="guia-sobre-esta" className="text-[14px] font-semibold">
          {t('guide.aboutThis')}
        </h2>
        <p className="text-[13px] leading-relaxed">{summary.paragraph}</p>
        {summary.replicaNote && <p className="text-[12px] text-(--t-text-muted)">{summary.replicaNote}</p>}
        <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5 text-[12px]">
          {summary.facts.map((f) => (
            <div key={f.label} className="contents">
              <dt className="text-(--t-text-muted)">{f.label}</dt>
              <dd>{f.value}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section aria-labelledby="guia-ler-hexagono" className="space-y-3">
        <h2 id="guia-ler-hexagono" className="text-[15px] font-semibold tracking-tight">
          {t('guide.readHex')}
        </h2>
        <Items items={guide.visual} />
      </section>

      <section aria-labelledby="guia-usar-habilidade" className="space-y-3">
        <h2 id="guia-usar-habilidade" className="text-[15px] font-semibold tracking-tight">
          {t('guide.useThis')}
        </h2>
        <Items items={guide.steps} />
      </section>

      <p className="text-[12px] text-(--t-text-muted)">
        {t('guide.footer')}
      </p>
    </div>
  )
}
