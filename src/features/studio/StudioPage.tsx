import { useState } from 'react'
import { Button, Empty, Field, Input, Loading, Section } from '@/shared/ui/primitives'
import { errorMessage } from '@/shared/api/client'
import {
  useGeneratePattern,
  useMyArtworks,
  usePatternTask,
  useRegisterShowroomItem,
  useUploadArtwork,
} from './api'

/** STUDIO-01 ~ 03: 업로드 → AI 패턴 생성 → 쇼룸 등록 */
export default function StudioPage() {
  const [file, setFile] = useState<File | null>(null)
  const [title, setTitle] = useState('')
  const [artworkId, setArtworkId] = useState<number | null>(null)
  const [taskId, setTaskId] = useState<string | undefined>()

  const [name, setName] = useState('')
  const [price, setPrice] = useState('')
  const [description, setDescription] = useState('')

  const uploadArtwork = useUploadArtwork()
  const generate = useGeneratePattern()
  const task = usePatternTask(taskId)
  const register = useRegisterShowroomItem()
  const { data: artworks, isLoading } = useMyArtworks()

  const preview = file ? URL.createObjectURL(file) : null
  const patternUrl = task.data?.patternImageUrl
  const status = task.data?.status

  const handleUpload = async () => {
    if (!file || !title.trim()) return
    const art = await uploadArtwork.mutateAsync({ file, title })
    setArtworkId(art.id)
  }

  const handleGenerate = async () => {
    if (!artworkId) return
    const t = await generate.mutateAsync({ artworkId })
    setTaskId(t.taskId)
  }

  const handleRegister = () => {
    if (!patternUrl) return
    register.mutate({
      patternId: Number(task.data?.taskId ?? 0),
      name,
      description,
      price: Number(price) || 0,
    })
  }

  return (
    <div className="space-y-16 py-8">
      {/* STUDIO-01 */}
      <Section title="원화 업로드">
        <div className="grid gap-6 md:grid-cols-2">
          <label className="flex aspect-[4/3] cursor-pointer items-center justify-center overflow-hidden rounded-xl border border-dashed border-line bg-ink-soft">
            {preview ? (
              <img src={preview} alt="" className="h-full w-full object-contain" />
            ) : (
              <span className="text-sm text-muted">이미지를 선택하세요</span>
            )}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            />
          </label>

          <div className="space-y-5">
            <Field label="작품명">
              <Input value={title} onChange={(e) => setTitle(e.target.value)} />
            </Field>
            {uploadArtwork.error && <p className="text-sm text-red-400">{errorMessage(uploadArtwork.error)}</p>}
            <Button disabled={!file || !title.trim() || uploadArtwork.isPending} onClick={handleUpload}>
              {uploadArtwork.isPending ? '업로드 중' : '업로드'}
            </Button>
            {artworkId && <p className="text-xs text-accent">업로드 완료 (ID {artworkId})</p>}
          </div>
        </div>
      </Section>

      {/* STUDIO-02 */}
      <Section title="AI 패턴 생성">
        {!artworkId ? (
          <Empty message="먼저 원화를 업로드해 주세요." />
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            <div className="aspect-[4/3] overflow-hidden rounded-xl border border-line bg-ink-soft">
              {patternUrl ? (
                <img src={patternUrl} alt="" className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full items-center justify-center text-sm text-muted">
                  {status ? `생성 상태: ${status}` : '아직 생성 전입니다'}
                </div>
              )}
            </div>
            <div className="space-y-5">
              <p className="text-sm text-muted">
                업로드한 원화를 패턴으로 변환합니다. 생성은 비동기로 처리되며 완료까지 30초에서 2분 정도 걸립니다.
              </p>
              {generate.error && <p className="text-sm text-red-400">{errorMessage(generate.error)}</p>}
              <Button disabled={generate.isPending || status === 'PROCESSING'} onClick={handleGenerate}>
                {generate.isPending || status === 'PROCESSING' ? '생성 중' : '패턴 생성'}
              </Button>
              {status === 'FAILED' && <p className="text-sm text-red-400">{task.data?.message ?? '생성에 실패했습니다.'}</p>}
            </div>
          </div>
        )}
      </Section>

      {/* STUDIO-03 */}
      <Section title="쇼룸에 등록">
        {!patternUrl ? (
          <Empty message="패턴 생성이 완료되면 등록할 수 있습니다." />
        ) : (
          <div className="grid max-w-lg gap-5">
            <Field label="상품명"><Input value={name} onChange={(e) => setName(e.target.value)} /></Field>
            <Field label="가격 (원)"><Input type="number" value={price} onChange={(e) => setPrice(e.target.value)} /></Field>
            <Field label="설명"><Input value={description} onChange={(e) => setDescription(e.target.value)} /></Field>
            {register.error && <p className="text-sm text-red-400">{errorMessage(register.error)}</p>}
            {register.isSuccess && <p className="text-sm text-accent">쇼룸에 등록했습니다.</p>}
            <Button disabled={register.isPending || !name.trim()} onClick={handleRegister}>
              {register.isPending ? '등록 중' : '쇼룸에 등록'}
            </Button>
          </div>
        )}
      </Section>

      {/* MY-01 */}
      <Section title="내 원화">
        {isLoading ? (
          <Loading />
        ) : !artworks?.length ? (
          <Empty message="등록한 원화가 없습니다." />
        ) : (
          <ul className="grid grid-cols-2 gap-4 md:grid-cols-5">
            {artworks.map((a) => (
              <li key={a.id} className="space-y-2">
                <div className="aspect-square overflow-hidden rounded-lg border border-line bg-ink-soft">
                  {a.imageUrl && <img src={a.imageUrl} alt="" className="h-full w-full object-cover" />}
                </div>
                <p className="truncate text-xs text-muted">{a.title}</p>
              </li>
            ))}
          </ul>
        )}
      </Section>
    </div>
  )
}
