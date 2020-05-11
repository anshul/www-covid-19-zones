import React, { useMemo } from 'react'
import { graphql } from 'babel-plugin-relay/macro'
import { makeStyles, createStyles } from '@material-ui/styles'
import { createFragmentContainer } from 'react-relay'
import { V2HomeRoot_data } from '../../__generated__/V2HomeRoot_data.graphql'
import { Grid, Row, Col } from 'react-flexbox-grid'
import { Breadcrumbs, Button } from '@material-ui/core'
import Searchbar from '../../components/Searchbar'
import ErrorPanel from './ErrorPanel'
import { IoIosAdd } from 'react-icons/io'
import { Link } from 'react-router-dom'
import { slateGrey } from '../../utils/ColorFactory'
import { DateRangeT, ModeT, UrlT } from '../../types'

interface Props {
  data: V2HomeRoot_data | null
  go: (target: UrlT) => void
  mode: ModeT
  dateRange: DateRangeT
  logScale: boolean
}

const useStyles = makeStyles(() =>
  createStyles({
    newCasesContainer: {
      display: 'flex',
      justifyContent: 'center',
    },
    parentZoneLinkText: {
      color: slateGrey[500],
      textDecoration: 'none',
      fontWeight: 500,
    },
    zoneLinkText: {
      color: slateGrey[700],
      textDecoration: 'none',
      fontWeight: 700,
    },
  })
)

const V2HomeRoot: React.FC<Props> = ({ data, mode, go, dateRange, logScale }) => {
  const classes = useStyles()
  const onSearch = (code: string) => {
    go({ codes: mode === 'compare' ? [code] : [code] })
  }
  if (!data) return <ErrorPanel onSearch={onSearch} />

  return (
    <Grid>
      <Row>
        <Col xs={12}>
          <Searchbar onSearch={onSearch} />
        </Col>
      </Row>
      <Row style={{ minHeight: '40px' }}>
        <Col>
          <Breadcrumbs style={{ marginLeft: '10px' }}>
            {true && (
              <Link className={classes.parentZoneLinkText} color='inherit' to={`/zones/parent`}>
                PARENT
              </Link>
            )}
            <p className={classes.zoneLinkText}>NAME</p>
          </Breadcrumbs>
        </Col>
        <Col xs>
          <Button
            style={{ marginLeft: '25px' }}
            size='small'
            disableElevation
            variant='contained'
            color='secondary'
            startIcon={<IoIosAdd />}
            onClick={() => {}}
          >
            Compare
          </Button>
        </Col>
      </Row>
      <Row style={{ minHeight: '40px' }}>
        <Col xs={12}>
          <pre>{JSON.stringify({ mode, data })}</pre>
        </Col>
      </Row>
    </Grid>
  )
}

export default createFragmentContainer(V2HomeRoot, {
  data: graphql`
    fragment V2HomeRoot_data on V2Stats {
      zones {
        code
        name
      }
    }
  `,
})
