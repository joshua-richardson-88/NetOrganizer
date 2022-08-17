// modules
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import Link from 'next/link'
import React, { useState } from 'react'
import Passage from '@passageidentity/passage-node'

// project files
import { Collections, Content } from '../components'

const Unauthorized = () => (
  <div className='w-screen h-screen p-4 flex flex-col items-center text-white'>
    <h1 className='text-3xl mb-8 font-bold'>Unauthorized</h1>
    <p>You are not logged in, either refresh after a few moments or</p>
    <div className='flex flex-row'>
      <div className='text-white underline decoration-white hover:text-blue-100'>
        <Link href='/'>Login</Link>
      </div>
      <div>&nbsp;to continue</div>
    </div>
  </div>
)

const Dashboard = () => {
  const [active, setActive] = useState<string | null>(null)

  return (
    <div className='overflow-hidden text-white flex flex-row select-none'>
      <Collections activeId={active} makeActive={setActive} />
      {active != null && <Content activeId={active} makeActive={setActive} />}
    </div>
  )
}

const Protected = ({
  isAuthorized,
  username,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  return (
    <div className='w-screen h-screen bg-neutral-800 overflow-hidden'>
      <div className='styles.message'>
        {isAuthorized ? <Dashboard /> : <Unauthorized />}
      </div>
    </div>
  )
}
export default Protected

export const getServerSideProps: GetServerSideProps = async (context) => {
  const passage = new Passage({
    appID: process.env.PASSAGE_APP_ID as string,
    apiKey: process.env.PASSAGE_API_KEY as string,
    authStrategy: 'HEADER',
  })

  try {
    const authToken = context.req.cookies['psg_auth_token']
    const userId = await passage.authenticateRequest({
      headers: { authorization: `Bearer ${authToken}` },
    })

    return {
      props: { isAuthorized: typeof userId === 'string' ? true : false },
    }
  } catch (error) {
    // authentication failed
    if (error instanceof Error) console.log(`[ERROR]: ${error.message}`)
    return { props: { isAuthenticated: false } }
    // return {
    //   redirect: { destination: '/', permanent: false },
    // }
  }
}
