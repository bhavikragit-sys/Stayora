import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';

export const NotFound = ({
  code = '404',
  title = 'Page Not Found',
  description = "The space or page you are looking for doesn't exist, has been removed, or is temporarily unavailable.",
  actionText = 'Explore Stays',
  actionLink = '/listings',
  secondaryActionText = 'Return Home',
  secondaryActionLink = '/'
}) => {
  useEffect(() => {
    const originalTitle = document.title;
    document.title = `${title} · STAYORA`;
    return () => {
      document.title = originalTitle;
    };
  }, [title]);

  return (
    <div className="min-h-[75vh] flex flex-col items-center justify-center text-center px-6 py-16 pt-28 md:pt-32 max-w-2xl mx-auto space-y-8 animate-fade-in-up">
      {/* Visual Accent Badge */}
      <div className="space-y-3">
        <span className="text-[11px] font-sans font-bold tracking-[0.25em] text-stayora-black/45 uppercase block select-none">
          • Error {code} •
        </span>
        <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl text-stayora-black leading-tight tracking-tight select-none">
          {title}
        </h1>
      </div>

      {/* Descriptive message */}
      <p className="text-stayora-black/65 text-lg md:text-xl font-editorial leading-relaxed max-w-lg mx-auto">
        {description}
      </p>

      {/* Clear Call to Actions */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 w-full sm:w-auto">
        <Link to={actionLink} className="w-full sm:w-auto">
          <Button variant="primary" className="w-full sm:w-auto min-w-[180px]">
            {actionText}
          </Button>
        </Link>
        {secondaryActionLink && (
          <Link to={secondaryActionLink} className="w-full sm:w-auto">
            <Button variant="secondary" className="w-full sm:w-auto min-w-[180px]">
              {secondaryActionText}
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
};

export default NotFound;
