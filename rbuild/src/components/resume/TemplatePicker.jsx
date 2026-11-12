import CheckIcon from '@mui/icons-material/Check'

import { accentColors, resumeTemplates } from '../../config/resumeDesign'
import '../../studio/controls.css'

/**
 * Template and accent-colour controls. `compact` is the single-row version used above the live
 * preview; the full version adds each template's description.
 */
const TemplatePicker = ({
  currentTemplate = 'classic',
  currentAccent = '#3d0066',
  onTemplateChange,
  onAccentChange,
  compact = false,
}) => {
  return (
    <div className="st-picker" data-compact={compact ? '' : undefined} style={{ '--accent': currentAccent }}>
      {/* TEMPLATE PICKER */}
      <div className="st-picker__group">
        <p className="st-picker__label">Choose Template</p>
        <div className="st-picker__templates" role="group" aria-label="Template">
          {resumeTemplates.map((tpl) => {
            const isSelected = currentTemplate === tpl.id
            return (
              <button
                key={tpl.id}
                type="button"
                className="st-tpl"
                aria-pressed={isSelected}
                title={compact ? tpl.desc : undefined}
                onClick={() => onTemplateChange(tpl.id)}
              >
                <span className="st-tpl__name">
                  {tpl.name}
                  {isSelected && (
                    <span className="st-tpl__check">
                      <CheckIcon />
                    </span>
                  )}
                </span>
                {!compact && <span className="st-tpl__desc">{tpl.desc}</span>}
              </button>
            )
          })}
        </div>
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
