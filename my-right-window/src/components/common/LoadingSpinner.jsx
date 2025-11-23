export default function LoadingSpinner({ message = 'Loading...' }) {
  return (
    <div className="flex flex-col items-center justify-center p-8">
      <div className="relative w-16 h-16 mb-4">
        <div className="absolute inset-0 border-4 border-slate-800 rounded-full"></div>
        <div className="absolute inset-0 border-4 border-neon-green border-t-transparent rounded-full animate-spin"></div>
      </div>
      <p className="text-gray-400 animate-pulse">{message}</p>
    </div>
  );
}