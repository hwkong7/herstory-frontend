import { useState } from 'react'
import { Button, Empty, Field, Input, Loading, Section } from '@/shared/ui/primitives'
import { errorMessage } from '@/shared/api/client'
import GarmentViewer from '@/features/showroom/GarmentViewer'
import { BASE_MODELS } from './baseModels'
import {
  useGenerateAiPreview,
  useGeneratePattern,
  useMyArtworks,
  usePatternTask,
  useRegisterShowroomItem,
  useUploadArtwork,
} from './api'

/** STUDIO-01 ~ 03: 업로드 → AI 패턴 생성 → 쇼룸 등록 */
export default function StudioPage() {
  const [file, setFile] = useState<File | null>(null)
  const [artworkId, setArtworkId] = useState<number | null>(null)
  const [patternName, setPatternName] = useState('')
  const [taskId, setTaskId] = useState<string | undefined>()

  const [title, setTitle] = useState('')
  const [price, setPrice] = useState('')
  const [description, setDescription] = useState('')
  const [baseModelId, setBaseModelId] = useState(BASE_MODELS[0].id)
  const [previewMode, setPreviewMode] = useState<'2d' | '3d'>('2d')

  const [aiPrompt, setAiPrompt] = useState('')

  const uploadArtwork = useUploadArtwork()
  const generate = useGeneratePattern()
  const task = usePatternTask(taskId)
  const register = useRegisterShowroomItem()
  const aiPreview = useGenerateAiPreview()
  const { data: artworks, isLoading } = useMyArtworks()

  const preview = file ? URL.createObjectURL(file) : null
  const patternUrl = task.data?.resultImageUrl
  const generatedPatternId = task.data?.generatedPatternId
  const status = task.data?.status
  const baseModel = BASE_MODELS.find((m) => m.id === baseModelId) ?? BASE_MODELS[0]

  const handleUpload = async () => {
    if (!file) return
    const art = await uploadArtwork.mutateAsync({ file })
    setArtworkId(art.id)
  }

  const handleGenerate = async () => {
    if (!artworkId || !patternName.trim()) return
    const t = await generate.mutateAsync({ artworkId, patternName })
    setTaskId(t.taskId)
  }

  const handleRegister = () => {
    if (!generatedPatternId) return
    register.mutate({
      aiPatternId: generatedPatternId,
      title,
      description,
      price: Number(price) || 0,
      rendering3dUrl: baseModel.rendering3dUrl,
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
            <p className="text-sm text-muted">이미지를 선택하면 원화로 업로드됩니다. (제목은 서버에서 자동 지정)</p>
            {uploadArtwork.error && <p className="text-sm text-red-400">{errorMessage(uploadArtwork.error)}</p>}
            <Button disabled={!file || uploadArtwork.isPending} onClick={handleUpload}>
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
              <Field label="패턴 이름">
                <Input value={patternName} onChange={(e) => setPatternName(e.target.value)} />
              </Field>
              {generate.error && <p className="text-sm text-red-400">{errorMessage(generate.error)}</p>}
              <Button
                disabled={generate.isPending || !patternName.trim() || status === 'IN_PROGRESS'}
                onClick={handleGenerate}
              >
                {generate.isPending || status === 'IN_PROGRESS' ? '생성 중' : '패턴 생성'}
              </Button>
              {status === 'FAILED' && (
                <p className="text-sm text-red-400">{task.data?.errorMessage ?? '생성에 실패했습니다.'}</p>
              )}
            </div>
          </div>
        )}
      </Section>

      {/* 실험적: 브라우저에서 바로 OpenAI 호출 — 아이디어 스케치용, 정식 등록 파이프라인과는 별개 */}
      <Section title="AI 패턴 아이디어 스케치 (실험적)">
        <p className="text-xs text-muted">
          브라우저에서 OpenAI에 직접 요청하는 프리뷰 도구입니다. 여기서 만든 이미지는 백엔드에 저장되지 않아
          쇼룸 등록에는 쓸 수 없고, 아이디어 확인용입니다. 로컬 개발 전용 — API 키가 클라이언트 번들에
          노출되므로 배포 전 반드시 백엔드로 옮겨야 합니다.
        </p>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-4">
            <Field label="프롬프트">
              <Input
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                placeholder="예: 청록색 단청 문양, 사이버펑크 네온"
              />
            </Field>
            {aiPreview.error && <p className="text-sm text-red-400">{errorMessage(aiPreview.error)}</p>}
            <Button disabled={!aiPrompt.trim() || aiPreview.isPending} onClick={() => aiPreview.mutate(aiPrompt)}>
              {aiPreview.isPending ? '생성 중' : '프리뷰 생성'}
            </Button>
          </div>
          <div className="aspect-square overflow-hidden rounded-xl border border-line bg-ink-soft">
            {aiPreview.data ? (
              <img src={aiPreview.data} alt="" className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full items-center justify-center text-sm text-muted">아직 생성 전입니다</div>
            )}
          </div>
        </div>
      </Section>

      {/* STUDIO-03 */}
      <Section title="쇼룸에 등록">
        {!patternUrl ? (
          <Empty message="패턴 생성이 완료되면 등록할 수 있습니다." />
        ) : (
          <div className="grid gap-10 md:grid-cols-2">
            <div className="space-y-4">
              <div className="flex gap-2">
                <button
                  className={`rounded-full border px-4 py-1.5 text-xs transition ${
                    previewMode === '2d' ? 'border-accent text-accent' : 'border-line text-muted hover:text-ivory'
                  }`}
                  onClick={() => setPreviewMode('2d')}
                >
                  2D 패턴
                </button>
                <button
                  className={`rounded-full border px-4 py-1.5 text-xs transition ${
                    previewMode === '3d' ? 'border-accent text-accent' : 'border-line text-muted hover:text-ivory'
                  }`}
                  onClick={() => setPreviewMode('3d')}
                >
                  3D 미리보기
                </button>
              </div>
              {previewMode === '2d' ? (
                <div className="aspect-square overflow-hidden rounded-xl border border-line bg-ink-soft">
                  <img src={patternUrl} alt="" className="h-full w-full object-cover" />
                </div>
              ) : (
                <GarmentViewer modelUrl={baseModel.rendering3dUrl} patternUrl={patternUrl} />
              )}
            </div>

            <div className="space-y-5">
              <Field label="3D 베이스 실루엣">
                <div className="flex gap-2">
                  {BASE_MODELS.map((m) => (
                    <button
                      key={m.id}
                      className={`rounded-full border px-4 py-2 text-xs transition ${
                        baseModelId === m.id ? 'border-accent text-accent' : 'border-line text-muted hover:text-ivory'
                      }`}
                      onClick={() => setBaseModelId(m.id)}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>
              </Field>
              <Field label="상품명"><Input value={title} onChange={(e) => setTitle(e.target.value)} /></Field>
              <Field label="가격 (원)"><Input type="number" value={price} onChange={(e) => setPrice(e.target.value)} /></Field>
              <Field label="설명"><Input value={description} onChange={(e) => setDescription(e.target.value)} /></Field>
              {register.error && <p className="text-sm text-red-400">{errorMessage(register.error)}</p>}
              {register.isSuccess && <p className="text-sm text-accent">쇼룸에 등록했습니다.</p>}
              <Button disabled={register.isPending || !title.trim()} onClick={handleRegister}>
                {register.isPending ? '등록 중' : '쇼룸에 등록'}
              </Button>
            </div>
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
