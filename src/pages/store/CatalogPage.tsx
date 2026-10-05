import { PlaceholderPage } from '../../components/PlaceholderPage'
import { useI18n } from '../../i18n/i18n-context'

/**
 * PLACEHOLDER (platform): the store & payments agent builds the full catalogue here (/store/catalog) with
 * GET /api/store/products?category=&q= and GET /api/store/products/barcode/{code}.
 */
export default function CatalogPage() {
  const { t } = useI18n()
  return <PlaceholderPage icon="inventory_2" title={t.nav.screens.catalog} />
}
