import { FC, ReactElement } from 'react';
import { IButtonProps } from 'src/shared/shared.interface';

const Button: FC<IButtonProps> = (props): ReactElement => {
    const {id,label, className, disabled, role, type, testId, onClick} = props;
  return (
    <button
      id={id}
      type={type}
      className={`${className}`}
      role={role || 'button'}
      disabled={disabled}
      data-testid={testId}
      onClick={onClick}
    >
      {label}
    </button>
  )
};

export default Button;
