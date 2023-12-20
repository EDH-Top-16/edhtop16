import React, { useContext } from 'react'
import ThemeContext from '../../contexts/ThemeContext'
import {CiLight} from 'react-icons/ci'
import {MdOutlineDarkMode} from 'react-icons/md'

const ThemeSwitcher = () => {
  const {theme, toggle} = useContext(ThemeContext);
  return (
    <button className='relative rounded-full shadow-innerdeep dark:shadow-inner bg-white dark:bg-indigo-400 w-14 text-cadet dark:text-white flex flex-row justify-between' onClick={toggle}>
      <div className={`absolute rounded-full aspect-square shadow-inner w-5 bg-accent bg-opacity-50 top-1 left-1 dark:bg-cadet dark:bg-opacity-100 dark:left-[calc(100%-1.5rem)] transition-all duration-200`}>

      </div>
      <CiLight className='w-5 h-5 m-1 z-10' />
      <MdOutlineDarkMode className='w-5 h-5 m-1 z-10'/>
    </button>
  )
}

export default ThemeSwitcher