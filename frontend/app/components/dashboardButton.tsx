import { ReactNode } from "react";

export const DashboardButton = ({ children, onClick }: {
    children: ReactNode,
    onClick: () => void
}) => {
  return (
    <button
      onClick={onClick}
      className="
        nline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors h-10 px-4 py-2 border border-gray-200 bg-white text-gray-900 shadow-sm hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50
      "
      aria-label="Go to dashboard"
    >
      {children}
    </button>
  );
};
