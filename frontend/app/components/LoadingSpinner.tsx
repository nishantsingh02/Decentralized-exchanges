
// components/LoadingSpinner.jsx

export const LoadingSpinner = () => {
  return (
     <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="w-2/3 h-2/3 bg-white rounded-2xl shadow-2xl flex flex-col justify-start items-start p-8 gap-y-8 animate-pulse">
        {/* Greeting Skeleton */}
        <div className="flex items-center w-full">
          <div className="rounded-full bg-gray-300 h-16 w-16"></div>
          <div className="flex-1 space-y-4 py-1 pl-4">
            <div className="h-6 bg-gray-300 rounded w-3/4"></div>
          </div>
        </div>
        {/* Assets Skeleton */}
        <div className="space-y-4 w-full">
            <div className="h-4 bg-gray-300 rounded w-1/4"></div>
            <div className="h-4 bg-gray-300 rounded w-1/2"></div>
        </div>
      </div>
    </div>
  );
}