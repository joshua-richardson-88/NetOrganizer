import { IconProps } from '.'
const PlusIcon: React.FC<IconProps> = ({ clickHandler, size }) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    className={size ? `h-${size} w-${size}` : 'h-6 w-6'}
    fill='none'
    viewBox='0 0 24 24'
    stroke='currentColor'
    strokeWidth='2'
    onClick={() => clickHandler && clickHandler()}
  >
    <path strokeLinecap='round' strokeLinejoin='round' d='M12 4v16m8-8H4' />
  </svg>
)
export default PlusIcon
