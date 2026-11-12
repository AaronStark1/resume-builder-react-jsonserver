import { Link } from 'react-router-dom'
import GitHubIcon from '@mui/icons-material/GitHub'
import FavoriteIcon from '@mui/icons-material/Favorite'

const LINKS = [
  { label: 'Home', to: '/' },
  { label: 'Studio', to: '/form' },
  { label: 'Archive', to: '/history' },
  { label: 'Templates', to: '/resume' },
]

const Footer = () => (
  <footer className="stf">
    <div className="stf__grid">
      <div>
        <div className="lp-display stf__mark">
          <span className="lp-serif">r</span>Build
        </div>
        <p className="stf__tag">
          Professional, ATS-friendly resumes — drafted in a studio, typeset on a single clean page.
        </p>
        <a
          className="stf__social"
          href="https://github.com/AaronStark1/resume-builder-react-jsonserver"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="GitHub repository"
        >
          <GitHubIcon fontSize="small" />
        </a>
      </div>

      <nav aria-label="Footer">
        <p className="lp-eyebrow stf__links-title">Quick links</p>
        <ul className="stf__links">
          {LINKS.map((link) => (
            <li key={link.to}>
              <Link to={link.to}>{link.label}</Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>

    <div className="stf__base">
      <p>
        © {new Date().getFullYear()} rBuild — designed with <FavoriteIcon aria-label="love" /> using React
      </p>
      <p>Free &amp; open source</p>
    </div>
  </footer>
)

export default Footer
