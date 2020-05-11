import React from 'react'
import { Grid, Row, Col } from 'react-flexbox-grid'
import Searchbar from '../../components/Searchbar'

interface Props {
  onSearch: (code: string) => void
}

const ErrorPanel: React.FC<Props> = ({ onSearch }) => {
  console.log('error panel (no data?)')
  return (
    <Grid>
      <Row>
        <Col xs={12} xl={8} xlOffset={2}>
          <Searchbar onSearch={onSearch} />
        </Col>
      </Row>
      <Row>
        <Col xs={12} xl={8} xlOffset={2} style={{ marginTop: '50px' }}>
          <h5>Something is not right...</h5>
          <p>
            <small>
              <a href='/'>Try again!</a>
            </small>
          </p>
        </Col>
      </Row>
    </Grid>
  )
}
export default ErrorPanel
