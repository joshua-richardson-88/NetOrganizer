import { useEffect } from 'react'
import { trpc } from '../utils/trpc'
import { DeleteIcon, EditIcon } from './icons'

export type Link = {
  id: string
  title: string
  url: string
  notes: string
}
interface Props {
  data: Link[]
  onSuccess: any
  editLink: (id: string) => void
}
const LinkList: React.FC<Props> = ({ data, editLink, onSuccess }) => {
  const { mutate, isSuccess } = trpc.useMutation('links.delete')

  useEffect(() => {
    if (isSuccess && onSuccess != null) onSuccess()
  }, [isSuccess, onSuccess])

  return (
    <div className='flex-1 overflow-auto scrollbar flex flex-col gap-1'>
      {data.map((link) => (
        <div
          key={link.id}
          className='group relative hover:bg-black/20 rounded px-2 py-1'
        >
          <div className='flex flex-row h-8 items-center'>
            <span
              className='flex-1 cursor-pointer'
              onClick={() => window.open(link.url, '_blank')}
            >
              {link.title}
            </span>
            <div className='w-8'></div>
            <div className='flex-row gap-2 hidden group-hover:flex'>
              <button
                type='button'
                className='cursor-pointer hover:bg-white/10 p-2 rounded'
              >
                <EditIcon size={3} clickHandler={() => editLink(link.id)} />
              </button>
              <button
                type='button'
                className='cursor-pointer hover:bg-white/10 p-2 rounded'
              >
                <DeleteIcon
                  size={3}
                  clickHandler={() => mutate({ id: link.id })}
                />
              </button>
            </div>
          </div>
          {link.notes.length > 0 && (
            <span className='absolute hidden group-hover:flex left-10 px-2 py-1 translate-y-1 bg-black text-white rounded-md z-10'>
              {link.notes}
            </span>
          )}
        </div>
      ))}
    </div>
  )
}
export default LinkList
