import { useAuth } from '../../auth/auth-context'
import { useFarmer } from '../../context/farmer-context'
import { apiUrl } from '../../platform/api-base'
import { Icon } from '../Icon'

const SIZES = {
  md: 'h-8 w-8 font-label-md text-label-md',
  lg: 'h-14 w-14 font-title-md text-title-md',
}

const graphemes = new Intl.Segmenter(undefined, { granularity: 'grapheme' })

/** The first letter of a word as written, e.g. "सु" (not just "स") of "सुनीता". */
function firstLetter(word: string): string {
  const [first] = graphemes.segment(word)
  return first?.segment ?? ''
}

/** "Rameshwar Patil" -> "RP", "Rishikesh" -> "R". */
function initials(name: string): string {
  const words = name.trim().split(/\s+/).filter(Boolean)
  const picked = words.length > 1 ? [words[0], words[words.length - 1]] : words
  return picked.map(firstLetter).join('').toUpperCase()
}

/** The signed-in user as a round avatar: a farmer's photo, else initials. Decorative: its button names it. */
export function ProfileAvatar({ size = 'md' }: { size?: keyof typeof SIZES }) {
  const farmer = useFarmer()
  const { user } = useAuth()
  const box = `${SIZES[size]} flex-shrink-0 rounded-full`

  if (farmer?.avatarUrl) {
    return <img alt="" src={apiUrl(farmer.avatarUrl)} className={`${box} object-cover ring-2 ring-primary/20`} />
  }
  const letters = initials(user?.name ?? '')
  return (
    <span aria-hidden="true" className={`${box} flex items-center justify-center bg-primary-container font-bold text-on-primary`}>
      {letters || <Icon name="person" className="text-[20px]" />}
    </span>
  )
}
