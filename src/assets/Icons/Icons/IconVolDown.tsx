import { Icon } from '.'

function IconVolDown(props): JSX.Element {
  return (
    <Icon {...props}>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
        <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
      </svg>
    </Icon>
  )
}

export default IconVolDown
