import { Icon, IconProps } from '.'

function IconEllipsis(props: IconProps): JSX.Element {
  return <Icon {...props}>
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill={props.fill || "none"}><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg>
  </Icon>
}

export default IconEllipsis
