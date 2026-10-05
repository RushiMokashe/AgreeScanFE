interface RichTextProps {
  /** Text where **double-asterisk** segments are emphasised (API fields documented as "rich"). */
  text: string
  strongClassName?: string
}

export function RichText({ text, strongClassName = 'font-bold text-on-surface' }: RichTextProps) {
  // split() with a capture group alternates plain text (even indexes) and emphasised text (odd indexes)
  const parts = text.split(/\*\*(.+?)\*\*/g)
  return (
    <>
      {parts.map((part, i) =>
        i % 2 === 1 ? (
          <strong key={i} className={strongClassName}>
            {part}
          </strong>
        ) : (
          part
        ),
      )}
    </>
  )
}
