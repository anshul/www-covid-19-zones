import { graphql } from 'babel-plugin-relay/macro'
import React from 'react'
import { createStyles, makeStyles } from '@material-ui/core'
import { Typography } from '@material-ui/core'
import { createFragmentContainer } from 'react-relay'
import { ZoneCard_zone } from '../../__generated__/ZoneCard_zone.graphql'
import { Row } from 'react-flexbox-grid'
import NumberPill from './NumberPill'
interface Props {
  lineColor: string
  zone: ZoneCard_zone
  ipmColor: (count: number) => string
  iColor: (count: number) => string
}

const useStyles = makeStyles(() =>
  createStyles({
    title: {
      fontSize: '22px',
      fontWeight: 800,
    },
    subtitle: {
      fontSize: '11px',
      fontWeight: 600,
    },
    term: {
      width: '60px',
      fontWeight: 400,
      fontSize: '0.7em',
    },
  })
)

const ZoneCard: React.FC<Props> = ({ zone, lineColor, ipmColor, iColor }) => {
  const classes = useStyles()
  return (
    <div key={zone.code}>
      <Typography className={classes.title} variant='h1' style={{ color: lineColor }}>
        {zone.name}
      </Typography>
      <Typography className={classes.subtitle}>
        Population {zone.fEstPopulation} ({zone.fEstPopulationYear})
      </Typography>
      <Row bottom='xs'>
        <span className={classes.term}>Infections</span>
        <NumberPill count={zone.cumulativeInfections} color={iColor} />
      </Row>
      <Row bottom='xs'>
        <span className={classes.term}>per million</span>
        <NumberPill count={zone.perMillionInfections} color={ipmColor} />
      </Row>
    </div>
  )
}

export default createFragmentContainer(ZoneCard, {
  zone: graphql`
    fragment ZoneCard_zone on V2Zone {
      code
      name
      fEstPopulation
      fEstPopulationYear
      perMillionInfections
      cumulativeInfections
    }
  `,
})
