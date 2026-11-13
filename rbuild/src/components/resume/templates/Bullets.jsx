/**
 * A role's bullet points. The marker takes the list item's colour and the text is wrapped so it
 * keeps its own: coloured markers that look the same on screen, in print and in html2canvas
 * (which ignores `::marker`).
 */
const Bullets = ({ items, color = '#374151', marker, type = 'disc', fontSize = 13, indent = 16, gap = 3 }) =>
  Array.isArray(items) && items.length > 0 ? (
    <ul
      style={{
        margin: `5px 0 0 ${indent}px`,
        padding: 0,
        fontSize,
        color: marker ?? color,
        listStyleType: type,
      }}
    >
      {items.map((item, index) => (
        <li key={index} style={{ marginBottom: gap }}>
          <span style={{ color }}>{item}</span>
        </li>
      ))}
    </ul>
  ) : null

export default Bullets
