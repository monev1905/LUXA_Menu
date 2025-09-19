interface MenuCardProps {
  name: string;
  description?: string;
  price?: number;
  isActive?: boolean;
  onClick?: () => void;
  href?: string;
  bgImage?: string;
  fontSize?: string; // e.g. 'text-3xl'
  minHeight?: string; // e.g. 'h-[200px]'
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
  minHeight,
}: MenuCardProps) {
  const CardContent = (
    <>
      {bgImage && (
        <div className="absolute inset-0 w-full h-full z-0 bg-contain opacity-40 bg-[center_70%]" style={{backgroundImage: `url('${bgImage}')`, backgroundSize: 'contain', backgroundRepeat: 'no-repeat'}} />
      )}
      <div className="relative z-10 flex flex-col justify-center items-center w-full h-full">
        <span className={`font-bold text-accent group-hover:text-leaf font-card ${fontSize}`}>
          {name}
        </span>
        {description && (
          <div className="text-leaf text-base mt-2 text-center max-w-xs whitespace-pre-line">{description}</div>
        )}
        {typeof price === 'number' && price > 0 && (
          <span className="text-lg font-semibold text-leaf mt-2">${price.toFixed(2)}</span>
        )}
        {!isActive && (
          <div className="mt-2 text-xs font-semibold text-brown uppercase tracking-wide">Not available</div>
        )}
      </div>
    </>
  );

  const baseClass = `relative ${minHeight ? minHeight : 'min-h-[auto]'} min-w-[250px] bg-jungle-light/70 backdrop-blur-md rounded-2xl shadow-xl p-8 flex flex-col items-center border-2 border-brown hover:border-accent transition-all duration-200 group overflow-hidden ${!isActive ? 'opacity-50 grayscale pointer-events-none' : ''} ${onClick || href ? 'cursor-pointer' : ''}`;

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