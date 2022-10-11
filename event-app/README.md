# Event App

## 페이지 구조

```bash
/ # starting page (show featured events)
/events # 모든 이벤트
/events/[eventId] # 이벤트 상세 페이지
/events/[...slug] # filtered events
```

eventId와 slug가 충돌할 것 같지만, events 뒤에 2개 이상의 동적 매개변수를 붙이면 문제가 발생하지 않는다. 하나의 세그먼트만 추가한다면 eventId로 접속 시도 할 것.

이미지는 반드시 public 폴더에 저장해야 한다. public 폴더에 저장되어 있는 이미지나 글꼴 같은 데이터들은 Nextjs에서 정적인 데이터로 작용하기 때문에 CSS나 HTML 코드에서 참조할 수 있다. Nextjs에서 public 폴더에 있는 모든 콘텐츠를 애플리케이션의 일부로 간주하기 때문에 정적인 콘텐츠로 활용할 수 있다. public 폴더 밖의 파일과 폴더는 Nextjs에서 접근하지 못하므로 웹사이트 방문자들에게 보일 공공 콘텐츠를 embed할 때 HTML 코드에서 훨씬 수월하게 작업할 수 있게 된다.

## 컴포넌트 스타일

### CSS 모듈

단일 컴포넌트에 바인딩되는 모든 CSS 코드를 설정하는데 쓰인다. 해당 컴포넌트에만 영향을 준다. `eventItem.module.css`

CSS를 자바스크립트 파일에 import. Nextjs 빌드 프로세스가 이를 지원한다.

- CSS 코드를 추출해서 선택자를 바꾼다
- 해당 컴포넌트 HTML 코드의 범위를 지정한다
- 실행 중인 페이지에 주입한다

```tsx
import styles from './eventItem.module.css'
```

styles는 하나의 객체로서 이 CSS 파일 내에 정의된 모든 CSS 클래스가 각각의 이름에 따라 표시된다. 이를 HTML 요소 할당 시에 사용할 수 있다. 해당 컴포넌트를 고유하게 만드는 빌드 프로세스로 변형될 수 있도록 하기 위해 필요하다.

CSS 모듈 기능을 이용하면 본 CSS 파일에서 할당된 클래스명이 변경된 후 브라우저에서 애플리케이션이 실행된 후에는 이름이 변경된다.

```tsx
import styles from './eventItem.module.css'
;<li className={styles.item}>itme</li>
```

### Link 스타일링

a태그를 추가하지 않았다면 Link가 자체적으로 a 태그를 렌더링한다. Link를 스타일링 하기 위해 a 태그를 추가해줘야 한다. Link가 내부에 있는 a 태그를 감지하고 자체적으로 a 태그를 렌더링하는 대신 추가된 a 태그를 렌더링 한다. 그리고 클릭과 같은 모든 기능들을 대신 불러온다.

```tsx
<Link href={link}>
  <a className={styles.btn}>{children}</a>
</Link>
```

### SVG

