import config from '@payload-config'
import { RootPage } from '@payloadcms/next/views'

export default function AdminPage() {
  return RootPage({ config })
}
