import { RouteComponentProps } from 'react-router-dom'
import Home from './Home'
import Zone from './Zone'
import Compare from './Compare'

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
    path: '/zone/:code*',
    view: Zone,
    displayName: 'Zone',
  },
  {
    path: '/compare/:codes*',
    view: Compare,
    displayName: 'Compare',
  },
]
