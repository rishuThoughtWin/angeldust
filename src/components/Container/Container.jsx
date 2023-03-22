export const Container = (props) => {
  const { children, id, rest, maxWidth } = props;

  return (
    <div className={maxWidth} id={id} {...rest}>
      {children}
    </div>
  );
};
