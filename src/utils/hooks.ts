import { useEffect, useState } from 'react'

export const useToggle = (initial: boolean) => {
  const [toggled, setToggled] = useState(initial)

  const toggle = (forced?: boolean) =>
    setToggled((prev) => {
      return forced != null ? forced : !prev
    })

  return [toggled, toggle] as const
}
