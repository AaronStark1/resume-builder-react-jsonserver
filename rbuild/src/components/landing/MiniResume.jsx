import ScaledPage from '../resume/ScaledPage'
import ResumeTemplate from '../resume/ResumeTemplate'
import { resumeByTemplate } from './sampleData'

/**
 * A miniature of a real rBuild template: the actual `ResumeTemplate` on its 794px A4 canvas,
 * scaled down by `ScaledPage`. Nothing about the document is restyled — it is always white paper
 * with dark ink, whatever the app theme. The preview is exposed as a single image to assistive
 * technology and its inner links are taken out of the tab order.
 */
const MiniResume = ({ template = 'classic', className = '', label }) => (
  <div
    className={`lp-paper ${className}`}
    role="img"
    aria-label={label ?? `Sample resume in the ${template} template`}
  >
    <div inert>
      <ScaledPage>
        <ResumeTemplate data={resumeByTemplate[template]} />
      </ScaledPage>
    </div>
  </div>
)

export default MiniResume
