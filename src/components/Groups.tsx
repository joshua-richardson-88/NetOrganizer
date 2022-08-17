import { useEffect } from 'react'
import { trpc } from '../utils/trpc'
import Router from 'next/router'
import GroupCard from './GroupCard'
import { PlusIcon } from './icons'

interface ContentProps {
  activeId: string
  makeActive: (id: string) => void
}
const Content: React.FC<ContentProps> = ({ activeId, makeActive }) => {
  const {
    mutate: createGroup,
    isSuccess: createSuccess,
    error: createError,
  } = trpc.useMutation(['groups.addNew'])
  const { data: collection, error: getOneError } = trpc.useQuery([
    'collections.getOne',
    { id: activeId },
  ])
  const { data: groups, refetch: getAllAgain } = trpc.useQuery([
    'groups.getAll',
    { cID: activeId },
  ])

  useEffect(() => {
    if (createError && createError.data?.code === 'FORBIDDEN') Router.push('/')
  }, [createError])

  useEffect(() => {
    if (createSuccess) getAllAgain()
  }, [createSuccess, getAllAgain])

  const onAddGroup = () => createGroup({ title: 'New Group', cID: activeId })

  return (
    <main className='bg-neutral-900 flex-1 h-screen flex flex-col'>
      <div className='w-full h-14 bg-neutral-800 flex items-center justify-center'>
        {collection?.title && <h1 className='text-2xl'>{collection.title}</h1>}
        {collection?.title && (
          <button
            type='button'
            onClick={onAddGroup}
            className='ml-4 mt-1 bg-black p-2 rounded-lg hover:bg-neutral-900'
          >
            <PlusIcon size={4} />
          </button>
        )}
      </div>
      <div className='overflow-y-auto flex-1 scrollbar scrollbar-light flex flex-row flex-wrap p-4 gap-4'>
        {groups &&
          groups.map((group) => (
            <GroupCard key={group.id} {...group} refetch={getAllAgain} />
          ))}
      </div>
    </main>
  )
}
export default Content
