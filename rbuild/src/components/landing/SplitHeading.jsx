import { motion } from 'motion/react'

const EXPO_OUT = [0.16, 1, 0.3, 1]

const charVariants = {
  hidden: { y: '115%' },
  show: { y: '0%', transition: { duration: 0.95, ease: EXPO_OUT } },
}

const underlineVariants = {
  hidden: { pathLength: 0, opacity: 0 },
  show: { pathLength: 1, opacity: 1, transition: { duration: 0.9, ease: EXPO_OUT, delay: 0.25 } },
}

const plainText = (lines) => lines.map((line) => line.map((segment) => segment.text).join(' ')).join(' ')

/**
 * Editorial heading with a masked, character-by-character reveal.
 *
 * `lines` is an array of lines; each line is an array of segments `{ text, serif?, underline? }`.
 * Every word is its own overflow mask, so the reveal survives any responsive wrapping, and the
 * masks carry padding so descenders and italic overhangs are never clipped.
 *
 * Assistive technology gets the heading once, as plain text; the split characters are hidden.
 * `mode="inView"` plays once when the heading scrolls into view; `mode="mount"` plays on load.
 */
const SplitHeading = ({ as = 'h2', id, lines, className, delay = 0, stagger = 0.022, mode = 'inView' }) => {
  const Tag = as
  const container = {
    hidden: {},
    show: { transition: { delayChildren: delay, staggerChildren: stagger } },
  }
  const trigger =
    mode === 'mount' ? { animate: 'show' } : { whileInView: 'show', viewport: { once: true, amount: 0.6 } }

  return (
    <Tag id={id} className={className}>
      <span className="lp-sr">{plainText(lines)}</span>
      <motion.span className="lp-split" aria-hidden="true" initial="hidden" variants={container} {...trigger}>
        {lines.map((line, lineIndex) => (
          <span className="lp-line" key={lineIndex}>
            {line.map((segment, segmentIndex) => {
              const words = segment.text.split(' ')
              return (
                <span
                  key={segmentIndex}
                  className={segment.serif ? 'lp-seg lp-serif' : 'lp-seg'}
                  data-accent={segment.accent ? '' : undefined}
                >
                  {words.map((word, wordIndex) => (
                    <span key={wordIndex}>
                      <span className="lp-word">
                        {Array.from(word).map((char, charIndex) => (
                          <motion.span className="lp-ch" key={charIndex} variants={charVariants}>
                            {char}
                          </motion.span>
                        ))}
                      </span>
                      {wordIndex < words.length - 1 ? ' ' : null}
                    </span>
                  ))}
                  {segment.underline ? (
                    <svg className="lp-seg__underline" viewBox="0 0 300 18" preserveAspectRatio="none" focusable="false">
                      <motion.path
                        d="M4 11.5C46 4.5 96 3 148 7.2c44 3.6 96 6.4 148-1.4"
                        variants={underlineVariants}
                      />
                    </svg>
                  ) : null}
                  {segmentIndex < line.length - 1 ? ' ' : null}
                </span>
              )
            })}
          </span>
        ))}
      </motion.span>
    </Tag>
  )
}

export default SplitHeading
