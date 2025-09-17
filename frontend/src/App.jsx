import React, { useState } from 'react';
import SignIn from './components/SignIn';
import Dashboard from './components/Dashbaord';

const App = () => {
  // Track if user is signed in
  const [isSignedIn, setIsSignedIn] = useState(false);

  // Function to call after successful sign-in
  const handleSignIn = () => {
    setIsSignedIn(true);
  };

  return (
    <div>
      {isSignedIn ? (
        <Dashboard />
      ) : (
        <SignIn onSignIn={handleSignIn} />
      )}
    </div>
  );
};

export default App;
