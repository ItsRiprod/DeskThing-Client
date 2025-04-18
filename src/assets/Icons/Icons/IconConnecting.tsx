import { Icon } from '.'

function IconConnecting(props): JSX.Element {
  return (
    <Icon {...props} fill="currentColor">
      <svg viewBox="0 0 24 24">
        <style>{`.spinner_kpYo{animation:spinner_cQNQ 1.55s linear infinite}.spinner_Esax{animation:spinner_sZau 1.55s linear infinite}.spinner_o8QU{animation:spinner_aBcq 1.55s linear infinite}@keyframes spinner_cQNQ{0%,87.1%,100%{opacity:0}16.13%,80.65%{opacity:1}}@keyframes spinner_sZau{0%,16.13%,87.1%,100%{opacity:0}32.26%,80.65%{opacity:1}}@keyframes spinner_aBcq{0%,32.26%,87.1%,100%{opacity:0}48.39%,80.65%{opacity:1}}`}</style>
        <path
          className="spinner_kpYo"
          d="M12,21L15.6,16.2C14.6,15.45 13.35,15 12,15C10.65,15 9.4,15.45 8.4,16.2L12,21"
          opacity="0"
        />
        <path
          className="spinner_kpYo spinner_Esax"
          d="M12,9C9.3,9 6.81,9.89 4.8,11.4L6.6,13.8C8.1,12.67 9.97,12 12,12C14.03,12 15.9,12.67 17.4,13.8L19.2,11.4C17.19,9.89 14.7,9 12,9Z"
          opacity="0"
        />
        <path
          className="spinner_kpYo spinner_o8QU"
          d="M12,3C7.95,3 4.21,4.34 1.2,6.6L3,9C5.5,7.12 8.62,6 12,6C15.38,6 18.5,7.12 21,9L22.8,6.6C19.79,4.34 16.05,3 12,3"
          opacity="0"
        />
      </svg>
    </Icon>
  )
}

export default IconConnecting
