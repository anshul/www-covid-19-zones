import React from 'react'
import { Grid, Row, Col } from 'react-flexbox-grid'
import Searchbar from '../../components/Searchbar'

interface Props {
  onSearch: (code: string) => void
  message?: string
}

const ErrorPanel: React.FC<Props> = ({ onSearch, message }) => {
  console.log('ErrorPanel', message)
  return (
    <Grid>
      <Row>
        <Col xs={12} xl={8} xlOffset={2}>
          <Searchbar onSearch={onSearch} />
        </Col>
      </Row>
      <Row>
        <Col xs={12} xl={8} xlOffset={2} style={{ marginTop: '50px' }}>
          <h5>{message || 'Something is not right...'}</h5>
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
