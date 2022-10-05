# Next.js 앱 최적화

페이지에 다양한 최적화를 적용하고 성능을 향상시키자.

- <head>와 메타데이터: 제목과 meta description
- 특정 컴포넌트나 논리, 구성을 재활용하는 법 (페이지에서 재활용)
- 이미지 최적화, 효율적으로 활용

<br>

## Head & meta-data

브라우저와 검색 엔진에서 요청을 통해 불러오는 중요한 메타데이터와 정보가 담겨 있다. 현재는 페이지에 대한 설명과 제목이 없다. 메타데이터가 있어야 사용자 경험의 질을 원하는 정도까지 끌어올릴 수 있다. 검색 엔진에도 필수적인 부분! 크롤러가 확인하는게 이 메타데이터이기 때문이다.

```tsx
import Head from 'next/head'
```

jsx 코드의 아무 부분에 추가해도 된다. Head를 추가하면 Nextjs가 알아서 해당 요소를 추가한다. meta 태그는 검색 엔진에 없어서는 안 될 태그이므로 중요하다. 검색 엔진에서 검색 결과를 출력할 때 content는 같이 출력된다.

```tsx
const HomePage = ({ events }: Props) => {
  return (
    <>
      <Head>
        <title>Featured Events | NextEvents </title>
        <meta
          name='description'
          content='Find a lot of great events that allow you to evolve.'
        />
      </Head>
      <EventList events={events} />
    </>
  )
}
```
