import { useEffect, useRef, useState } from 'react'
import { trpc } from '../utils/trpc'

interface Props {
  isVisible: boolean
  onSuccess: any
  toggleVisible: (b: boolean) => void
  data?: {
    id: string
    title: string
    url: string
    notes: string
  }
}
const UpdateLinkForm: React.FC<Props> = ({
  data,
  isVisible,
  onSuccess,
  toggleVisible,
}) => {
  const [url, setUrl] = useState(data == null ? '' : data.url)
  const [title, setTitle] = useState(data == null ? '' : data.title)
  const [notes, setNotes] = useState(data == null ? '' : data.notes)
  const effectRef = useRef(0)

  const { mutate, isSuccess, error } = trpc.useMutation('links.update')

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (url.length > 1 && title.length > 1) {
      if (data == null) return

      mutate({ id: data.id, title, notes })
      setUrl('')
      setTitle('')
      setNotes('')
    }
  }

  useEffect(() => {
    if (isSuccess && onSuccess == null && effectRef.current === 0) {
      effectRef.current = 1
      onSuccess()
    }
  }, [isSuccess, onSuccess, effectRef])

  useEffect(() => {
    if (data == null) return
    setUrl(data.url)
    setTitle(data.title)
    setNotes(data.notes)
  }, [data])

  if (!data) return null
  return (
    <div
      className={`absolute inset-0 z-10 bg-black transition transform duration-500 ease-in-out ${
        isVisible ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      <form className='w-full h-full p-4 flex flex-col' onSubmit={handleSubmit}>
        <div className='flex-1 flex flex-col gap-4'>
          <label className='flex-col flex'>
            Url
            <input
              type='text'
              disabled={true}
              className='outline-none bg-inherit text-neutral-400 cursor-not-allowed pt-2 pl-2'
              autoFocus={true}
              autoComplete='off'
              onChange={(e) => setUrl(e.currentTarget.value)}
              value={url}
            />
          </label>
          <label className='flex-col flex'>
            Title
            <input
              type='text'
              className='outline-none bg-inherit rounded-t-md border-b-2 pt-2 pl-2 border-b-white hover:bg-white/20 active:bg-white/20 active:border-b-blue-600 focus:bg-white/20 focus:border-b-blue-600'
              autoFocus={true}
              autoComplete='off'
              onChange={(e) => setTitle(e.currentTarget.value)}
              value={title}
            />
          </label>
          <label className='flex-col flex'>
            Description
            <input
              type='text'
              className='outline-none bg-inherit rounded-t-md border-b-2 pt-2 pl-2 border-b-white hover:bg-white/20 active:bg-white/20 active:border-b-blue-600 focus:bg-white/20 focus:border-b-blue-600'
              autoFocus={true}
              autoComplete='off'
              onChange={(e) => setNotes(e.currentTarget.value)}
              value={notes}
            />
          </label>
        </div>
        <div className='flex flex-row gap-4'>
          <button
            type='submit'
            className='flex-1 px-6 py-2 border-2 border-white font-medium text-xs leading-tight uppercase rounded hover:bg-white/20 focus:outline-none focus:ring-0 transition duration-150 ease-in-out'
          >
            Save
          </button>
          <button
            type='button'
            onClick={() => toggleVisible(false)}
            className='w-20 py-2  font-medium text-xs leading-tight uppercase rounded hover:bg-white/20 focus:outline-none focus:ring-0 transition duration-150 ease-in-out'
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}
export default UpdateLinkForm
