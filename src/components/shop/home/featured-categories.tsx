import { Link } from '@tanstack/react-router'

interface Category {
  id: string
  name: string
  imageUrl: string | null
}

export function FeaturedCategories({
  categories,
}: {
  categories: Array<Category>
}) {
  if (!categories.length) {
    return null
  }

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        {/* 标题部分 */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold">Featured Categories</h2>
          <p className="mt-2 text-base-content/60">
            Explore our featured categories
          </p>
        </div>

        {/* 分类网格 */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {categories.map((category) => (
            <Link
              key={category.id}
              to="/categories"
              search={{ category: category.name }}
              className="group relative overflow-hidden rounded-xl bg-base-200"
            >
              {/* 图片容器 */}
              <div className="aspect-square w-full overflow-hidden">
                <img
                  src={category.imageUrl || '/placeholder.svg'}
                  alt={category.name}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
                {/* 渐变遮罩 */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
              </div>

              {/* 分类名称 */}
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <h3 className="text-xl font-bold text-white drop-shadow-lg">
                  {category.name}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
