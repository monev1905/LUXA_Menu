interface MenuCardProps {
  name: string;
  description?: string;
  price?: number;
  isActive?: boolean;
  onClick?: () => void;
  href?: string;
  bgImage?: string;
  fontSize?: string; // e.g. 'text-3xl'
  fontFamily?: string; // e.g. 'font-roboto'
  selection?: string; // e.g. 'Finest', 'Exclusive'
  selectionPrice?: number; // Price for the selection
  minHeight?: string; // e.g. 'h-32'
}

export default function MenuCard({ 
  name, 
  description, 
  price, 
  isActive = true, 
  onClick,
  href,
  bgImage,
  fontSize = 'text-[3.5rem]',
  fontFamily = '',
  selection,
  selectionPrice,
  minHeight = 'h-[140px]',
}: MenuCardProps) {
  // Convert BGN to EUR (approximate rate: 1 EUR = 1.95583 BGN)
  const convertToEuro = (bgnPrice: number) => (bgnPrice / 1.95583).toFixed(2);

  const CardContent = (
    <>
      {bgImage && (
        <div className="absolute inset-0 w-full h-full z-0 bg-contain opacity-40 bg-[center_70%]" style={{backgroundImage: `url('${bgImage}')`, backgroundSize: 'contain', backgroundRepeat: 'no-repeat'}} />
      )}
      
      {/* Main content area with flex layout */}
      <div className="relative z-10 flex flex-col justify-between h-full w-full">
        {/* Top content - centered */}
        <div className="flex flex-col justify-center items-center flex-1">
          <span className={`font-bold text-accent group-hover:text-leaf text-center font-card ${fontSize} ${fontFamily}`}>
            {name}
          </span>
          
          {description && (
            <div className={`text-leaf text-base mt-2 text-center max-w-xs whitespace-pre-line bg-jungle-dark/30 backdrop-blur-sm px-3 py-2 ${fontFamily}`}>{description}</div>
          )}
          
          {!isActive && (
            <div className={`mt-2 text-xs font-semibold text-brown uppercase tracking-wide bg-brown/20 backdrop-blur-sm rounded-full px-3 py-1 border border-brown/30 ${fontFamily}`}>Not available</div>
          )}
        </div>

        {/* Bottom content - price and selection */}
        <div className="flex justify-between items-end w-full px-2 pb-2">
          {/* Selection on the left (only for shisha) */}
          {selection && typeof selectionPrice === 'number' && selectionPrice > 0 ? (
            <div className={`text-leaf font-semibold bg-jungle-dark/70 backdrop-blur-sm rounded-full px-3 py-1 ${fontFamily}`}>
              {selection} selection
            </div>
          ) : (
            <div></div> // Empty div to push price to the right
          )}

          {/* Price on the right */}
          {typeof price === 'number' && price > 0 && (
            <div className={`text-right ${fontFamily}`}>
              <div className="text-base font-bold text-accent">
                {price.toFixed(2)} лв
              </div>
              <div className="text-base font-bold text-accent">
                €{convertToEuro(price)}
              </div>
            </div>
          )}

          {/* Selection price on the right (only for shisha) */}
          {selection && typeof selectionPrice === 'number' && selectionPrice > 0 && (
            <div className={`text-right ${fontFamily}`}>
              <div className="text-base font-bold text-accent">
                {selectionPrice.toFixed(2)} лв
              </div>
              <div className="text-base font-bold text-accent">
                €{convertToEuro(selectionPrice)}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );

  const baseClass = `relative ${minHeight} min-w-[280px] bg-gradient-to-br from-jungle-light/80 via-jungle-dark/60 to-jungle-light/70 backdrop-blur-lg rounded-3xl shadow-2xl p-4 flex flex-col items-center border-2 border-brown/50 hover:border-accent/70 transition-all duration-300 group overflow-hidden hover:shadow-accent/20 hover:scale-[1.02] ${!isActive ? 'opacity-50 grayscale pointer-events-none' : ''} ${onClick || href ? 'cursor-pointer' : ''}`;

  if (href) {
    return (
      <a href={href} className={baseClass} tabIndex={0} role="link" onClick={onClick}>
        {CardContent}
      </a>
    );
  }
  return (
    <li className={baseClass} onClick={onClick} tabIndex={onClick ? 0 : undefined} role={onClick ? 'button' : undefined}>
      {CardContent}
    </li>
  );
}
