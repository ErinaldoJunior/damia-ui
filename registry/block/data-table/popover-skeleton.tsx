import { Skeleton } from '@/components/ui/skeleton'

export function PopoverSkeleton() {
  return (
    <div className='flex flex-col p-2 gap-2 h-[140px] w-[220px]'>
      <Skeleton className='h-[20px] w-full' />
      <Skeleton className='h-[20px] w-full' />
      <Skeleton className='h-[20px] w-full' />
      <Skeleton className='h-[20px] w-full' />
      <Skeleton className='h-[20px] w-full' />
    </div>
  )
}
