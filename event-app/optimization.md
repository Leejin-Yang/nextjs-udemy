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

<br>

### \_document.js

\_app.js 파일로만 전반적인 앱 설정을 할 수 있는 건 아니다. `_document.js`

\_app.js는 앱의 shell이다. HTML 문서의 body 속 root 컴포넌트라고 생각하면 된다. \_document.js는 전체 HTML 문서를 구성하는 모든 요소를 커스터마이징 할 수 있게 해준다.

**_클래스 컴포넌트로 작성해야한다. Nextjs가 제공하는 일부 구성요소 확장이 필요하기 때문에_**

```tsx
import Document, { Html, Head, Main, NextScript } from 'next/document'
// 여기서 Head는 next/head의 Head가 아니다!!

// 기본 구조
// 오버라이드하려면 해당 구조를 다시 만들어야 한다.
class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head />
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument
```

next/head의 Head는 렌더링된 페이지의 Head 콘텐츠를 조정하기 위해 jsx 코드 어디서나 사용된다. next/document의 Head는 \_document.js에서만 사용된다.

Nextjs의 앱은 Main 컴포넌트에 의해 렌더링된다. 모달 같은 추가 요소를 더할 때 이 파일에서 div를 추가하던지 할 수 있다. 전체 HTML 문서를 편집해야 한다면 \_document.js를 생성해 추가 작업하면 된다.

<br>

## Next Image

[https://nextjs.org/docs/api-reference/next/image](https://nextjs.org/docs/api-reference/next/image)

현제 앱에서는 이미지가 최적화 되어 있지 않다. 원본 그래도 fetching 되어 용량이 크고 확장자도 jpeg 그대로 들어온다. 이미지가 크면 프로덕션에서 큰 문제가 된다. Nextjs가 프로덕션을 위한 React 프레임워크인 만큼 간단하게 이미지를 최적화 할 수 있는 방법을 제공한다.

```tsx
import Image from 'next/image'
```

img 태그 대신 사용한다. 이 컴포넌트를 사용하면 여러 버전의 이미지를 요청이 들어올 때마다 바로바로 생성해준다. 각 운영 체제와 장치 크기에 맞게 최적화! 그리고 이미지들은 캐시되고 유사한 장치에 들어올 때 활용할수 있다.

기존 src, alt와 더불어 width와 height를 추가해준다. 이 특성을 설정해 줘야 Nextjs에서 이미지를 처리할 때 어떤 크기로 처리할 지 설정할 수 있다. 즉 페이지에 표시하고자 하는 크기를 말하는 것이다.

width와 height를 정할 때 css 속성을 참고해 고려해야 한다.

```tsx
<Image src={`/${image}`} alt={title} width={250} height={160} />
```

hard reload하고 개발자도구 네트워크 탭에서 보면 이미지의 크기가 줄어든 것을 볼 수 있다. 그리고 chrome에 최적화된 webp로 확장자가 변경되었다. 생성된 이미지는 .next 폴더에 저장되어 있다 (.next/cache/images). 이 이미지는 필요할 때마다 최적화되어 생성되는 것으로 요청이 있을 때 생성하고 저장해 두었다가 유사한 기기에서 요청이 들어올 때 이미지를 꺼내서 렌더링하는 방식이다.

크기 최적화 외에도 또 중요한 것은 생성된 이미지 그 자체이다(이미지 컴포넌트). 화면을 줄이고 화면을 다시 넓혔을 때 이미지에 대한 새로운 요청이 들어온 것을 볼 수 있다. 기본 이미지가 lazy load되기 때문이다. 보이지 않는 상태에서는 Nextjs가 다운로드 하지 않는다. **_필요할 때만 로딩!_**

프로덕션 단계에서 필요한 이미지를 생성해주고 그 이미지를 상세 페이지에서도 사용할 수 있다. width와 height를 설정해도 실제 크기는 css 스타일이 우선으로 적용된다. 여기서 설정한 값은 사용자 화면에서 fetch 해오는 크기일 뿐이다.
