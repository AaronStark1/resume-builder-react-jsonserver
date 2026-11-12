import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'

const SectionFields = ({ section, value = {}, onChange, errors = {} }) => {
  return (
    <Stack spacing={2}>
      {section.fields.map((field) => {
        const errorMsg = errors[field.name]
        return (
          <TextField
            key={field.name}
            name={field.name}
            label={field.label}
            type={field.type || 'text'}
            required={Boolean(field.required)}
            value={value[field.name] ?? ''}
            onChange={(e) => onChange(field.name, e.target.value)}
            error={Boolean(errorMsg)}
            helperText={errorMsg || ''}
            fullWidth
          />
        )
      })}
    </Stack>
  )
}

export default SectionFields

