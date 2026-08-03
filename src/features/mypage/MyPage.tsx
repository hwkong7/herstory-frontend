import { Empty, ErrorBox, Loading, Section } from '@/shared/ui/primitives'
import { errorMessage } from '@/shared/api/client'
import { date, won } from '@/shared/lib/format'
import { useAuthStore } from '@/shared/store/auth'
import { useMyCertificates, useMyOrders, useMySettlements } from './api'

export default function MyPage() {
  const user = useAuthStore((s) => s.user)
  const isArtist = user?.role === 'ARTIST'

  const orders = useMyOrders()
  const certs = useMyCertificates()
  const settlements = useMySettlements()

  return (
    <div className="space-y-16 py-8">
      <header>
        <p className="text-xs tracking-widest text-muted uppercase">{isArtist ? 'Artist' : 'Customer'}</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">{user?.nickname ?? user?.email}</h1>
      </header>

      {isArtist ? (
        /* MY-02 로열티 정산 */
        <Section title="로열티 정산 내역">
          {settlements.isLoading && <Loading />}
          {settlements.error && <ErrorBox message={errorMessage(settlements.error)} />}
          {settlements.data?.length === 0 && <Empty message="아직 정산 내역이 없습니다." />}
          <ul className="divide-y divide-line rounded-xl border border-line">
            {settlements.data?.map((s, i) => (
              <li key={i} className="flex items-center justify-between px-5 py-4 text-sm">
                <span className="text-muted">{date(s.createdAt as string)}</span>
                <span className="text-accent">{won(s.amount as number)}</span>
              </li>
            ))}
          </ul>
        </Section>
      ) : (
        <>
          {/* MY-04 구매 내역 */}
          <Section title="주문 내역">
            {orders.isLoading && <Loading />}
            {orders.error && <ErrorBox message={errorMessage(orders.error)} />}
            {orders.data?.length === 0 && <Empty message="주문 내역이 없습니다." />}
            <ul className="divide-y divide-line rounded-xl border border-line">
              {orders.data?.map((o) => (
                <li key={o.id} className="flex items-center justify-between px-5 py-4 text-sm">
                  <div>
                    <p>{o.orderNumber ?? `주문 ${o.id}`}</p>
                    <p className="text-xs text-muted">{date(o.createdAt)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-accent">{won(o.totalAmount)}</p>
                    <p className="text-xs text-muted">{o.status}</p>
                  </div>
                </li>
              ))}
            </ul>
          </Section>

          {/* MY-05 디지털 후원 보증서 지갑 */}
          <Section title="디지털 후원 증서 지갑">
            {certs.isLoading && <Loading />}
            {certs.data?.length === 0 && <Empty message="후원하면 증서가 발급됩니다." />}
            <ul className="grid grid-cols-2 gap-5 md:grid-cols-4">
              {certs.data?.map((c) => (
                <li key={c.id} className="space-y-3 rounded-xl border border-line bg-ink-soft p-4">
                  <div className="aspect-square overflow-hidden rounded-lg bg-ink">
                    {c.imageUrl && <img src={c.imageUrl} alt="" className="h-full w-full object-cover" />}
                  </div>
                  <div>
                    <p className="truncate text-sm">{c.artistName}</p>
                    <p className="text-xs text-muted">{date(c.issuedAt)}</p>
                    <p className="mt-1 text-xs break-all text-accent">{c.tokenId}</p>
                  </div>
                </li>
              ))}
            </ul>
          </Section>
        </>
      )}
    </div>
  )
}