[https://heroicons.com/](https://heroicons.com/)

컴포넌트로 svg를 리턴해준다.

```tsx
const AddressIcon = () => {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      fill='none'
      viewBox='0 0 24 24'
      stroke='currentColor'
    >
      <path
        strokeLinecap='round'
        strokeLinejoin='round'
        strokeWidth={2}
        d='M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z'
      />
      <path
        strokeLinecap='round'
        strokeLinejoin='round'
        strokeWidth={2}
        d='M15 11a3 3 0 11-6 0 3 3 0 016 0z'
      />
    </svg>
  )
}

export default AddressIcon
```

span 태그로 감싸 icon을 스타일링 해준다

```tsx
<span className={styles.icon}>
  <ArrowRightIcon />
</span>
```

## Layout

\_app.js는 루트 컴포넌트로서 여러 페이지 컴포넌트가 렌더링되는 곳이다. \_app 컴포넌트로 페이지 콘텐츠를 전달하고 페이지를 이동할 때 콘텐츠를 표시해준다. 이 컴포넌트를 일반적인 레이아웃 컴포넌트로 감쌀 수 있다. 공통 컴포넌트가 중복이 되지 않게!

Layout 컴포넌트에서 children prop을 받는다. Layout 컴포넌트로 \_app 컴포넌트를 감싼다.

```tsx
// layout.tsx
import { ReactNode } from 'react'
import Header from './header'

interface Props {
  children: ReactNode
}

const Layout = ({ children }: Props) => {
  return (
    <>
      <Header />
      <main>{children}</main>
    </>
  )
}

export default Layout

// _app.tsx
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

ref 타입 오류

[https://zerodice0.tistory.com/244](https://zerodice0.tistory.com/244)

초기값으로 null

<br>

## With Data Fetching

### HomePage

검색 엔진 최적화, 데이터가 짧은 시간에 여러번 바뀔 가능성 적다. 클라이언트 사이드에서 페이지를 로드할 이유가 없다. 그렇다면 getServerSideProps를 이용해 모든 요청에 대해서 페이지를 즉시 서버에서 pre-rendering 할 것인지, 아니면 getStaticProps를 이용해 대부분의 페이지가 업데이트되도록 특정값에 유효성 재검사를 하면 빌드 프로세스 중 또는 잠재적으로 서버상에서 페이지가 pre-rendering 되도록 해야할까? 모든 요청에 대해 사전 렌더링 할 필요가 없다. getStaticProps

firebase에서 데이터를 가져온다. 어떻게 필터링을 할 수 있을까? 쿼리 파라미터와 함께 전송되는 HTTP 요청을 조정할 수 있다.

[https://firebase.google.com/docs/database/admin/retrieve-data](https://firebase.google.com/docs/database/admin/retrieve-data)

firebase 과정이 아니니 전체 데이터를 가져와 js에서 작업하는 유틸 함수를 작성한다.

```tsx
export interface Event {
  id: string
  title: string
  description: string
  location: string
  date: string
  image: string
  isFeatured: boolean
}

export async function getAllEvents() {
  const response = await fetch(
    'https://nextjs-udemy-ed3f6-default-rtdb.firebaseio.com/events.json'
  )
  const data = await response.json()

  const events: Event[] = []

  for (const key in data) {
    events.push({
      id: key,
      ...data[key],
    })
  }

  return events
}

export async function getFeaturedEvents() {
  const allEvents = await getAllEvents()
  return allEvents.filter((event) => event.isFeatured)
}
```

<br>

### Event Detail Page (동적 페이지)

이벤트 디테일 페이지는 검색 엔진을 생각하면 홈페이지보다 더 중요하다. 이벤트에 대한 모든 세부사항을 가지고 있는 싱글 페이지이다. 처음부터 데이터가 있어야 한다. getStaticProps

이런 페이지는 늘 변경되는 사용자 특정 데이터를 필요로 하는 페이지가 아니기 때문이다. 동적 페이지기 때문에 getStaticPaths를 함께 사용한다. 어떤 eventId에 대해 페이지를 사전 렌더링할 지 결정한다.

<br>

### Data Fetching 최적화

HomePage의 경우 pre-fetch된 데이터로 사전 생성되었지만, 데이터 업데이트를 위해서는 다시 build해야 한다. 한가지 해결책으로는 getServerSideProps가 있다. 하지만 이 페이지에서는 과한 방법이다. 모든 요청에 대해 사전 생성할 필요가 없기 때문이다. revalidate가 좀 더 나은 방법.

Event Detail Page에서도 비슷하게 사용할 수 있다. 혹은 SSR을 사용하거나 클라이언트 사이드 데이터 fetching을 사용하여 초기 데이터를 가진 상태에서 업데이트를 해준다.

getStaticPath 만약 데이터의 개수가 무수히 많다면 전부 사전 생성하는 건 큰 낭비이다. 주요 이벤트만 pre-rendering. 이런 경우에는 일부 이벤트에 대해 사전 생성되지 않는다. fallback 값을 수정해주어야 한다. fallback을 true로 설정하면 Loading 표기, blocking으로 설정하면 페이지가 생성될 때까지 Nextjs는 아무것도 하지 않는다.

<br>

### Filtered Event Page

매개변수 조합이 다양할 수 밖에 없다. getStaticPath를 이용해 사전 생성할 수 있지만, 어떤 페이지를 사전 생성할지 어떻게 정할 수 있을까? 기준을 정하기 어렵다. getStaticProps가 적합하지 않을 수도 있다. getServerSideProps

들어오는 모든 요청에 대해 즉시 데이터를 fetching해서 해당 요청에 대한 페이지를 반환할 수 있게 해준다. 유입된 모든 요청에 따라 즉시 pre-rendering 되는 페이지이다.

date 객체를 return 했을 때 다음과 같은 오류가 떴다.

> **Please only return JSON serializable data types.**

JSON으로 변환 가능한 타입을 리턴해야한다.

<br>

### Client-side Data Fetching

이 앱에서는 필요 없을 수 있다. 하지만 수행해도 괜찮은 페이지(filter page)가 있어 한번 적용해본다. getServerSideProps가 있지만 client-side data fetching을 사용해도 괜찮을 것 같다. 페이지가 전보다 더 빨리 뜨지만 처음에는 데이터가 없다. 해당 페이지로 빠르게 이동하는 것이 더 중요하기 때문에 그리고 검색 엔진 최적화에 중요한 페이지가 아니기 때문에 고려해 볼 수 있다.

getStaticProps와 클라이언트 사이드 데이터 fetching은 양립할 수 있지만 (사전 렌더링을 수행한 페이지를 불러와서 업데이트 하는 경우), getServerSideProps와는 그럴 수 없다. 새로운 요청마다 getServerSideProps 함수가 실행되기 때문이다. 요청 헤더를 분석해야할 필요가 있는 상황이 아니라면 다르긴 하지만… 지금은 그럴 필요가 없기 때문에 지워준다.

**_상황에 맞는 데이터 fetching 기법을 사용하자!_**

---

## With API Routes

- 뉴스레터 구독 플로우 추가
- 댓글 기능 추가
