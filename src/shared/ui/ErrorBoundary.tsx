import { Component, type ReactNode } from 'react'

interface Props {
  fallback: ReactNode
  children: ReactNode
}

interface State {
  hasError: boolean
}

/** 자식 렌더링 중 던져진 에러(예: 3D 모델/텍스처 로딩 실패)를 잡아 전체 라우트가 깨지는 것을 막는다. */
export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error: unknown) {
    console.error(error)
  }

  render() {
    return this.state.hasError ? this.props.fallback : this.props.children
  }
}
