interface Props {
  items: string[];
}

/**
 * Бегущая строка 14 инструментов: список дублируется для бесшовной
 * прокрутки, дубль помечен aria-hidden (раздел 7 ТЗ).
 */
export function Marquee({ items }: Props) {
  const render = (hidden: boolean) =>
    items.map((item, index) => (
      <span className="marquee__item" key={`${hidden ? 'b' : 'a'}-${item}`}>
        <b>{String(index + 1).padStart(2, '0')}</b>
        {item}
      </span>
    ));

  return (
    <div className="marquee">
      <div className="marquee__track">
        {render(false)}
        <span aria-hidden="true" style={{ display: 'contents' }}>
          {render(true)}
        </span>
      </div>
    </div>
  );
}
