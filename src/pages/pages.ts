import Home from './Home'
import { RouteComponentProps } from 'react-router-dom'
import Zone from './Zone'

export interface Page {
  path: string
  view: React.ComponentType<RouteComponentProps<any>>
  displayName: string
}

export const pages: Page[] = [
  {
    path: '/',
    view: Home,
    displayName: 'Home',
  },
  {
    path: '/zone/:slug',
    view: Zone,
    displayName: 'Zone',
  },
]
