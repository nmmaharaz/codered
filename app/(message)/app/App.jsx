import React from "react";

const App = ({ children }) => {
  return (
    <section
      className="min-h-[92vh] flex bg-black bg-cover bg-center font-sans text-black"
      data-theme="dark"
    >
      {children}
    </section>
  );
};

export default App;
