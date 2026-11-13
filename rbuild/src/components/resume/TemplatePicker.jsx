import CheckIcon from '@mui/icons-material/Check'

import { accentColors, resumeTemplates } from '../../config/resumeDesign'
import TemplateGlyph from './TemplateGlyph'
import '../../studio/controls.css'

/**
 * Template and accent-colour controls for all seven templates. Each tile carries a wireframe of
 * its layout; the full version adds the archetype badge and describes the selected template,
 * `compact` (above the live preview) keeps to icon and name in a wrapping grid.
 */
const TemplatePicker = ({
  currentTemplate = 'classic',
  currentAccent = '#3d0066',
  onTemplateChange,
  onAccentChange,
  compact = false,
}) => {
  const selected = resumeTemplates.find((tpl) => tpl.id === currentTemplate) ?? resumeTemplates[0]

  return (
    <div className="st-picker" data-compact={compact ? '' : undefined} style={{ '--accent': currentAccent }}>
      {/* TEMPLATE PICKER */}
      <div className="st-picker__group">
        <p className="st-picker__label">
          Choose Template <span>{resumeTemplates.length} layouts</span>
        </p>
        <div className="st-picker__templates" role="group" aria-label="Template">
          {resumeTemplates.map((tpl) => {
            const isSelected = selected.id === tpl.id
            return (
              <button
                key={tpl.id}
                type="button"
                className="st-tpl"
                aria-pressed={isSelected}
                title={`${tpl.desc} Suits: ${tpl.fit}.`}
                onClick={() => onTemplateChange(tpl.id)}
              >
                <TemplateGlyph id={tpl.id} />
                <span className="st-tpl__text">
                  <span className="st-tpl__name">{tpl.name}</span>
                  {!compact && <span className="st-tpl__badge">{tpl.badge}</span>}
                </span>
                {isSelected && (
                  <span className="st-tpl__check">
                    <CheckIcon />
                  </span>
                )}
              </button>
            )
          })}
        </div>
        {!compact && (
          <p className="st-picker__about" aria-live="polite">
            {selected.desc} <span>Suits: {selected.fit}.</span>
          </p>
        )}
      </div>

      {/* ACCENT COLOR SWATCHES */}
      <div className="st-picker__group">
        <p className="st-picker__label">Accent Color</p>
        <div className="st-picker__swatches" role="group" aria-label="Accent color">
          {accentColors.map((color) => {
            const isSelected = currentAccent === color.value
            return (
              <button
                key={color.value}
                type="button"
                className="st-swatch"
                style={{ '--swatch': color.value }}
                aria-pressed={isSelected}
                aria-label={color.name}
                title={color.name}
                onClick={() => onAccentChange(color.value)}
              >
                {isSelected && <CheckIcon />}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default TemplatePicker
