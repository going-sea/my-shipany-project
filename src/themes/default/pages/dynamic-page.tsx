import { getThemeBlock } from '@/core/theme'
import type { DynamicPage as DynamicPageType } from '@/shared/types/blocks/landing'

export default async function DynamicPage({
  locale,
  page,
  data,
}: {
  locale?: string
  page: DynamicPageType
  data?: Record<string, any>
}) {
  const sectionsList: any = page.show_sections?.length
    ? page.show_sections
    : (page.sections ? Object.keys(page.sections) : [])
  return (
    <>
      {page.title && !page.sections?.hero && (
        <h1 className="sr-only">{page.title}</h1>
      )}
      {sectionsList.map(async (sectionKey: string) => {
        const section = page.sections?.[sectionKey]
        // console.log('dynamic-page :>> ', sectionKey, section)
        if (!section || section.disabled === true) {
          return null
        }

        // block name
        const block = section.block || section.id || sectionKey
        switch (block) {
          default:
            try {

              if (section.component) {
                return section.component
              }

              const DynamicBlock = await getThemeBlock(block)

              // console.log('333 :>> ', sectionKey);
              return (
                <DynamicBlock
                  key={sectionKey}
                  section={section}
                  {...(data || section.data || {})}
                />
              )
            } catch (error) {
              return null
            }
        }
      })}
    </>
  )
}
