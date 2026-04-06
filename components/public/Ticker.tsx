const ITEMS = [
  'Khayal', 'Real Estate', 'EDMO', 'House of H.', 'Fashion',
  'Commerce', 'Artificial Intelligence', 'Building India',
];

export default function Ticker() {
  const items = [...ITEMS, ...ITEMS]; // duplicate for seamless loop
  return (
    <div className="ticker" aria-hidden="true">
      <div className="ticker__inner">
        <div className="ticker__track">
          {items.map((item, i) => (
            <span key={i} className="ticker__item">
              {item} <span>&middot;</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
