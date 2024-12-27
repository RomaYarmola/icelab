const Container = ({ children }) => {
  const maxWidth = 1280;

  return (
    <section className={`max-w-[${maxWidth}px] w-full mx-auto px-4 l:px-20`}>
      {children}
    </section>
  );
};

export default Container;
