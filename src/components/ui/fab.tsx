import { useState } from 'react';


function Fab() {
    const [fabState, setFabState] = useState('default');

    return (
        <button 
        className={`fixed bottom-4 right-4 p-4 rounded-full shadow-lg 
          ${fabState === 'default' ? 'bg-blue-500 text-white' : ''}
          ${fabState === 'active' ? 'bg-green-500 text-white' : ''}
          ${fabState === 'disabled' ? 'bg-gray-500 text-white' : ''}
        `}
        onClick={() => setFabState('active')}  // Change state on click for demonstration
      >
        +
      </button>
    );
  }
  
  export default Fab;
  