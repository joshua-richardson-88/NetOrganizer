import type { GetStaticProps, InferGetStaticPropsType, NextPage } from 'next'
import Head from 'next/head'
import { useEffect } from 'react'
import { env } from '../env/server.mjs'

type Props = InferGetStaticPropsType<typeof getStaticProps>
const Home: NextPage = ({ appId }: Props) => {
  useEffect(() => {
    require('@passageidentity/passage-elements/passage-auth')
  }, [])
  return (
    <>
      <Head>
        <title>Create T3 App</title>
        <meta name='description' content='Generated by create-t3-app' />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <div className='max-w-[2000px] w-screen h-screen mx-auto text-neutral-900 bg-wwhite dark:text-neutral-200 dark:bg-neutral-800'>
        <div className='flex w-full items-center justify-between text-white px-5 py-8 bg-neutral-500 dark:bg-neutral-700'>
          <h1 className='text-xl'>Netorganizer</h1>
          <button className='px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out'>
            Login
          </button>
        </div>
        {appId.length != null && <passage-auth app-id={appId} />}
      </div>
    </>
  )
}

export default Home

export const getStaticProps: GetStaticProps = async (context) => ({
  props: {
    appId: env.PASSAGE_APP_ID,
  },
})