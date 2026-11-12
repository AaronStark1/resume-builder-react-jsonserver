import { useEffect, useRef, useState } from 'react'
import { motion, useMotionValue, useSpring, useTransform, useVelocity } from 'motion/react'

import MiniResume from './MiniResume'
import { AchievementBlock, IdentityBlock, ScoreBlock, SkillsBlock, TimelineBlock } from './ResumeBlocks'
import { STATIC_BLOCK } from './blockMotion'

/** The story the card tells as the pointer travels: a resume, its parts, then the finished page. */
const FACES = [
  { id: 'resume', label: 'Your resume', tone: 'lavender', render: () => <MiniResume template="classic" /> },
  { id: 'identity', label: 'Identity', tone: 'cream', render: () => <IdentityBlock {...STATIC_BLOCK} /> },
  { id: 'experience', label: 'Experience', tone: 'peach', render: () => <TimelineBlock {...STATIC_BLOCK} /> },
  { id: 'skills', label: 'Skills', tone: 'sage', render: () => <SkillsBlock {...STATIC_BLOCK} /> },
  { id: 'achievements', label: 'Achievements', tone: 'butter', render: () => <AchievementBlock {...STATIC_BLOCK} /> },
  { id: 'score', label: 'Resume score', tone: 'night', render: () => <ScoreBlock count={false} {...STATIC_BLOCK} /> },
  { id: 'finished', label: 'Ready to export', tone: 'pink', render: () => <MiniResume template="modern" /> },
]

const TRAVEL_PER_FACE = 360 // px of pointer travel before the next face
const OFFSET_X = 30 // the card trails to the right of the pointer…
const LIFT = 0.78 // …and sits mostly above it, clear of the copy block below
const EDGE = 16
const FOLLOW = { stiffness: 150, damping: 20, mass: 0.7 }
const SETTLE = { stiffness: 220, damping: 24 }

/**
 * Floating resume-insight card that trails the pointer across the hero (fine pointers only; the
 * parent decides when to mount it). Pointer events only write to motion values — the single piece
 * of React state is the face index, which changes once per ~360px of travel.
 */
const ResumeCursorCard = ({ heroRef }) => {
  const cardRef = useRef(null)
  const [face, setFace] = useState(0)

  const targetX = useMotionValue(0)
  const targetY = useMotionValue(0)
  const x = useSpring(targetX, FOLLOW)
  const y = useSpring(targetY, FOLLOW)
  const velocityX = useVelocity(x)
  const velocityY = useVelocity(y)
  const rotate = useSpring(useTransform(velocityX, [-1600, 0, 1600], [-13, 0, 13], { clamp: true }), SETTLE)
  // The contents lag a few pixels behind the frame, against the direction of travel.
  const driftX = useSpring(useTransform(velocityX, [-1600, 1600], [9, -9], { clamp: true }), SETTLE)
  const driftY = useSpring(useTransform(velocityY, [-1600, 1600], [9, -9], { clamp: true }), SETTLE)
  const presence = useMotionValue(0)
  const opacity = useSpring(presence, { stiffness: 240, damping: 30 })
  const scale = useTransform(opacity, [0, 1], [0.7, 1])

  useEffect(() => {
    const hero = heroRef.current
    const card = cardRef.current
    if (!hero || !card) return undefined

    let bounds = { left: 0, top: 0, width: 0, height: 0, cardWidth: 0, cardHeight: 0 }
    let last = null
    let travelled = 0

    const measure = () => {
      const rect = hero.getBoundingClientRect()
      bounds = {
        left: rect.left + window.scrollX,
        top: rect.top + window.scrollY,
        width: rect.width,
        height: rect.height,
        cardWidth: card.offsetWidth,
        cardHeight: card.offsetHeight,
      }
    }

    const onMove = (event) => {
      if (event.pointerType === 'touch') return
      if (!last) measure() // once per entry, never per move
      const px = event.pageX - bounds.left
      const py = event.pageY - bounds.top
      const nextX = Math.max(EDGE, Math.min(px + OFFSET_X, bounds.width - bounds.cardWidth - EDGE))
      const nextY = Math.max(EDGE, Math.min(py - bounds.cardHeight * LIFT, bounds.height - bounds.cardHeight - EDGE))

      if (last) {
        travelled += Math.hypot(px - last.x, py - last.y)
        if (travelled > TRAVEL_PER_FACE) {
          travelled = 0
          setFace((current) => (current + 1) % FACES.length)
        }
        targetX.set(nextX)
        targetY.set(nextY)
      } else {
        // First movement (or re-entry): start from the pointer instead of flying in from afar.
        targetX.jump(nextX)
        targetY.jump(nextY)
        x.jump(nextX)
        y.jump(nextY)
      }
      last = { x: px, y: py }

      // Step aside over text and controls so the headline and CTAs are never covered.
      const blocked = event.target instanceof Element && event.target.closest('a, button, [data-cursor-hide]')
      presence.set(blocked ? 0 : 1)
    }

    const onLeave = () => {
      presence.set(0)
      last = null
      travelled = 0
    }

    measure()
    hero.addEventListener('pointermove', onMove, { passive: true })
    hero.addEventListener('pointerleave', onLeave, { passive: true })
    window.addEventListener('resize', measure, { passive: true })

    return () => {
      hero.removeEventListener('pointermove', onMove)
      hero.removeEventListener('pointerleave', onLeave)
      window.removeEventListener('resize', measure)
    }
  }, [heroRef, targetX, targetY, x, y, presence])

  return (
    <motion.div ref={cardRef} className="lp-cursor" aria-hidden="true" style={{ x, y, rotate, opacity, scale }}>
      <motion.div className="lp-cursor__inner" style={{ x: driftX, y: driftY }}>
        {FACES.map((item, index) => (
          <div
            key={item.id}
            className="lp-cursor__face"
            data-tone={item.tone}
            data-active={index === face ? '' : undefined}
          >
            <div className="lp-cursor__head">
              <span>{String(index + 1).padStart(2, '0')}</span>
              {item.label}
            </div>
            <div className="lp-cursor__body">{item.render()}</div>
          </div>
        ))}
      </motion.div>
    </motion.div>
  )
}

export default ResumeCursorCard
