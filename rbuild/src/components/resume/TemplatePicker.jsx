import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Stack from '@mui/material/Stack'
import Paper from '@mui/material/Paper'
import CheckIcon from '@mui/icons-material/Check'

const templates = [
  {
    id: 'classic',
    name: 'Classic',
    desc: 'Centered header, balanced horizontal layout',
  },
  {
    id: 'modern',
    name: 'Modern',
    desc: 'Colored sidebar for contact & skills, clean body',
  },
  {
    id: 'minimal',
    name: 'Minimal',
    desc: 'Left-aligned, generous whitespace, thin accent lines',
  },
]

const accentColors = [
  { name: 'Royal Purple', value: '#3d0066' },
  { name: 'Navy Blue', value: '#1a365d' },
  { name: 'Emerald', value: '#065f46' },
  { name: 'Crimson', value: '#991b1b' },
  { name: 'Slate Gray', value: '#334155' },
  { name: 'Warm Amber', value: '#c25e00' },
]

const TemplatePicker = ({
  currentTemplate = 'classic',
  currentAccent = '#3d0066',
  onTemplateChange,
  onAccentChange,
}) => {
  return (
    <Box sx={{ mb: 3 }}>
      {/* TEMPLATE PICKER */}
      <Typography variant="subtitle2" fontWeight={700} color="primary.main" mb={1.5}>
        Choose Template
      </Typography>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' },
          gap: 2,
          mb: 3,
        }}
      >
        {templates.map((tpl) => {
          const isSelected = currentTemplate === tpl.id
          return (
            <Paper
              key={tpl.id}
              variant="outlined"
              onClick={() => onTemplateChange(tpl.id)}
              sx={{
                p: 2,
                cursor: 'pointer',
                borderRadius: 2.5,
                borderWidth: isSelected ? 2 : 1,
                borderColor: isSelected ? currentAccent : 'divider',
                bgcolor: (theme) => isSelected
                  ? (theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(61, 0, 102, 0.04)')
                  : 'background.paper',
                transition: 'all 0.2s ease',
                ':hover': {
                  borderColor: currentAccent,
                  transform: 'translateY(-2px)',
                },
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                <Typography variant="subtitle2" fontWeight={700} color="text.primary">
                  {tpl.name}
                </Typography>
                {isSelected && (
                  <Box
                    sx={{
                      width: 18,
                      height: 18,
                      borderRadius: '50%',
                      bgcolor: currentAccent,
                      color: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <CheckIcon sx={{ fontSize: 13 }} />
                  </Box>
                )}
              </Box>
              <Typography variant="caption" color="text.secondary">
                {tpl.desc}
              </Typography>
            </Paper>
          )
        })}
      </Box>

      {/* ACCENT COLOR SWATCHES */}
      <Typography variant="subtitle2" fontWeight={700} color="primary.main" mb={1.5}>
        Accent Color
      </Typography>

      <Stack direction="row" spacing={1.5} flexWrap="wrap" sx={{ gap: 1 }}>
        {accentColors.map((color) => {
          const isSelected = currentAccent === color.value
          return (
            <Box
              key={color.value}
              onClick={() => onAccentChange(color.value)}
              title={color.name}
              sx={{
                width: 36,
                height: 36,
                borderRadius: '50%',
                bgcolor: color.value,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: (theme) => isSelected
                  ? `0 0 0 3px ${theme.palette.background.paper}, 0 0 0 5px ${color.value}`
                  : '0 2px 4px rgba(0,0,0,0.1)',
                transition: 'all 0.2s',
                ':hover': {
                  transform: 'scale(1.1)',
                },
              }}
            >
              {isSelected && <CheckIcon sx={{ color: '#ffffff', fontSize: 20 }} />}
            </Box>
          )
        })}
      </Stack>
    </Box>
  )
}

export default TemplatePicker
