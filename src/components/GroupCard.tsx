import Router from 'next/router'
import { useEffect, useState } from 'react'
import { useToggle } from '../utils/hooks'
import { trpc } from '../utils/trpc'
import EditableText from './EditableText'
import { CheckmarkIcon, DeleteIcon, EditIcon, ShareIcon } from './icons'
import LinkList from './LinkList'
import NewLinkForm from './NewLinkForm'
import UpdateLinkForm from './UpdateLinkForm'

interface CardProps {
  id: string
  title: string
  refetch: any
}

const GroupCard: React.FC<CardProps> = ({ id, title, refetch }) => {
  const [editMode, toggleEditMode] = useToggle(false)
  const [editTitle, toggleEditTitle] = useToggle(false)
  const [showNewForm, setShowNewForm] = useToggle(false)
  const [showEditForm, setShowEditForm] = useToggle(false)
  const [editID, setEditID] = useState('')

  const {
    mutate: update,
    isSuccess: updateSuccess,
    error: updateError,
  } = trpc.useMutation('groups.update')
  const {
    mutate: deleteGroup,
    isSuccess: deleteSuccess,
    error: deleteError,
  } = trpc.useMutation('groups.delete')
  const { data: links, refetch: getAllAgain } = trpc.useQuery([
    'links.getAll',
    { gID: id },
  ])

  useEffect(() => {
    if (updateSuccess || deleteSuccess) refetch()
  }, [updateSuccess, deleteSuccess])

  useEffect(() => {
    if (updateError?.data?.code === 'FORBIDDEN') Router.push('/')
    if (deleteError?.data?.code === 'FORBIDDEN') Router.push('/')
  }, [deleteError, updateError])

  const updateGroup = (id: string, title: string) => {
    update({ id, title })
    toggleEditTitle(false)
  }
  const onDeleteGroup = () => deleteGroup({ id })
  const openAllLinks = () => {
    if (links == null) return
    links.forEach((link) => window.open(link.url, '_blank'))
  }
  const linkSuccess = () => {
    getAllAgain()
    setShowNewForm(false)
    setShowEditForm(false)
  }
  const editLink = (id: string) => {
    setEditID(id)
    setShowEditForm(true)
  }
  return (
    <div className='relative bg-slate-700 min-h-[18rem] max-h-[50%] w-72 rounded-lg overflow-hidden flex flex-col'>
      <div className='flex sticky top-0 flex-row items-center p-2 bg-slate-800 shadow-sm'>
        <button
          type='button'
          className='cursor-pointer hover:bg-white/10 p-2 rounded'
        >
          {editMode ? (
            <CheckmarkIcon clickHandler={() => toggleEditMode(false)} />
          ) : (
            <EditIcon clickHandler={() => toggleEditMode(true)} />
          )}
        </button>
        <div
          onClick={() => toggleEditTitle(true)}
          className='text-md text-neutral-100 flex-1 text-center'
        >
          <EditableText
            id={id}
            isEditing={editMode && editTitle}
            text={title}
            titleClass=''
            update={updateGroup}
          />
        </div>
        <button className='cursor-pointer hover:bg-white/10 p-2 rounded'>
          {editMode ? (
            <DeleteIcon clickHandler={onDeleteGroup} />
          ) : (
            <ShareIcon clickHandler={openAllLinks} />
          )}
        </button>
      </div>
      <div className='p-4 h-[25rem] grid grid-rows-card relative gap-4'>
        {links == null ? (
          <div className='flex-1'></div>
        ) : (
          <LinkList data={links} onSuccess={getAllAgain} editLink={editLink} />
        )}
        <button
          type='button'
          onClick={() => setShowNewForm(true)}
          className='w-full h-fit px-6 py-2 border-2 border-blue-600 font-medium text-xs leading-tight uppercase rounded hover:bg-black/30 focus:outline-none focus:ring-0 transition duration-150 ease-in-out'
        >
          Add Link
        </button>
        <NewLinkForm
          groupID={id}
          isVisible={showNewForm}
          onSuccess={linkSuccess}
          toggleVisible={setShowNewForm}
        />
        <UpdateLinkForm
          data={links?.filter((link) => link.id === editID)[0]}
          isVisible={showEditForm}
          onSuccess={linkSuccess}
          toggleVisible={setShowEditForm}
        />
      </div>
    </div>
  )
}
export default GroupCard
