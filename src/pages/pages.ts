import { RouteComponentProps } from 'react-router-dom'
// import Home from './Home'
import Zone from './Zone'
import Compare from './Compare'
import ZoneV2 from './ZoneV2'

type Component = React.ComponentType<RouteComponentProps<any>> | React.ComponentType<any> //eslint-disable-line

export interface Page {
  path: string
  view: Component
  displayName: string
}

export const pages: Page[] = [
  {
    path: '/zones/:code*',
    view: Zone,
    displayName: 'Zone',
  },
  {
    path: '/compare/:codes*',
    view: Compare,
    displayName: 'Compare',
  },
  {
    path: '/v2/zones/:codes*',
    view: ZoneV2,
    displayName: 'Zone',
  },
  {
    path: '/v2/compare/:codes*',
    view: ZoneV2,
    displayName: 'Compare',
  },
]
