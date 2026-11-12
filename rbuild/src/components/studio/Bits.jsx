import { Link } from 'react-router-dom'
import CircularProgress from '@mui/material/CircularProgress'

/** Diagonal arrow. Two copies slide through a mask on hover (see `.lp-arrow` in studio.css). */
export const ArrowBead = ({ className = '' }) => (
  <span className={`lp-arrow ${className}`} aria-hidden="true">
    <svg viewBox="0 0 24 24" focusable="false">
      <path d="M7 17 17 7M9 7h8v8" />
    </svg>
    <svg viewBox="0 0 24 24" focusable="false">
      <path d="M7 17 17 7M9 7h8v8" />
    </svg>
  </span>
)

/** Hand-drawn tomato underline that draws itself on hover / focus of the parent link. */
export const EditorialUnderline = () => (
  <svg className="lp-underline" viewBox="0 0 300 14" preserveAspectRatio="none" aria-hidden="true" focusable="false">
    <path d="M3 9.2C52 3.4 104 2.6 152 6.1c50 3.6 98 4.5 145-1.6" pathLength="1" />
  </svg>
)

/** The same call to action as a <button> (form navigation, submit). `busy` swaps the arrow for a spinner. */
export const CtaButton = ({ children, size = 'md', className = '', busy = false, disabled = false, ...rest }) => (
  <button type="button" className={`lp-cta lp-cta--${size} ${className}`} disabled={disabled || busy} {...rest}>
    <span className="lp-cta__label">{children}</span>
    {busy ? (
      <span className="lp-arrow lp-cta__bead" aria-hidden="true">
        <CircularProgress size={18} thickness={5} color="inherit" />
      </span>
    ) : (
      <ArrowBead className="lp-cta__bead" />
    )}
  </button>
)

/** Primary call to action: tomato pill with an attached arrow bead. */
export const CtaLink = ({ to, state, children, size = 'lg', className = '', ...rest }) => (
  <Link to={to} state={state} className={`lp-cta lp-cta--${size} ${className}`} {...rest}>
    <span className="lp-cta__label">{children}</span>
    <ArrowBead className="lp-cta__bead" />
  </Link>
)

/** Editorial text link with the hand-drawn underline. Pass `to` for a route or `href` for an anchor. */
export const EditorialLink = ({ to, state, href, onClick, children, className = '', arrow = false }) => {
  const content = (
    <>
      <span className="lp-link__text">
        {children}
        <EditorialUnderline />
      </span>
      {arrow ? <ArrowBead className="lp-link__arrow" /> : null}
    </>
  )
  return to ? (
    <Link to={to} state={state} onClick={onClick} className={`lp-link ${className}`}>
      {content}
    </Link>
  ) : (
    <a href={href} onClick={onClick} className={`lp-link ${className}`}>
      {content}
    </a>
  )
}
