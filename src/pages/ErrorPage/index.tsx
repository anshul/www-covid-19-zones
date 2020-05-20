import React from 'react'
import { Row, Col, Grid } from 'react-flexbox-grid'
import ErrorBox from '../../components/ErrorBox'
interface Props {
  error: Error
}

const ErrorPage: React.FC<Props> = ({ error }) => {
  console.log('Rendering ErrorPage')

  return (
    <Grid>
      <Row>
        <Col xs={12} xl={8} xlOffset={2}>
          <ErrorBox error={error} />
        </Col>
      </Row>
    </Grid>
  )
}

export default ErrorPage
