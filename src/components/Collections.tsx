import Router from 'next/router'
import { useEffect, useState } from 'react'
import { trpc } from '../utils/trpc'
import EditableText from './EditableText'
import { DeleteIcon } from './icons'

interface CollectionProps {
  activeId: string | null
  makeActive: (id: string) => void
}

const Collections: React.FC<CollectionProps> = ({ activeId, makeActive }) => {
  const [editMode, setEditMode] = useState(false)
  const [editId, setEditId] = useState<string | null>()

  const {
    mutate: createCollection,
    isSuccess: createSuccess,
    error: createError,
  } = trpc.useMutation(['collections.addNew'])
  const {
    mutate: updateCollection,
    isSuccess: updateSuccess,
    error: updateError,
  } = trpc.useMutation(['collections.update'])
  const {
    mutate: deleteCollection,
    isSuccess: deleteSuccess,
    error: deleteError,
  } = trpc.useMutation('collections.delete')
  const {
    data: collections,
    error: getAllError,
    refetch: getAllAgain,
  } = trpc.useQuery(['collections.getTitles'])

  useEffect(() => {
    if (createError?.data?.code === 'FORBIDDEN') Router.push('/')
    if (updateError?.data?.code === 'FORBIDDEN') Router.push('/')
    if (deleteError?.data?.code === 'FORBIDDEN') Router.push('/')
    if (getAllError?.data?.code === 'FORBIDDEN') Router.push('/')
  }, [createError, getAllError, updateError, deleteError])

  useEffect(() => {
    if (createSuccess || updateSuccess || deleteSuccess) getAllAgain()
  }, [createSuccess, updateSuccess, deleteSuccess, getAllAgain])

  const updateTitle = (id: string, title: string) => {
    if (editId == null) return

    updateCollection({ id, title })
    setEditId(null)
  }
  const addCollection = async () => {
    createCollection({ title: 'New Collection' })
  }

  return (
    <aside className='h-screen w-fit max-w-xs bg-neutral-700 p-4 flex flex-col shadow-[0px 1px 1px 0px hsla(0,0%,0%,0.14),0px 2px 1px -1px hsla(0,0%,0%,0.12),0px 1px 3px 0px hsla(0,0%,0%,0.2)]'>
      <h1 className='text-2xl mb-4'>NetOrganizer</h1>
      <div className='flex-1 flex flex-col gap-4'>
        <div className='flex-1 pl-4 flex flex-col gap-4'>
          {collections != null &&
            collections.map((item) => (
              <div
                key={item.id}
                onClick={() => {
                  if (!editMode) makeActive(item.id)
                  else {
                    setEditId(item.id)
                  }
                }}
                className={`flex flex-row justify-between items-center gap-4 ${
                  activeId === item.id
                    ? 'bg-white/10 rounded-l-md pr-4 -mr-4'
                    : ''
                }`}
              >
                <EditableText
                  id={item.id}
                  isEditing={editId === item.id}
                  text={item.title}
                  titleClass='text-lg rounded p-2 flex-1 cursor-pointer truncate hover:bg-white/10 -mr-4'
                  update={updateTitle}
                />
                {editMode && (
                  <>
                    <button
                      onClick={() => deleteCollection({ id: item.id })}
                      className='cursor-pointer hover:bg-white/10 p-2 rounded'
                    >
                      <DeleteIcon />
                    </button>
                  </>
                )}
              </div>
            ))}
        </div>
        <div className='flex justify-between gap-4'>
          <button
            onClick={addCollection}
            className='flex-1 px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out'
          >
            Create Collection
          </button>
          <button
            onClick={() => setEditMode((prev) => !prev)}
            className=' w-20 px-6 py-2 border-2 border-blue-600 font-medium text-xs leading-tight uppercase rounded hover:bg-black/30 focus:outline-none focus:ring-0 transition duration-150 ease-in-out'
          >
            {editMode ? 'Done' : 'Edit'}
          </button>
        </div>
      </div>
    </aside>
  )
}
export default Collections
