import { useEffect, useRef, useState } from 'react'
import { trpc } from '../utils/trpc'

interface Props {
  groupID: string
  isVisible: boolean
  onSuccess: any
  toggleVisible: (b: boolean) => void
}
const NewLinkForm: React.FC<Props> = ({
  groupID,
  isVisible,
  onSuccess,
  toggleVisible,
}) => {
  const [url, setUrl] = useState('')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const effectRef = useRef(0)

  const { mutate, isSuccess, error } = trpc.useMutation('links.addNew')

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (url.length > 1 && title.length > 1) {
      mutate({ url, title, description, gID: groupID })
      setUrl('')
      setTitle('')
      setDescription('')
    }
  }

  useEffect(() => {
    if (isSuccess && onSuccess != null && effectRef.current === 0) {
      effectRef.current = 1
      onSuccess()
    }
  }, [effectRef, isSuccess, onSuccess])
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
              className='outline-none bg-inherit rounded-t-md border-b-2 pt-2 pl-2 border-b-white hover:bg-white/20 active:bg-white/20 active:border-b-blue-600 focus:bg-white/20 focus:border-b-blue-600'
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
              onChange={(e) => setDescription(e.currentTarget.value)}
              value={description}
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
export default NewLinkForm
