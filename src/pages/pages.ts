import { RouteComponentProps } from 'react-router-dom'
import Home from './Home'
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
    path: '/zone/:zone',
    view: Zone,
    displayName: 'Zone',
  },
]
