import { ArrowPathIcon, CloudArrowUpIcon, FingerPrintIcon, LockClosedIcon } from '@heroicons/react/24/outline'

const features = [
]

export const Container = () => {
  return (
    <div className="bg-white pt-24 sm:pt-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-base font-semibold leading-7 text-indigo-600">Faster & Efficient</h2>
           <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            We deliver it right..
          </p> 
          <p className="mt-6 text-lg leading-8 text-gray-600 mb-10">
           Go on. We won't steal your images.
          </p>
        </div>
      </div>
    </div>
  )
}
