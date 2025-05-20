import { ClipLoader } from 'react-spinners'

export default function Loading() {
  return (
    <div className="flex items-center justify-center h-screen bg-white">
      <ClipLoader color="#36d7b7" size={50} />
    </div>
  )
}
