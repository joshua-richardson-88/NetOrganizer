import { useState } from 'react'

interface EditableProps {
  id: string
  isEditing: boolean
  text: string
  titleClass: string
  update: (id: string, s: string) => void
}
const EditableText: React.FC<EditableProps> = ({
  id,
  isEditing,
  text,
  titleClass,
  update,
}) => {
  const [value, setValue] = useState(text)

  const handleBlur = (e: React.FocusEvent<HTMLInputElement, Element>) =>
    update(id, value)
  const handleEnter = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') update(id, value)
  }
  const Input = (
    <input
      className='outline-none border-b-2 border-b-white bg-black/10 p-2 w-full'
      autoFocus={true}
      autoComplete='off'
      onChange={(e) => setValue(e.currentTarget.value)}
      onKeyDown={handleEnter}
      onBlur={handleBlur}
      value={value}
    />
  )
  const Title = <h2 className={titleClass}>{text}</h2>

  return <>{isEditing ? Input : Title}</>
}
export default EditableText
