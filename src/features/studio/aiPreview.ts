/**
 * 실험적 기능: 브라우저에서 OpenAI Images API를 직접 호출해 2D 패턴 프리뷰를 생성한다.
 *
 * 주의: VITE_ 접두사가 붙은 값은 빌드 시 번들에 그대로 포함되어 배포되면 누구나 볼 수 있다.
 * 즉 이 키는 사실상 공개되는 것과 같으므로 데모/로컬 실험 용도로만 쓰고,
 * 실서비스로 나가기 전에는 반드시 백엔드로 옮겨서 서버 쪽에서만 호출해야 한다.
 * 여기서 생성된 이미지는 미리보기 용도일 뿐, 백엔드 Pattern 레코드로 저장되지 않으므로
 * 쇼룸 등록(aiPatternId)에는 사용할 수 없다 — 실제 등록은 기존 STUDIO-02 비동기 플로우를 통해야 한다.
 */

const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY as string | undefined

export async function generateAiPatternPreview(prompt: string): Promise<string> {
  if (!OPENAI_API_KEY) {
    throw new Error('VITE_OPENAI_API_KEY가 설정되지 않았습니다. .env.development.local 파일에 추가해 주세요.')
  }

  const res = await fetch('https://api.openai.com/v1/images/generations', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'dall-e-3',
      prompt: `seamless fashion textile pattern, flat lay swatch, high resolution: ${prompt}`,
      size: '1024x1024',
      n: 1,
    }),
  })

  if (!res.ok) {
    const body = await res.json().catch(() => null)
    throw new Error(body?.error?.message ?? `이미지 생성에 실패했습니다 (HTTP ${res.status})`)
  }

  const body = (await res.json()) as { data: { url: string }[] }
  return body.data[0].url
}
