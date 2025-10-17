"use client"
import React, { useEffect, useState } from 'react'
import { getFoodItems, getTypesByItemSlug } from '../_utils/hygraph-service'

export default function Fooditems({ onSelectItem }) {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let isMounted = true
    ;(async () => {
      try {
        const data = await getFoodItems()
        if (!isMounted) return
        setItems(data?.fooditems || [])
      } catch (err) {
        if (!isMounted) return
        setError('Failed to load food items')
      } finally {
        if (isMounted) setLoading(false)
      }
    })()
    return () => { isMounted = false }
  }, [])

  if (loading) {
    return (
      <div className='px-5 py-16'>
        <div className='max-w-7xl mx-auto'>
          <div className='mb-12 text-center'>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-pink-500/20 to-orange-400/20 border border-pink-400/30 mb-6">
              <span className="text-sm font-medium text-pink-200">🍽️ Featured Categories</span>
            </div>
            <h2 className='text-3xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-pink-300 via-rose-200 to-orange-200 bg-clip-text text-transparent mb-4'>
              Fresh Foodie Finds
            </h2>
            <p className='text-lg text-white/70 max-w-2xl mx-auto'>Discover amazing recipes from our curated collection of delicious dishes and cooking inspiration.</p>
          </div>
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8'>
            {Array.from({ length: 6 }).map((_, idx) => (
              <div key={idx} className='w-full rounded-2xl shadow-lg bg-white/95 backdrop-blur-sm ring-1 ring-white/20 overflow-hidden animate-pulse-slow'>
                <div className='w-full h-48 skeleton' />
                <div className='p-6 space-y-4'>
                  <div className='h-6 skeleton rounded w-3/4' />
                  <div className='h-4 skeleton rounded w-full' />
                  <div className='h-4 skeleton rounded w-5/6' />
                  <div className='flex justify-between items-center mt-4'>
                    <div className='h-4 skeleton rounded w-20' />
                    <div className='h-10 skeleton rounded-xl w-24' />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (error) return <div className='px-5 py-8 text-red-500'>{error}</div>

  return (
    <div className='px-5 py-16'>
      <div className='max-w-7xl mx-auto'>
        <div className='mb-12 text-center'>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-pink-500/20 to-orange-400/20 border border-pink-400/30 mb-6">
            <span className="text-sm font-medium text-pink-200">🍽️ Featured Categories</span>
          </div>
          <h2 className='text-3xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-pink-300 via-rose-200 to-orange-200 bg-clip-text text-transparent mb-4'>
            Fresh Foodie Finds
          </h2>
          <p className='text-lg text-white/70 max-w-2xl mx-auto'>Discover amazing recipes from our curated collection of delicious dishes and cooking inspiration.</p>
        </div>

        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8'>
          {items.map((item, idx) => (
            <div key={item.slug || idx} className="animate-fade-in-up" style={{ animationDelay: `${idx * 0.1}s` }}>
              <ItemCard item={item} onSelectItem={onSelectItem} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function ItemCard({ item, onSelectItem }) {
  const [expanded, setExpanded] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const typeList = Array.isArray(item?.types) ? item.types : (item?.types ? [item.types] : [])

  return (
    <div
      className='group w-full rounded-2xl shadow-lg bg-white/95 backdrop-blur-sm ring-1 ring-white/20 overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 cursor-pointer card-hover'
      onClick={() => onSelectItem && item?.slug && onSelectItem(item.slug)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      role={onSelectItem ? 'button' : undefined}
    >
      <div className='relative overflow-hidden'>
        <img
          src={item?.image?.url || 'https://via.placeholder.com/1200x800'}
          alt={typeList?.[0] || 'Food'}
          className={`w-full h-48 object-cover transition-transform duration-500 ${isHovered ? 'scale-110' : 'scale-100'}`}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        
        {typeList?.[0] && (
          <span className='absolute top-3 left-3 px-3 py-1 text-xs font-semibold rounded-full bg-gradient-to-r from-pink-500 to-orange-400 text-white shadow-lg backdrop-blur-sm'>
            {typeList[0]}
          </span>
        )}
        
        <div className={`absolute top-3 right-3 w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center transition-all duration-300 ${isHovered ? 'scale-110 bg-white/30' : ''}`}>
          <span className="text-white text-lg">→</span>
        </div>
      </div>
      
      <div className='p-6'>
        <h3 className='text-lg font-bold text-gray-900 mb-2 group-hover:text-pink-600 transition-colors'>
          {typeList.length ? typeList.join(', ') : 'Food Item'}
        </h3>
        
        <p className={`text-sm text-gray-600 leading-relaxed transition-all duration-300 ${expanded ? '' : 'line-clamp-2'}`}>
          {item?.about || 'No description available.'}
        </p>

        {typeList.length > 1 && (
          <div className='mt-4 flex flex-wrap gap-2'>
            {typeList.slice(1).map((t, i) => (
              <span key={i} className='px-3 py-1 text-xs rounded-full bg-gradient-to-r from-pink-50 to-orange-50 text-pink-700 ring-1 ring-pink-200 font-medium'>
                {t}
              </span>
            ))}
          </div>
        )}

        <div className='mt-6 flex items-center justify-between'>
          <button
            type='button'
            className='text-sm font-medium text-pink-600 hover:text-pink-700 transition-colors'
            onClick={(e) => { e.stopPropagation(); setExpanded(v => !v) }}
          >
            {expanded ? 'Show less' : 'Read more'}
          </button>

          <button
            type='button'
            className='inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-pink-500 to-orange-400 text-white font-semibold px-4 py-2 text-sm shadow-lg hover:from-pink-600 hover:to-orange-500 transition-all duration-300 hover:scale-105 btn-hover'
            onClick={(e) => e.stopPropagation()}
          >
            <span>Explore</span>
            <span className="ml-1 transition-transform group-hover:translate-x-1">→</span>
          </button>
        </div>

        {/* Mobile-only dropdown to preview items for this slug */}
        <div className='md:hidden mt-4'>
          <button
            type='button'
            className='text-sm text-gray-600 hover:text-gray-800 transition-colors'
            onClick={(e) => { e.stopPropagation(); setMobileOpen(v => !v) }}
          >
            {mobileOpen ? 'Hide items' : 'Show items'}
          </button>
          {mobileOpen && (
            <div className='mt-3 rounded-xl border border-gray-200 p-3 bg-gray-50 animate-fade-in'>
              <InlineTypeList slug={item?.slug} />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function InlineTypeList({ slug }) {
  const [types, setTypes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        const data = await getTypesByItemSlug(slug)
        if (!mounted) return
        setTypes(data?.typoffoods || [])
      } catch (e) {
        if (!mounted) return
        setError('Failed to load items')
      } finally {
        if (mounted) setLoading(false)
      }
    })()
    return () => { mounted = false }
  }, [slug])

  if (loading) return <div className='text-[12px] text-gray-500'>Loading…</div>
  if (error) return <div className='text-[12px] text-red-500'>{error}</div>

  if (!types.length) return <div className='text-[12px] text-gray-500'>No items found.</div>

  return (
    <div className='grid grid-cols-2 gap-2'>
      {types.map((t, i) => (
        <div key={t.slug || i} className='flex items-center gap-2'>
          <img src={t?.foodimg?.url || 'https://via.placeholder.com/100'} alt={t?.names || 'Type'} className='w-8 h-8 rounded object-cover' />
          <span className='text-[12px] text-gray-800'>{t?.names || 'Type'}</span>
        </div>
      ))}
    </div>
  )
}