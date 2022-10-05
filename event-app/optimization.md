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

<br>

### 동적 페이지에서 Head

동적 콘텐츠도 삽입할 수 있다.

```tsx
const EventDetailPage = ({ event }: Props) => {
  return (
    <>
      <Head>
        <title>{event.title} | NextEvents</title>
        <meta name='description' content={event.description} />
      </Head>
      <EventSummary title={event.title} />
      <EventLogistics
        date={event.date}
        address={event.location}
        image={event.image}
        imageAlt={event.title}
      />
      <EventContent>
        <p>{event.description}</p>
      </EventContent>
    </>
  )
}
```

클라이언트 사이드 데이터 fetching한 페이지에서는 페이지 소스에서 타이틀과 메타데이터를 확인할 수 없다. 조건문을 모두 통과하고 반환되는 메인 콘텐츠에만 추가되었기 때문이다. 모든 분기점에 추가할 수 있지만, 비효율적이다. 모든 페이지에 나오는 일반 head 콘텐츠를 설정하고 싶다면 어떻게 해야할까? 모든 페이지에 넣어주는 대신 논리 및 구성을 재활용 해서 사용할 수 있다.

컴포넌트 내부에서 선언해 if문마다 추가해준다. 반복되는 코드를 묶어주는 과정.

```tsx
const pageHeadData = (
  <Head>
    <title>
      Filtered Events {numberMonth}/{numberYear} | NextEvents
    </title>
    <meta
      name='description'
      content={`All events for ${numberMonth}/${numberYear}`}
    />
  </Head>
)

if (!loadedEvents) {
  return (
    <>
      {pageHeadData}
      <p className='center'>Loading...</p>
    </>
  )
}
```

컴포넌트 내부에서 재사용하는 것 말고 모든 페이지에 동일한 콘텐츠를 추가할 때 사용하는 방법. 별도의 컴포넌트로 빼고 모든 컴포넌트에 import해서 사용할 수 있지만 다른 방법도 있다.

<br>

### \_app.js

표시되는 모든 페이지에서 렌더링되는 경로 애플리케이션 컴포넌트이다.

```tsx
import '../styles/globals.css'
import type { AppProps } from 'next/app'
import Layout from '../components/layout/layout'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  )
}

export default MyApp
```

Components는 프로퍼티에서 수신되는데, 렌더링되어야 하는 페이지 컴포넌트이다. MyApp은 Nextjs에 의해 렌더링되고, Component 프로퍼티는 Nextjs에 의해 자동으로 설정된다. 페이지 콘텐츠를 다른 컴포넌트로 wrapping할 때 \_app.js 파일을 활용할 수 있다.

반응형 페이지의 스케일을 적정값으로 만드는데 자주 쓰이는 태그

\_app.js에 Head를 추가했고 페이지 컴포넌트에도 Head가 남아있다. 두 Head 모두 적용된 것을 볼 수 있는데, Nextjs는 여러 Head 요소를 알아서 병합해 준다. 하나의 컴포넌트에서 두 개의 타이틀이 있을 때 충돌을 해결해 하나의 타이틀만 나오게 된다. 같은 요소가 여럿 있다면 최근 요소만 반영한다 (맨 아래 요소).

그렇기에 \_app.js에 모든 요소에 통용될 타이틀이나 메타데이터를 설정할 수 있다. 이 데이터는 페이지 고유 데이터로 덮어쓸 수 있고, 고유 데이터가 없을 시 이 통용 데이터가 들어갈 것이다. 페이지 컴포넌트는 app 컴포넌트보다 나중에 렌더링되므로 페이지 컴포넌트의 Head가 표시되는 것이다.
