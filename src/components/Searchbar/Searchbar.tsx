import {
  Divider,
  IconButton,
  InputBase,
  LinearProgress,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  Paper,
  Theme,
} from '@material-ui/core'
import { Close, Search } from '@material-ui/icons'
import { createStyles, makeStyles } from '@material-ui/core'
import { graphql } from 'babel-plugin-relay/macro'
import React, { useState } from 'react'
import { QueryRenderer } from 'react-relay'
import environment from '../../relayEnvironment'
import { SearchbarQuery } from '../../__generated__/SearchbarQuery.graphql'
import ErrorBox from '../ErrorBox'

interface Props {
  onSearch: (code: string, name: string) => void
  placeHolder?: string
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      position: 'relative',
      backgroundColor: '#fff',
    },
    searchRoot: {
      padding: '2px 4px',
      display: 'flex',
      alignItems: 'center',
    },
    searchWithResultRoot: {
      padding: '2px 4px',
      display: 'flex',
      alignItems: 'center',
      borderBottomLeftRadius: 0,
      borderBottomRightRadius: 0,
    },
    input: {
      marginLeft: theme.spacing(1),
      flex: 1,
    },
    iconButton: {
      padding: 10,
    },
    inputRoot: {
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      backgroundColor: '#fafafa',
      borderRadius: '24px',
      boxShadow: 'rgba(0, 0, 0, 0.1) 0px 2px 12px',
      fontFamily: theme.typography.fontFamily,
    },
    searchIcon: {
      padding: 10,
      color: '#0000008a',
    },
    result: {
      position: 'absolute',
      backgroundColor: '#fff',
      borderTopLeftRadius: 0,
      borderTopRightRadius: 0,
      width: '100%',
      zIndex: 4,
    },
    zone: {
      fontWeight: 600,
    },
    parentZone: {
      color: '#646464',
    },
    linkText: {
      textDecoration: 'unset',
      color: 'inherit',
    },
  })
)

const Searchbar: React.FC<Props> = ({ onSearch, placeHolder }) => {
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState('')

  const classes = useStyles()

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value)
    setOpen(true)
    if (e.target.value.length === 0) setOpen(false)
  }

  const searchQuery: string | null = value && value.length >= 2 ? value : null

  return (
    <Paper elevation={open ? 1 : 2} className={classes.root}>
      <div className={open ? classes.searchWithResultRoot : classes.searchRoot}>
        <Search className={classes.searchIcon} />
        <InputBase
          value={value}
          className={classes.input}
          placeholder={placeHolder ?? 'How is your state/city doing?'}
          inputProps={{ 'aria-label': 'search google maps' }}
          onChange={onChange}
        />
        {open && (
          <IconButton
            className={classes.iconButton}
            onClick={() => {
              setValue('')
              setOpen(false)
            }}
          >
            <Close />
          </IconButton>
        )}
      </div>
      {open && <Divider />}
      <Paper elevation={2} className={classes.result}>
        <QueryRenderer<SearchbarQuery>
          environment={environment}
          query={
            searchQuery
              ? graphql`
                  query SearchbarQuery($searchQuery: String) {
                    zonesList(searchQuery: $searchQuery) {
                      slug
                      name
                      code
                      parentZone {
                        name
                      }
                    }
                  }
                `
              : undefined
          }
          variables={{ searchQuery }}
          render={({ error, props }) => {
            if (error) {
              return <ErrorBox error={error} />
            } else if (props) {
              const items = props.zonesList || []
              if (open)
                return (
                  <List>
                    {items.map((item) => {
                      return (
                        item && (
                          <ListItem
                            button
                            key={item.slug}
                            onClick={() => {
                              onSearch(item.code, item.name)
                              setValue('')
                              setOpen(false)
                            }}
                          >
                            <ListItemText
                              classes={{
                                primary: classes.zone,
                              }}
                              primary={item.name}
                            />
                            <ListItemSecondaryAction className={classes.parentZone}>
                              {item.parentZone && item.parentZone.name}
                            </ListItemSecondaryAction>
                          </ListItem>
                        )
                      )
                    })}
                  </List>
                )
              else return <></>
            }
            return <LinearProgress />
          }}
        />
      </Paper>
    </Paper>
  )
}

export default Searchbar
