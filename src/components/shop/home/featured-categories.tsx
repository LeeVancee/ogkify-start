import { Link } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { getCategories } from '@/server/categories.server'

interface Category {
  id: string
  name: string
  imageUrl: string | null
}

export function FeaturedCategories() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const result = await getCategories()
        setCategories(result)
      } catch (error) {
        console.error('获取分类失败:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchCategories()
  }, [])

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="aspect-square rounded-lg bg-muted animate-pulse"
          />
        ))}
      </div>
    )
  }

  if (!categories.length) {
    return null
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {categories.map((category) => (
        <Link
          key={category.id}
          to="/categories"
          className="group block"
          search={{ category: category.name }}
        >
          <div className="relative aspect-square overflow-hidden rounded-lg border bg-muted">
            <img
              src={category.imageUrl || '/placeholder.svg'}
              alt={category.name}
              className="object-cover transition-transform group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <h3 className="text-xl font-semibold text-white">
                {category.name}
              </h3>
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
}
