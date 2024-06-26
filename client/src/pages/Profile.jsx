import { useSelector } from 'react-redux';
import { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from 'firebase/storage';
import { app } from '../firebase';
import { updateUserStart, updateUserFailure, updateUserSuccess, deletUserFailure, deletUserStart, deletUserSuccess, signOutUserStart, signOutUserFailure, signOutUserSuccess } from '../redux/user/userSlice.js';
import { useDispatch } from 'react-redux';


export default function Profile() {
  const fileRef = useRef(null);
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const [file, setFile] = useState(undefined);
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [showListingsError, setShowListingsError] = useState(false)
  const [userListings, setUserListings] = useState([])
  const dispatch = useDispatch()


  // firebase storage
  // allow read;
  // allow write: if
  // request.resource.size < 2 * 1024 * 1024 &&
  // request.resource.contentType.matches('image/.*')

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  const handleFileUpload = (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFilePerc(Math.round(progress));
      },
      (error) => {
        console.log(error)
        setFileUploadError(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) =>
          setFormData({ ...formData, avatar: downloadURL })
        );
      }
    );
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success == false) {
        dispatch(updateUserFailure(data.message));
        return;
      }

      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
    } catch (error) {
      dispatch(updateUserFailure(error.message));
    }
  };

  const handleDelete = async ()=>{
    try {
      dispatch(deletUserStart())
      const res = await fetch(`/api/user/delete/${currentUser._id}`,{
        method:"DELETE",
      })
      const data = res.json();
      if (data.success == false){
        dispatch(deletUserFailure(data.message))
        return;
      }
      dispatch(deletUserSuccess(data))
    } catch (error) {
      dispatch(deletUserFailure(error.message))
    }
  }

  const handleSignOut = async()=>{
    try {
      dispatch(signOutUserStart())
      const res = await fetch(`/api/auth/signout`)
      const data = await res.json();
      if (data.success === false){
        dispatch(signOutUserFailure(data.message))
        return;
      }
      dispatch(signOutUserSuccess(data))
    } catch (error) {
      dispatch(signOutUserFailure(error.message))
    }
  }

  const handleShowListings = async()=>{
    try {
      setShowListingsError(false)
      const res = await fetch(`/api/user/listings/${currentUser._id}`)
      const data = await res.json()
      if (data.success ===false){
        setShowListingsError(true)
        return 
      }
      setUserListings(data)
    } catch (error) {
      setShowListingsError(true)
    }
  }
  const handleListingDelete = async (listingID)=>{
    try {
      const res = await fetch(`/api/listing/delete/${listingID}`,{
        method: "DELETE",
      })
      const data = await res.json()
      if (data.success === false){
        console.log(data.message)
        return;
      }
      setUserListings((prev)=>prev.filter((listing)=>listing._id !== listingID))
    } catch (error) {
      console.log(error.message)
    }
  }

  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl font-semibold text-center my-7'>個人資料</h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        <input
          onChange={(e) => setFile(e.target.files[0])}
          type='file'
          ref={fileRef}
          hidden
          accept='image/*'
        />
        <img
          onClick={() => fileRef.current.click()}
          src={formData.avatar || currentUser.avatar}
          alt='profile'
          className='rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2'
        />
        <p className='text-sm self-center'>
          {fileUploadError ? (
            <span className='text-red-700'>
              相片過大！
            </span>
          ) : filePerc > 0 && filePerc < 100 ? (
            <span className='text-slate-700'>{`Uploading ${filePerc}%`}</span>
          ) : filePerc === 100 ? (
            <span className='text-green-700'>上傳成功</span>
          ) : (
            ''
          )}
        </p>
        <input defaultValue={currentUser.username}
          type='text'
          placeholder='username'
          id='username'
          className='border p-3 rounded-lg'
          onChange={handleChange}
        />
        <input defaultValue={currentUser.email}
          type='email'
          placeholder='email'
          id='email'
          className='border p-3 rounded-lg'
          onChange={handleChange}
        />
        <input
          type='text'
          placeholder='password'
          id='password'
          className='border p-3 rounded-lg'
          onChange={handleChange}
        />
        <button disabled={loading} className='bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80'>
          {loading ? 'Loading...' : '更新'}
        </button>
        <Link className=' bg-green-700 text-white rounded-lg p-3 uppercase hover:opacity-95 text-center ' to={"/create-listing"}>
          新增物件
        </Link>
      </form>
      <div className='flex justify-between mt-5'>
        <span onClick={handleDelete} className='text-red-700 cursor-pointer'>刪除賬號</span>
        <span onClick={handleSignOut} className='text-red-700 cursor-pointer'>登出</span>
      </div>
      <p className='text-red-700 mt-5'>{error? "請重新登入": ""}</p>
      <p className=' text-green-700 mt-5'>{updateSuccess? "Success" :"" }</p>
      <button onClick={handleShowListings} className='text-green-700 w-full'>查看我的物件</button>
      <p className='text-red-700 mt-5'>{showListingsError ? 'Error show listings' : ''}</p>
      {userListings &&userListings.length > 0 && 
      <div className='flex flex-col gap-4'>
        <h1 className='text-center mt-6 text-2xl font-semibold'>我的物件</h1>
        {userListings.map((listing)=>(
          <div key={listing._id} className='flex justify-between border rounded-lg  items-center p-3'>
            <Link to={`/listing/${listing._id}`}>
                <img className='h-16 w-16 object-contain ' src={listing.imageUrls[0]} alt="Image" />
            </Link>
            <Link className='text-slate-700 p-3 flex-1' to={`/listing/${listing._id}`}>
              <p>{listing.name}</p>
            </Link>
            <div className='flex flex-col '>
              <button onClick={()=>handleListingDelete(listing._id)} className='text-red-700 uppercase'>刪除</button>
              <Link to={`/update-listing/${listing._id}`}>
                <button  className='text-green-700 uppercase'>編輯</button>
              </Link>
            </div>
          </div>
        ))}
        </div>}
    </div>
  );
}