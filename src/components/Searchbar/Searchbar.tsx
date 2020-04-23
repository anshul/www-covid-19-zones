import React, { useState } from 'react'
import { graphql } from 'babel-plugin-relay/macro'

import { makeStyles, createStyles } from '@material-ui/styles'
import { IoIosSearch, IoIosClose } from 'react-icons/io'
import clsx from 'clsx'
import ErrorBox from '../ErrorBox'
import { QueryRenderer } from 'react-relay'
import environment from '../../relayEnvironment'
import { SearchbarQuery } from '../../__generated__/SearchbarQuery.graphql'
import { LinearProgress, Theme } from '@material-ui/core'

interface Props {
  onSearch: (code: string, name: string) => void
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    inputRoot: {
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      backgroundColor: '#fafafa',
      borderRadius: '24px',
      boxShadow: 'rgba(0, 0, 0, 0.1) 0px 2px 12px',
    },
    input: {
      boxSizing: 'border-box',
      textIndent: '36px',
      width: '100%',
      height: '100%',
      outline: 'none',
      border: 'none',
      padding: '12px',
      fontSize: '16px',
      borderRadius: '24px',
      fontFamily: theme.typography.fontFamily,
    },
    searchIcon: {
      width: '24px',
      height: '24px',
      position: 'absolute',
      marginLeft: '16px',
    },
    closeIcon: {
      cursor: 'pointer',
      position: 'absolute',
      right: '0',
      width: '24px',
      height: '24px',
      marginRight: '16px',
    },
    button: {
      height: '48px',
    },
    menu: {
      marginTop: '8px',
      marginLeft: '8px',
      marginRight: '8px',
    },
    menuItem: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '8px',
      borderBottom: '1px solid #e4e4e4',
      transitionDuration: '0.3s',
      '&:hover': {
        backgroundColor: '#e4e4e4',
      },
    },
    menuItemHighlighted: {
      backgroundColor: '#eee',
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

const Searchbar: React.FC<Props> = ({ onSearch }) => {
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState('')

  const classes = useStyles()

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOpen(true)
    setValue(e.target.value)
  }

  return (
    <>
      <div className={classes.inputRoot}>
        <input value={value} placeholder='How is your country/city doing?' className={classes.input} onChange={onChange} />
        <IoIosSearch className={classes.searchIcon} />
        {open && (
          <IoIosClose
            className={classes.closeIcon}
            onClick={() => {
              setOpen(false)
              setValue('')
            }}
          />
        )}
      </div>

      <QueryRenderer<SearchbarQuery>
        environment={environment}
        query={graphql`
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
        `}
        variables={{ searchQuery: value }}
        render={({ error, props }) => {
          if (error) {
            return <ErrorBox error={error} />
          } else if (props) {
            const items = props.zonesList
            return (
              <div className={classes.menu}>
                {open &&
                  items.map((item) => {
                    return (
                      item && (
                        <div
                          key={item.slug}
                          className={clsx(classes.menuItem)}
                          onClick={() => {
                            onSearch(item.code, item.name)
                            setValue('')
                            setOpen(false)
                          }}
                        >
                          <p>{item.name}</p>
                          <p className={classes.parentZone}>{item.parentZone && item.parentZone.name}</p>
                        </div>
                      )
                    )
                  })}
              </div>
            )
          }
          return <LinearProgress />
        }}
      />
    </>
  )
}

export default Searchbar
