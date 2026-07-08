const Container = ({ children, className = "" }) => {
  const maxWidth = 1280;

  return (
    <section
      className={`max-w-[${maxWidth}px] w-full mx-auto px-4 l:px-20 ${className}`}
    >
      {children}
    </section>
  );
};

export default Container;
