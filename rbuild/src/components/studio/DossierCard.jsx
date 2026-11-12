import ExpandMoreIcon from '@mui/icons-material/ExpandMore'

/**
 * One entry in a multi-entry section (a degree, a role), filed like a dossier: an index tab, the
 * entry's title in bold sans with its organisation in italic serif, and a collapsible body.
 * The body stays mounted while collapsed (so field state is never lost) and is made inert.
 */
const DossierCard = ({ index, title, organisation, placeholder, open, onToggle, actions, children }) => (
  <article className="st-dossier" data-open={open ? '' : undefined}>
    <header className="st-dossier__head">
      <button type="button" className="st-dossier__toggle" aria-expanded={open} onClick={onToggle}>
        <span className="st-dossier__tab lp-display">Nº {String(index + 1).padStart(2, '0')}</span>
        <span className="st-dossier__title">
          {title || <span className="st-dossier__empty">{placeholder}</span>}
          {organisation ? <span className="lp-serif st-dossier__org"> — {organisation}</span> : null}
        </span>
        <ExpandMoreIcon className="st-dossier__chevron" />
      </button>
      {actions ? <div className="st-dossier__actions">{actions}</div> : null}
    </header>
    <div className="st-dossier__body" inert={!open}>
      <div className="st-dossier__inner">{children}</div>
    </div>
  </article>
)

export default DossierCard
