import { HERO } from './content';

const kyrgyzLines: Record<string, string> = {
  '# с первых недель — код': '# алгачкы жумалардан — код',
  'for ученик in группа:': 'for окуучу in топ:',
  'ученик.пишет_код()': 'окуучу.код_жазат()',
  'const диплом = ["KG", "RU", "EN"];': 'const диплом = ["KG", "RU", "EN"];',
  'await стажировка("реальные заказы");':
    'await практика("чыныгы буйрутмалар");',
  'runApp(Приложение());': 'runApp(Тиркеме());',
};
export function getHeroVisual(isKg: boolean) {
  const translateCard = (card: {
    lang: string;
    lines: readonly { t: 'comment' | 'code' | 'code-indent'; v: string }[];
  }) => ({
    ...card,
    lines: card.lines.map((line) => ({
      ...line,
      v: isKg ? (kyrgyzLines[line.v] ?? line.v) : line.v,
    })),
  });
  return {
    cards: {
      python: translateCard(HERO.cards.python),
      javascript: translateCard(HERO.cards.javascript),
      flutter: translateCard(HERO.cards.flutter),
    },
    diploma: {
      ...HERO.diploma,
      sub: isKg ? 'Үч тилдеги сертификат' : HERO.diploma.sub,
    },
    sticker: HERO.sticker,
  };
}
