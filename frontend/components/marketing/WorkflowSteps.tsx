'use client'

interface WorkflowItem {
  title?: string
  description?: string
  icon?: string
  [key: string]: any
}

interface WorkflowStepsProps {
  items?: WorkflowItem[]
  title?: string
  description?: string
}

export function WorkflowSteps({ items, title, description }: WorkflowStepsProps) {
  return (
    <section className="py-24 lg:py-40 bg-light-bg-primary">
      <div className="max-w-screen-xl mx-auto px-6">
        {(title || description) && (
          <div className="text-center mb-20">
            {title && (
              <h2 className="text-2xl sm:text-3xl lg:text-5xl font-bold mb-6 text-light-text-primary">
                {title}
              </h2>
            )}
            {description && (
              <p className="text-base sm:text-lg lg:text-xl text-light-text-secondary max-w-2xl mx-auto">
                {description}
              </p>
            )}
          </div>
        )}

        {/* Workflow Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6">
          {(items || []).map((item, index) => (
            <div key={index} className="flex flex-col">
              {/* Step Number + Icon */}
              <div className="flex items-center gap-4 mb-6">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center w-16 h-16 rounded-full bg-light-accent-light/20 border-2 border-light-accent-primary">
                    <span className="text-2xl font-bold text-light-accent-primary">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                  </div>
                </div>
                {item.icon && (
                  <div className="text-3xl">{item.icon}</div>
                )}
              </div>

              {/* Content */}
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-light-text-primary">
                  {item.title}
                </h3>
                <p className="text-sm text-light-text-secondary leading-relaxed">
                  {item.description}
                </p>
              </div>

              {/* Connector Line (hidden on last item) */}
              {items && index < (items || []).length - 1 && (
                <div className="hidden lg:block absolute left-1/2 top-24 w-0.5 h-12 bg-gradient-to-b from-light-accent-primary/30 to-transparent mt-6" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
