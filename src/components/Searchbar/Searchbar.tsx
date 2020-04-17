import React, { useState, ChangeEvent } from 'react'
import { makeStyles, createStyles } from '@material-ui/styles'
import Autocomplete from 'react-autocomplete'
import { FiSearch } from 'react-icons/fi'
import clsx from 'clsx'
import { Link } from 'react-router-dom'

interface Props {
  value: string
  onChange: (value: string) => void
  onSearch: () => void
}

const useStyles = makeStyles(() =>
  createStyles({
    inputRoot: {
      display: 'flex',
      alignItems: 'center',
      backgroundColor: '#fafafa',
      borderRadius: '12px',
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
      borderRadius: '12px',
      fontFamily: 'Poppins, sans-serif',
    },
    inputIcon: {
      width: '24px',
      height: '24px',
      position: 'absolute',
      marginLeft: '16px',
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
    linkText: {
      textDecoration: 'unset',
      color: 'inherit',
    },
  })
)

const Searchbar: React.FC<Props> = ({ value, onChange, onSearch }) => {
  const classes = useStyles()

  return (
    <Autocomplete
      autoHighlight
      wrapperStyle={{}}
      value={value}
      items={['Mumbai', 'Delhi']}
      getItemValue={(item) => item}
      onChange={(e) => onChange(e.target.value)}
      onSelect={(value) => onChange(value)}
      renderInput={(props) => (
        <div className={classes.inputRoot}>
          <input {...props} placeholder='How is your country/city doing?' className={classes.input} />
          <FiSearch className={classes.inputIcon} />
          <button onClick={onSearch} className={classes.button}>Search</button>
        </div>
      )}
      renderItem={(item, isHighlighted) => (
        <Link className={classes.linkText} key={item} to={`zone/${item}`}>
          <div className={clsx(classes.menuItem, { [classes.menuItemHighlighted]: isHighlighted })}>
            <p>{item}</p>
          </div>
        </Link>
      )}
      renderMenu={(children) => <div className={classes.menu}>{children}</div>}
    />
  )
}

export default Searchbar
