
import {FaSearch} from "react-icons/fa"
import { Link, useNavigate } from 'react-router-dom'
import { useSelector } from "react-redux"
import { useEffect, useState } from "react"

export default function Header() {
    const navigate =  useNavigate()
    const {currentUser} = useSelector(state=>state.user)
    const [searchTerm, setSearchTerm] = useState('')
    const handleSubmit = (e)=>{
        e.preventDefault();
        const urlParmas = new URLSearchParams(window.location.search);
        urlParmas.set('searchTerm', searchTerm);
        const searchQuery = urlParmas.toString();
        navigate(`/search?${searchQuery}`)
    }
    useEffect(()=>{
        const urlParmas = new URLSearchParams(window.location.search);
        const searchTermFromUrl = urlParmas.get('searchTerm')
        if (searchTermFromUrl){
            setSearchTerm(searchTermFromUrl)
        }
    },[location.search])


  return (
    <header className='bg-slate-200 shadow-md'>
        <div className='flex justify-between items-center max-w-6xl mx-auto p-3'>
            <h1 className='font-bold text-sm sm:text-xl flex flex-wrap'>
            <Link to='/'>
            <span className='text-slate-500'>找屋</span>
                <span className='text-slate-700'>趣</span>
            </Link>
            </h1>
             <form onSubmit={handleSubmit} className=' bg-slate-100 p-3  rounded-lg flex items-center'>
                <input 
                type='text' 
                placeholder='搜尋...' 
                className=' bg-transparent focus: outline-none w-24 sm:w-64'
                value = {searchTerm}
                onChange={(e)=>setSearchTerm(e.target.value)}
                />
                <button>
                    <FaSearch className="text-slate-600"/>
                </button>
                
            </form>
            <ul className='flex gap-4'>
                <Link to='/'><li className='hidden sm:inline text-slate-700 hover:underline'>首頁</li></Link>
                <Link to='/about'><li className='hidden sm:inline text-slate-700 hover:underline'>關於我們</li></Link>
                <Link to='/profile'>
                {currentUser? (<img className="rounded-full h-7 w-7 object-cover" src={currentUser.avatar} alt="profile"/>): (<li className=' text-slate-700 hover:underline'>登入/注冊</li>)}
                </Link>
                
                

            </ul>
        </div>
        
    </header>
  )
}
