import classNames from 'classnames';

const Card = ({
  children,
  className,
}: {
  children: React.ReactElement;
  className: string;
}) => (
  <div className={classNames('max-w-xl', className)}>
    <div className="bg-color shadow-md">{children}</div>
  </div>
);

export default Card;
