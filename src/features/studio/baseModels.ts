/**
 * 3D 소품 등록(STUDIO-03) 시 선택하는 베이스 실루엣 프리셋.
 * 실제 3D 모델링 API가 아직 없어, 검증된(백엔드 시드 데이터에서 이미 사용 중인) glTF 자산을
 * 실루엣 카탈로그로 재사용한다 — 패턴 이미지는 이 위에 텍스처로 맵핑된다.
 */
export interface BaseModel {
  id: string
  label: string
  rendering3dUrl: string
}

export const BASE_MODELS: BaseModel[] = [
  { id: 'jacket', label: '재킷', rendering3dUrl: 'https://cdn.herstory.com/3d/models/dancheong_jacket.gltf' },
  { id: 'hoodie', label: '후디', rendering3dUrl: 'https://cdn.herstory.com/3d/models/ink_hoodie.gltf' },
  { id: 'coat', label: '코트', rendering3dUrl: 'https://cdn.herstory.com/3d/models/patchwork_coat.gltf' },
]
