import TextField from '@mui/material/TextField'

/** Renders one configured section of the resume form (see config/resumeFields.js). */
const SectionFields = ({ section, value = {}, onChange, errors = {} }) => {
  return (
    <div className="st-fields">
      {section.fields.map((field) => {
        const errorMsg = errors[field.name]
        return (
          <TextField
            key={field.name}
            className={field.wide ? 'st-fields__wide' : undefined}
            name={field.name}
            label={field.label}
            type={field.type || 'text'}
            required={Boolean(field.required)}
            value={value[field.name] ?? ''}
            onChange={(e) => onChange(field.name, e.target.value)}
            error={Boolean(errorMsg)}
            helperText={errorMsg || field.hint || ''}
            fullWidth
          />
        )
      })}
    </div>
  )
}

export default SectionFields
