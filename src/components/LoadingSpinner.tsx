export default function LoadingSpinner({ text = 'Loading...' }: { text?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-4">
      <div className="w-10 h-10 border-3 border-teal-200 border-t-teal-500 rounded-full animate-spin" style={{ borderWidth: '3px' }} />
      <p className="text-gray-500 text-sm">{text}</p>
    </div>
  );
}
