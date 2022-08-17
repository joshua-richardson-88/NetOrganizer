import transpile from 'next-transpile-modules'

const withTM = transpile(['@passageidentity/passage-node'])
/**
 * Don't be scared of the generics here.
 * All they do is to give us autocompletion when using this.
 *
 * @template {import('next').NextConfig} T
 * @param {T} config - A generic parameter that flows through to the return type
 * @constraint {{import('next').NextConfig}}
 */
function defineNextConfig(config) {
  return withTM(config)
}

export default defineNextConfig({
  reactStrictMode: true,
  swcMinify: true,
})
