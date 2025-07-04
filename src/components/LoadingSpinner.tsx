interface LoadingSpinnerProps {
  message?: string;
  className?: string;
}

export default function LoadingSpinner({ message = "Loading...", className = "" }: LoadingSpinnerProps) {
  return (
    <div className={`text-center text-gray-400 py-10 ${className}`}>
      {message}
    </div>
  );
} 