interface MenuCardProps {
  name: string;
  description?: string;
  price?: number;
  isActive?: boolean;
  onClick?: () => void;
  href?: string;
  bgImage?: string;
  fontSize?: string; // e.g. 'text-3xl'
  selection?: string; // e.g. 'Finest', 'Exclusive'
  selectionPrice?: number; // Price for the selection
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
  selection,
  selectionPrice,
}: MenuCardProps) {
  // Convert BGN to EUR (approximate rate: 1 EUR = 1.95583 BGN)
  const convertToEuro = (bgnPrice: number) => (bgnPrice / 1.95583).toFixed(2);

  const CardContent = (
    <>
      {bgImage && (
        <div className="absolute inset-0 w-full h-full z-0 bg-contain opacity-40 bg-[center_70%]" style={{backgroundImage: `url('${bgImage}')`, backgroundSize: 'contain', backgroundRepeat: 'no-repeat'}} />
      )}
      
      {/* Main content centered */}
      <div className="relative z-10 flex flex-col justify-center items-center w-full h-full">
        <span className={`font-bold text-accent group-hover:text-leaf font-card ${fontSize}`}>
          {name}
        </span>
        
        {description && (
          <div className="text-leaf text-base mt-2 text-center max-w-xs whitespace-pre-line bg-jungle-dark/30 backdrop-blur-sm rounded-lg px-3 py-2 border border-leaf/20">{description}</div>
        )}
        {typeof price === 'number' && price > 0 && (
          <div className="mt-2 flex flex-col items-center space-y-1">
            <span className="text-xl font-bold text-accent">${price.toFixed(2)}</span>
            <span className="text-sm text-leaf/80">USD</span>
          </div>
        )}
        {!isActive && (
          <div className="mt-2 text-xs font-semibold text-brown uppercase tracking-wide bg-brown/20 backdrop-blur-sm rounded-full px-3 py-1 border border-brown/30">Not available</div>
        )}
      </div>


      { selection && typeof selectionPrice === 'number' && selectionPrice > 0 && (
        <div className="bottom-4 left-0 right-0 z-20 flex justify-between items-center w-full px-2">
          {selection && (
            <div className="">
              <div className="text-leaf font-semibold bg-jungle-dark/70 backdrop-blur-sm rounded-full">
                {selection} selection
              </div>
            </div>
          )}


          {typeof selectionPrice === 'number' && selectionPrice > 0 && (
            <div className="text-right">
              <div className="font-bold text-accent">
                {selectionPrice.toFixed(2)} лв
              </div>
              <div className="font-bold text-accent">
                €{convertToEuro(selectionPrice)}
              </div>
            </div>
          )}
        </div>
      )}
    
    </>
  );

  const baseClass = `relative h-[140px] min-w-[280px] bg-gradient-to-br from-jungle-light/80 via-jungle-dark/60 to-jungle-light/70 backdrop-blur-lg rounded-3xl shadow-2xl p-4 flex flex-col items-center border-2 border-brown/50 hover:border-accent/70 transition-all duration-300 group overflow-hidden hover:shadow-accent/20 hover:scale-[1.02] ${!isActive ? 'opacity-50 grayscale pointer-events-none' : ''} ${onClick || href ? 'cursor-pointer' : ''}`;

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
