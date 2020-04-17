import { Environment, Network, RecordSource, Store, FetchFunction } from 'relay-runtime'
// import ActionCable from 'actioncable'
// import { createActionCableHandler } from './createActionCableHandler'
import { getToken, serverUrl } from './api/server'

const error = (status: number, statusText: string): Error => {
  const obj = Error(`${statusText} (${status})`)
  obj.name = `HTTP_${status}`
  return obj
}

const fetchQuery: FetchFunction = (operation, variables) => {
  const token = getToken()
  return fetch(`${serverUrl}/graphql`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      query: operation.text,
      variables,
    }),
  })
    .then((response) => response.json())
    .then((responeJson) => {
      if (responeJson.errors)
        return {
          data: null,
          errors: responeJson.errors,
        }
      return responeJson
    })
    .catch((err) => {
      throw error(0, err.message)
    })
}

// const cableUrl = serverUrl.replace(/^http/, 'ws')
// const cable = ActionCable.createConsumer(`${cableUrl}/cable`)

// const subscriptionHandler = createActionCableHandler({
//   cable: cable
// })

const environment = new Environment({
  network: Network.create(fetchQuery),
  store: new Store(new RecordSource()),
})

export default environment
