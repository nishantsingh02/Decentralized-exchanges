// Remember to import the Google icon (e.g., from 'lucide-react', 'react-icons/fa', etc.)
import { FcGoogle } from 'react-icons/fc'; // Assuming 'react-icons/fc' for the Google icon


export function GoogleSignInButton({onClick} : {onClick: () => void}) {
  return (
    <button 
    onClick={onClick}
      className="flex items-center justify-center gap-3 px-6 py-3 border border-gray-300 rounded-xl bg-blue-500 text-gray-700 font-medium shadow-md hover:bg-gray-400 hover:shadow-lg transition-all duration-300"
    >
      <span className='w-10 h-10 flex items-center justify-center bg-white rounded-sm shadow-md '>
        <FcGoogle className="w-6 h-6" /></span>
      <div className='font-semibold text-white text-base tracking-wide'
       >Sign In with Google</div>
      
    </button>
  );
}