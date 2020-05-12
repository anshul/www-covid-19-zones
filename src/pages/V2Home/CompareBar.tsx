import React from 'react'
import { makeStyles, createStyles } from '@material-ui/styles'
import { Row, Col } from 'react-flexbox-grid'
import { IoIosClose } from 'react-icons/io'
import { slateGrey } from '../../utils/ColorFactory'
import { UrlT } from '../../types'
import Searchbar from '../../components/Searchbar'

interface CompareBarZone {
  name: string
  code: string
}

interface Props {
  zones: readonly CompareBarZone[]
  go: (target: UrlT) => void
}

const useStyles = makeStyles(() =>
  createStyles({
    compareButton: {
      display: 'flex',
      alignItems: 'center',
      backgroundColor: slateGrey[100],
      borderRadius: '24px',
      padding: '4px 12px',
      marginRight: '4px',
    },
    compareCross: { cursor: 'pointer', marginLeft: '8px', backgroundColor: slateGrey[200], borderRadius: '50%' },
  })
)

const CompareBar: React.FC<Props> = ({ zones, go }) => {
  const classes = useStyles()
  const onSearch = (code: string) => go({ codes: [code, ...zones.map((z) => z.code)] })
  const onClose = (zone: CompareBarZone) => {
    if (zones.length <= 1) return go({ mode: 'zones' })
    go({ codes: zones.map((z) => z.code).filter((c) => c !== zone.code) })
  }

  return (
    <>
      <Row>
        <Col xs={12}>
          <Searchbar onSearch={onSearch} />
        </Col>
      </Row>
      <Row style={{ minHeight: '40px' }}>
        <Col>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {zones.map((zone) => (
              <div key={zone.code} className={classes.compareButton}>
                {zone.name}
                <IoIosClose className={classes.compareCross} onClick={() => onClose(zone)} />
              </div>
            ))}
          </div>
        </Col>
      </Row>
    </>
  )
}

export default CompareBar
