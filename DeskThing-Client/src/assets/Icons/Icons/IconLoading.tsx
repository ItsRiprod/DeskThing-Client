import { Icon } from '.'

function IconLoading(props): JSX.Element {
  return <Icon {...props} strokeWidth={0} fill="none">
    <svg viewBox="0 0 24 24">
    <style>{`.spinner_V8m1{transformOrigin:center;animation:spinner_zKoa 2s linear infinite}.spinner_V8m1 circle{strokeLinecap:round;animation:spinner_YpZS 1.5s ease-in-out infinite}@keyframes spinner_zKoa{100%{transform:rotate(360deg)}}@keyframes spinner_YpZS{0%{strokeDasharray:0 150;strokeDashoffset:0}47.5%{strokeDasharray:42 150;strokeDashoffset:-16}95%,100%{strokeDasharray:42 150;strokeDashoffset:-59}}`}</style><g className="spinner_V8m1"><circle cx="12" cy="12" r="9.5" fill="none" strokeWidth="3"></circle></g>
    </svg>
    </Icon>
}

export default IconLoading
