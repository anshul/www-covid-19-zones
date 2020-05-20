import { graphql } from 'babel-plugin-relay/macro'
import React from 'react'
import { createStyles, makeStyles } from '@material-ui/styles'
import { Typography } from '@material-ui/core'
import { createFragmentContainer } from 'react-relay'
import { ZoneCard_zone } from '../../__generated__/ZoneCard_zone.graphql'
import { Row } from 'react-flexbox-grid'
import { pickTextColor } from '../../utils/ColorFactory'
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
    number: {
      fontSize: '11px',
      minWidth: '35px',
      padding: '0 0 0 8px',
    },
    term: {
      width: '60px',
      fontWeight: 400,
      fontSize: '0.7em',
    },
    numberPill: {
      textAlign: 'center',
      fontSize: '11px',
      padding: '.15em .25em',
      borderRadius: '.35em',
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
        Population {zone.fPopulation} ({zone.fPopulationYear})
      </Typography>
      <Row bottom='xs'>
        <span className={classes.term}>Infections</span>
        <span className={classes.number}>
          <Typography
            style={{
              backgroundColor: iColor(zone.cumulativeInfections),
              color: pickTextColor(iColor(zone.cumulativeInfections)),
              border: `1px solid ${iColor(zone.cumulativeInfections)}`,
            }}
            className={classes.numberPill}
          >
            {zone.cumulativeInfections}
          </Typography>
        </span>
      </Row>
      <Row bottom='xs'>
        <span className={classes.term}>per million</span>
        <span className={classes.number}>
          <Typography
            style={{
              backgroundColor: ipmColor(zone.perMillionInfections),
              color: pickTextColor(ipmColor(zone.perMillionInfections)),
              border: `1px solid ${ipmColor(zone.perMillionInfections)}`,
            }}
            className={classes.numberPill}
          >
            {zone.perMillionInfections}
          </Typography>
        </span>
      </Row>
    </div>
  )
}

export default createFragmentContainer(ZoneCard, {
  zone: graphql`
    fragment ZoneCard_zone on V2Zone {
      code
      name
      fPopulation
      fPopulationYear
      perMillionInfections
      cumulativeInfections
    }
  `,
})
