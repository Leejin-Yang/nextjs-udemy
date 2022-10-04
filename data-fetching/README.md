# 페이지 사전 렌더링 & 데이터 페칭

## React와 Nextjs 비교

### React 앱의 문제점

fetch한 데이터는 js 코드에 데이터를 로딩한 것이 아니다. 파일을 import하는 방식이 아니다. 대신 설정이 모두 끝나고 브라우저에서 실행되고 있을 때 해당 파일에 HTTP 요청을 보내는 방식이다. 그 후 추출한 데이터를 로딩하고 상태 설정과 데이터 렌더링을 시작한다. **\*\***렌더링된 DOM에서는 표시가 되는데 이는 JS와 React를 통한 렌더링이 끝나야지만 본 페이지에서 로딩된다.

**_페이지 소스를 보면 어디에서도 데이터를 찾아볼 수 없다._**

이는 몇 가지 단점이 있는데 사용자들이 데이터가 실질적으로 페이지에 로딩되기까지 기다려야한다. 이렇게 데이터를 페칭하면 사용자 경험의 최적화라고 할 수 없다. 괜찮을 수도 있겠지만 더 나아질 여지가 있는 것이다.

검색 엔진 최적화에도 문제가 있다. 콘텐츠를 구글이 알아야하는데 검색 엔진은 콘텐츠가 없는 데이터를 보게 된다. 재전송 방식은 적합하지 않다. 검색엔진이 상관 없다면(대시보드나 로그인) 괜찮지만 콘텐츠가 많은 앱의 경우 필요하다.

<br>

### Nextjs

pre-rendering 개념을 이용해서 위와 같은 문제의 해결을 돕는다.

사용자가 페이지를 방문해 요청이 전송되면 Nextjs가 pre-render된 페이지를 반환한다. 페이지를 다시 클라이언트로 전송된 뒤에만 데이터를 로딩하는 대신 필요할 법한 모든 데이터가 있는 HTML 콘텐츠를 사전에 렌더링한다. 사전에 HTML 페이지를 완성해 놓고 완전히 채워진 HTML 파일을 클라이언트에게 전송한다. SEO에도 뛰어나다!

하지만 Interactive React 앱이 필요하다. 사용자와 상호작용하기 위해서. Nextjs는 단순히 pre-rendering된 페이지를 재전송하는데 그치지 않고 포함된 js 코드를 모두 재전송한다. 이런 재전송을 해당 페이지에 대해 hydrate한다고 한다. 재전송된 js코드는 나중에 pre-rendering된 페이지를 대체하고 이에 React가 알맞은 작업을 수행한다.

주요 콘텐츠가 모두 포함되어 있는 상태이기 때문에 검색엔진크롤러도 모든 콘텐츠를 살펴보게 된다.

요약하면 Nextjs는 페이지를 사전에 준비하는데 이때 모든 HTML 콘텐츠를 사전에 구축하고 필요할 모든 데이터릴 사전에 로딩하는 방식을 따른다. **_사전 렌더링은 오직 최초 로딩할 때만 영향을 미친다._** 페이지를 방문하면 로딩되는 첫 번째 페이지가 pre-rendering 된 것이다. 첫 번째 렌더링이 끝나고 나면 다시 SPA로 돌아간다. 그때부터 React가 프론트엔드에서 모든 처리를 수행한다. 그 후에 페이지가 바뀔 때 해당 페이지가 pre-rendering되지 않고 React를 통해 클라이언트 사이드에서 생성된다. pre-rendering되는 건 최초 접속하는 첫 번째 페이지 뿐!

Nextjs에는 두 가지 pre-rendering 양식이 있다.

- Static Generation (정적 생성)
- Server-side Rendering

둘의 차이점은 정적 생성은 빌드되는 동안 모든 페이지가 사전 생성된다는 것이다. 따라서 프로덕션용 앱을 구축한다면 배포 전에 모든 페이지가 준비된다는 것. SSR의 경우 배포 후 요청이 서버까지 오는 바로 그때 모든 페이지가 생성된다.

<br>

## Static Generation

일반적으로 권장되는 방법. 빌드하는 동안 페이지를 사전 생성하는 것이다. 즉 보통 서버 사이드에서만 실행되는 코드를 빌드 프로세스 동안 실행하도록 허용한다. 빌드 시간(앱을 구축할 때) 중 데이터와 페이지가 준비된다. 배포되고 나면 구축된 페이지는 서버나 앱을 실행시키는 CDN을 통해서 캐시로 저장된다. 이에 사전 구축된 페이지를 통해서 즉시 입력 요청이 실행될 수 있다. 클라이언트에게 전송되는 페이지와의 차이점이라고 하면 빈 페이지가 아닌 사전에 콘텐츠로 채워져 있다는 점이다.

이때 문제점은 어떤 페이지를 사전에 생성해야 하는지 지정하는 일이다. 페이지 컴포넌트에서 가져올 수 있는 특정 함수가 있다. 반드시 사용하는 페이지 컴포넌트 내부에 있어야 한다.

```tsx
export async function getStaticProps(context) {...}
// getStaticProps 이름 fix
// Promise를 반환하는 비동기 함수로 await 키워드를 사용할 수 있다.
```

보통 서버 사이드에서만 실행되는 모든 코드도 실행할 수가 있다. 함수 안에 작성한 코드는 클라이언트에게 재전송되는 코드로 포함되지 않는다. 클라이언트는 볼 수 없다.

**_Nextjs는 동적 데이터가 없는 모든 페이지를 pre-rendering한다._**

<br>

### getStaticProps

페이지를 사전 생성할 때 사용자를 대신하여 getStaticProps를 호출. 이 함수는 페이지가 사전 생성되어야 하는 페이지임을 알려준다. 기본값으로 pre-rendering을 하지만 사전에 렌더링 하지 않게 하는 방법도 있기 때문에 여전히 사전 생성되어야 하도록 한다는 것을 알려준다.

페이지가 로드된 후에만 클라이언트 사이드에서 전송되는 HTTP 요청 대신 컴포넌트를 생성하기 전에 Nextjs가 pre-rendering 하기 전에 데이터를 pre-fetch해야 한다.

**_항상 props 키를 포함한 객체를 반환해야 한다._**

이 함수가 하는 일은 컴포넌트에 대한 프로퍼티를 준비하는 것이다. 이 함수가 페이지 컴포넌트에 있다면 이 함수를 먼저 실행하고 다음에 컴포넌트 함수를 실행한다.

사전에 두 가지 작업을 모두 수행하기 때문에 클라이언트 사이드에서는 모두 실행되지 않는다. 빌드되는 시간 동안이나 사용 중인 개발 서버의 일부로 개발 중에 발생한다.

- 데이터 fetching은 서버에서 이루어진다.
- js 소스코드에서 코드를 확인할 수 없다 (클라이언트 사이드에서 실행되지 않기 때문에)

사용자가 볼 수 없는 credential을 쓸 수 있고 브라우저에서 작동하지 않는 코드를 실행할 수 있다.

<br>

### 서버사이드 코드 실행 & Filesystem

```tsx
// Node.js로부터 파일 시스템 모듈을 import
import fs from 'fs'
// Promise를 사용하는
import fs from 'fs/promises' // readFile은 Promise를 반환한다.

// 경로를 구축하는데 유용한 기능이 있는 모듈
import path from 'path'
```

브라우저측 js가 파일 시스테멩 접근할 수 없기 때문에 클라이언트 사이드에서는 fs 모듈 작업이 안된다. Nextjs는 import를 확인하고(클라이언트 사이드에서 사용하는지 여부를) 클라이언트 사이드 코드 번들에서는 import를 제거한다.

[https://webruden.tistory.com/947](https://webruden.tistory.com/947)

fs.readFile or fs.readFileSync를 통해 파일을 읽는다. readFileSync는 파일을 동기적으로 읽고 완료될 때까지 실행을 차단한다. readFile은 계속하려면 콜백해야한다.

path.join 메소드를 통해 readFile이 사용할 수 있는 경로를 구축할 수 있다. 이를 위해 먼저 어디서 시작하는지 알려주고 다른 Node.js 객체로 현재 작업 디렉토리로 이동할 수 있다.

Node.js에서 전역적으로 사용할 수 있는 process 객체

process.cwd: 실행될 때 코드 파일의 현재 작업 디렉토리를 제공한다. pages 폴더가 아니다. 이 파일이 실행될 때 Nextjs가 이를 실행하고 **_모든 파일이 루트 프로젝트 폴더에 있는 것으로 취급한다._**

<br>

### 내부에서 일어나고 있는 일

앱을 빌드할 때 Nextjs가 어떤일을 하는지

build 스크립트: 프로젝트를 배포할 때 실행하는 스크립트. 페이지를 사전 생성

start 스크립트: Node.js 서버로 프로덕션 준비 페이지를 미리 볼 수 있다.

<img width="701" alt="next build" src="https://user-images.githubusercontent.com/78616893/193009941-23ea87df-2a3d-4ac7-80c5-4421617f2deb.png">

범례

- ⭕️ Static: 사전 생성되지만 데이터가 필요하지 않으므로 함수를 쓰지 않는 페이지
- 🔴 SSG: 정적 측면 생성, 개발 또는 빌드 프로세스 중에 사전 생성된 페이지 (getStaticProps)
- λ: 서버 사이드 전용 페이지

.next 폴더

.next/server 폴더에서 사전 생성된 HTML 파일을 확인할 수 있다.

페이지 소스에는 필요한 데이터가 포함된 Nextjs가 삽입한 스크립트 태그가 있다(id="_NEXT_DATA_"). 이는 pre-rendering된 HTML 코드가 React 앱과 연결되는 hydration 과정에 필요하다. 그리고 pre-fetching한 데이터는 React 앱으로 전달되어서 동적 데이터인지 어떤 종류의 데이터를 렌더링 할지 알 수 있다. 수신한 데이터로 계속 작업하고 React를 통해 해당 데이터를 업데이트하면 React는 어떤 종류의 데이터가 수신되었는지 알게 된다.

<br>

### ISR(증분 정적 생성)

위의 내용에서 서버 사이드라는 말은 일부만 맞다. getStaticProps에서 서버 사이드 코드를 실행할 수 있지만, 결국 코드는 앱을 제공하는 실제 서버에서 실행되지 않고 앱이 빌드될 때 컴퓨터에서 실행된다.

자주 바뀌는 데이터라면 어떻게 될까?

페이지를 사전 생성하는 것은 꽤나 정적인 것을 구축하는 경우에 좋은 방법이다. 데이터가 그다지 자주 변경되지 않는 블로그와 같은. 예시에서 더미데이터에 프로덕트가 추가된다면 다시 빌드하고 다시 배포해야한다. 이에 대한 해결책도 있다.

- 페이지를 사전 빌드하지만 서버에서 업데이트된 데이터 페칭을 위해 useEffect 사용. 항상 pre-rendering된 데이터를 일부 포함해 페이지를 제공하지만 백그라운드에서 최신 데이터를 가져온 뒤 도착하면 로드된 페이지를 업데이트.
- build시 실행되는 것은 맞지만, 항상 그런것은 아니다. 내장 기능인 ISR이 있다.

Incremental Static Generation

페이지를 빌드할 때 정적으로 한 번만 생성하는 것이 아니라 배포 후에도 재배포 없이 계속 업데이트 된다. 들어오는 모든 요청에 대해 주어진 페이지를 Nextjs가 재생성 하도록 할 수 있다(시간 설정). 설정한 시간이 지나면 서버에서 사전 생성되고 업데이트. 새로 생성된 페이지는 서버에 있던 오래된 기존 페이지를 대체하고 캐시되며 향후 방문자는 재생성된 페이지를 보게 된다.

**_return 객체에서 revalidate 키를 추가하면 된다. 재생성을 위해 기다리는 시간(초)을 설정하면 된다._**

개발 서버에서는 항상 최신 데이터가 포함된 최신 페이지가 표시되지만 프로덕션에서는 위에 설정한 시간에 따라 업데이트.

getStaticProps가 프로덕션 준비 사이트를 실행하는 서버에서 다시 실행된다. 브라우저에서도 아니고 빌드 프로세스 중에서도 아닌 start로 배포된 후 서버에서 실행. getStaticProps에 콘솔로그로 확인해보자.

<br>

### getStaticProps 자세히 살펴보기

반환되는 객체

```tsx
return {
  props: {
    products: data.products,
  },
  revalidate: 600,
  notFound: false,
  redirect: {
    destination: '/no-data',
  },
}
```

- notFound: boolean
  - true로 설정하면 페이지가 404 오류를 반환하고 404 오류 페이지를 렌더링한다. 데이터 fetch에 실패한 경우에 사용한다.
- redirect: 사용자를 다른 라우트로 리디렉션 할 수 있다. 데이터 fetch에 실패한 경우에 필요한 설정

```tsx
export async function getStaticProps(context) {...}
```

Nextjs에 의해 호출되고 인수를 받는다. context(페이지에 대한 추가 정보를 가진 객체)

동적 매개변수나 동적 경로 세그먼트 값 등을 얻는다.

ProduceDetailPage 예시

상품 하나만 보여주기 위해 url에 있는 구체적인 값을 가져와야한다. 여기서 context 매개변수를 사용하면 된다. 경로상의 동적 세그먼트에 대한 구체적인 값을 알 수 있다.

```tsx
// [pid].tsx
export const getStaticProps: GetStaticProps = (context) => {
  // params는 객체. key는 동적 경로 세그먼트 여기서는 pid
  const { params } = context

  return {
    props: {},
  }
}
```

컴포넌트 함수와 이 함수에서 매개변수를 추출할 때 차이점

- 컴포넌트 함수: router.query. 컴포넌트 내부에서 사용 가능. id를 백엔드 서버에 요청을 보내 거기에서 fetching하기 위해서. 이 과정은 브라우저에서만 이루어진다.
- getStaticProps: context.params. 서버에서 이루어진다. 컴포넌트 함수보다 먼저 실행된다. pre-render하기 위한 함수이기 때문

![page-error](https://user-images.githubusercontent.com/78616893/193027176-ff9bb734-3d0a-4af8-984e-245899e29ee7.png)

<br>

## Pre-Generated Paths (Routes)

왜 위와 같은 에러가 날까?

**_Nextjs는 동적 페이지에서 페이지를 사전 생성하지 않는다!_**

해당 페이지로 연결되는 동적 세그먼트가 있는 경우 기본 동작으로 페이지를 사전 생성하지 않는다. 엄밀히 말해서 여러 페이지이기 때문에. Nextjs는 얼마나 많은 페이지를 미리 생성해야 하는지 알지 못한다. [pid]에서 어떤 값이 지원되는지 알지 못한다. 동적 라우트의 경우 Nextjs는 더 많은 정보가 필요하다.

Nextjs에 어떤 경로가 생성되어야 하는지 동적 페이지에서 어떤 인스턴스가 사전 생성되어야 하는지 알려줄 수 있다. 데이터만 필요한게 아니라 어떤 동적 세그먼트 값을 사용할 수 있는지 알아야 한다. 그리고 어떤 값에 대한 페이지가 사전 생성되어야 하는지 알아야 그 페이지의 여러 인스턴스를 사전 생성할 수 있게 된다. `getStaticPaths`

```tsx
export async function getStaticPaths() {...}
```

동적 페이지의 어떤 인스턴스를 생성할지 Nextjs에 알리는 것을 목표로 한다.

```tsx
export const getStaticPaths: GetStaticPaths = () => {
  return {
    paths: [
      { params: { pid: 'p1' } },
      { params: { pid: 'p2' } },
      { params: { pid: 'p3' } },
    ],
    fallback: false,
  }
}
```

- paths: Array<Object>
  - 객체에는 params 키. 값은 각각의 동적 세그먼트 식별자 (pid)
  - 페이지가 생성되기 위한 구체적인 값
- fallback: (아래에서 설명)

동적 페이지의 어떤 구체적인 인스턴스를 사전 생성할지 알려주는 함수이다.

<img width="673" alt="build-with-getStaticPaths" src="https://user-images.githubusercontent.com/78616893/193045800-249e4feb-feac-4761-881e-eccf3e833244.png">

build하면 p1, p2, p3 페이지가 생성된 것을 볼 수 있다.

메인 페이지에 링크가 있다. 프로덕션 준비 페이지에서 개발자 도구 Network 탭을 보면 데이터를 pre-fetching 하는 것도 볼 수 있다(p1.json, p2.json, p3.json). 링크를 클릭하면 새로 고침 될 페이지에 대한 프로퍼티가 pre-fetching된 것을 볼 수 있다. 링크를 클릭하지 않아도 확인할 수 있다. 데이터가 pre-fetch 되는 시점은 Nextjs가 결정하고 실행한다.

링크를 클릭하면 pre-rendering된 HTML 파일을 로드하는 것이 아니라 SPA에 계속 머무르고 있다. 초기 요청 이후 로드하고 hydrate하는 React 앱에 있는 것이다. JS가 새 페이지를 렌더링하는데 페이지에 필요한 데이터를 가져오는 곳은 pre-fetching 된 json 파일. 페이지로 이동 후 데이터를 fetch할 필요가 없다.

<br>

### fallback

사전 생성되어야 할 페이지가 많을 때 도움이 된다.

많은 페이지를 사전 생성하면 시간이 너무 오래 걸린다. 그리고 방문객이 거의 없는 페이지의 사전 생성은 시간과 자원 낭비이다.

```tsx
export const getStaticPaths: GetStaticPaths = () => {
  return {
    paths: [{ params: { pid: 'p1' } }],
    fallback: true,
  }
}
```

true를 사용하면 포함되지 않은 페이지라도 페이지 방문 시 로딩되는 값이 유효할 수 있도록 요청할 수 있다. 사전 생성되는 것이 아니고 요청이 서버에 도달하는 순간에 생성된다. 필요한 경우에만 사전 생성되게 할 수 있다.

여기서 문제가 있는데 직접 url에 입력해 접속하면 에러가 발생한다. 에러가 발생하는 이유는 동적 사전 생성 기능이 즉시 끝나지 않기 때문이다. fallback 기능을 쓰려면 컴포넌트에서 fallback 상태를 반환할 수 있게 해줘야 한다.

`fallback: ‘blocking’`으로 설정할 경우 페이지가 서비스를 제공하기 전에 Nextjs가 서버에서 완전히 사전 생성되도록 기다린다.

```tsx
export const getStaticPaths: GetStaticPaths = () => {
  const data = getData()
  const ids = data.products.map((product) => product.id)
  const pathsWithParams = ids.map((id) => ({ params: { pid: id } }))

  return {
    paths: pathsWithParams,
    fallback: false,
  }
}
```

나중에 fetching할 실제 데이터와 동일한 데이터를 불러와 paths params를 생성한다.

사전 생성되지 않은 id의 페이지를 불러올 경우 404 에러 페이지가 뜬다. fallback을 true로 설정한다면 파일에서 찾을 수 없는 id에 대해서도 페이지를 렌더링할 수 있다. 데이터가 아직 없는 페이지를 반환하고 백그라운드에서 데이터를 불러와서 페이지를 다시 렌더링한다. 로딩 fallback 페이지 필요하다. 데이터에 해당 값이 없을 경우 정적 프로퍼티를 가져오지 못한다.

use case에 따라 알맞은 프로퍼티를 활용하자. 옵션은 많다.

<br>

## Server-side Rendering

getStaticProps와 getStaticPaths 내부에서는 들어오는 실제 요청에 접근할 수 없다. 실제 요청만을 위해 호출한 것이 아니다. ISR은 유효성 검사 때문에 유입되는 요청을 위해 호출하기도 하지만 일반적으로 프로젝트를 build할 때 호출한다. 일반적으로 실제 요청에 접근할 필요도 없다.

SSR은 유입되는 모든 요청에 대한 페이지를 사전 렌더링하는 것이다. 모든 요청에 대해서나 서버에 도달하는 특정 요청 객체에 접근할 필요가 있다 (ex 쿠키를 추출해야 하는 경우). Nextjs는 SSR을 지원하는데 이는 페이지 컴포넌트 파일을 추가할 수 있는 함수를 제공한다는 것이다. **_페이지 요청이 서버에 도달할 때마다 실행되는 함수._** 빌드 시간이나 매초마다 사전 생성하지 않고, 서버에서만 작동하는 코드이다. 배포 후 유입되는 모든 요청에 대해서만 재실행된다.

```tsx
export async function getServerSideProps() {...}
```

**_해당 페이지에 대한 요청이 들어올 때마다 실행한다._**

getStaticProps나 getServerSideProps 둘 중 하나만 선택해서 사용해야한다. 동일한 작업을 수행해 충돌이 일어날 수 있다.

### getServerSideProps

쿠키와 헤더가 든 요청 객체에 접근해서 어느 사용자가 요청을 보냈는지 알아내는 것이다. 어느 사용자가 접근하는지도 모르고 쿠키에도 접근할 수 없으므로 pre-rendering을 수행할 수 없다. 이럴 때 사용하는 함수가 `getServerSideProps`

```tsx
export const getServerSideProps: GetServerSideProps = () => {
  return {
    props: {},
  }
}
```

이때 반환할 객체는 getStaticProps와 같은 포맷으로 설정해야 한다. (revalidate 프로퍼티는 설정하지 않는다.)

getServerSideProps 함수는 들어오는 요청에 전부 유효성 검사를 실행한다.

프로젝트를 생성하기 전에 불러오는 것이 아니라 요청이 들어올 때마다 불러오는 것이다. 이 함수는 배포된 서버와 개발 서버에서만 실행된다. 사전에 생성된 정적 함수는 아니다.

서버에서만 실행된다는 것은 무슨 의미일까?

context 객체를 보면 알 수 있다. getStaticProps와 다르게 요청 객체 전체에도 접근할 수 있게 된다. 응답 객체에 접근해서 해당 요청을 조정하거나 헤더도 추가할 수 있다. **_요청, 응답 객체 (Node.js 기본 입력 메시지와 응답)_**

[https://nodejs.org/api/http.html#http_class_http_incomingmessage](https://nodejs.org/api/http.html#http_class_http_incomingmessage)

[https://nodejs.org/api/http.html#http_class_http_serverresponse](https://nodejs.org/api/http.html#http_class_http_serverresponse)

적절한 응답을 얻을 때까지 필요한 만큼 요청 객체를 조종할 수도 있고, 요청이 가기 전에 조정하는 방법도 있다 (헤더 추가, 쿠키 추가). 그리고 서버에 도달한 요청 객체를 분석해서 거기서 들어오는 데이터를 읽을 수 있다 (해당 요청에 달린 헤더, 쿠키 데이터).

가장 큰 차이는 context 객체에 접근할 수 있는 데이터 종류가 다르고 함수가 실행되는 시점이 다르다는 점이다.

<br>

### 동적 페이지에서 사용하는 방법

getServerSideProps를 사용하면 getStaticPaths를 사용할 필요가 없다 (있을 수 없다).

```tsx
export const getServerSideProps: GetServerSideProps = (context) => {
  const { params } = context
  const userId = params?.uid

  return {
    props: {
      userId,
    },
  }
}
```

/u1으로 이동했을 때 getStaticPaths를 사용하지 않고도 코드가 정상적으로 작동한 이유는 이 함수는 서버에서만 작동하므로 Nextjs에서는 아무 페이지도 사전 생성할 필요가 없고 사전 생성할 대상이 없으니 getStaticPaths 정보가 필요하지 않기 때문이다.

getStaticProps를 사용해 페이지를 사전 생성할 때는 Nextjs에게 어떤 매개변수값의 페이지를 사전 생성해야할지 알려주기 위해 getStaticPaths 사용. getServerSideProps는 서버 사이드 코드에서 모든 요청을 처리하기 때문에 사전 생성할 필요도 동적 경로 또한 미리 설정할 필요도 없다.

<br>

### 내부에서 일어나고 있는 일

<img width="770" alt="build-with-server-side-rendering" src="https://user-images.githubusercontent.com/78616893/193773223-fba32fe0-8565-450a-9edd-95be7dd980c7.png">

user-profile 페이지는 사전 생성되지 않는다. 그 이유는 람다 기호로 end signal을 표시했기 때문이다. 람다 기호가 있는 페이지들은 사전 생성하지 않고 서버 측에서만 pre-rendering 되었다는 뜻이다.

start 했을 때 해당 페이지에 접속하고 프로덕션 서버를 실행한 터미널을 확인해 보면 콘솔로그가 찍혀있는 것을 볼 수 있다. **_페이지는 사전 생성되지 않았다!_**

세 함수의 차이점은 정적인 사전 생성 그리고 서버에서만 실행되는 서버 측 코드의 차이. 컴포넌트에 사용하는 데이터를 서버에서 미리 준비해서 클라이언트에게 완성된 페이지를 제공하면 사용자는 처음부터 완성된 페이지에서 모든 콘텐츠를 이용할 수 있게 된다. 그 외에도 검색 엔진 최적화에도 도움이 된다.

<br>

## Client-side Data Fetching

사전 렌더링을 할 필요가 없거나 사전 렌더링을 할 수 없는 데이터를 다루게 될 것이다.

- 갱신 주기가 잦은 데이터 (방문했을 때 최신 데이터를 가져와 백그라운드에서 업데이트가 더 나은 방안)
- 특정 유저에만 한정되는 데이터 (최근 주문 내역, 계정에서의 데이터)
- 데이터의 일부분만 표시하는 경우. 페이지의 정보는 개인적이기 때문에 React 앱에 포함된 데이터를 사용자가 방문할 때만 불러오도록 해야 한다.
- …

클라이언트에서 코드가 실행될 때 컴포넌트에서 데이터를 가져오도록 구축

[https://firebase.google.com/?hl=ko](https://firebase.google.com/?hl=ko)

firebase: 백엔드 환경을 설정할 수 있는 구글에서 제공하는 서비스. 주요 기능으로 API가 탑재된 DB

firebase의 realtime db을 이용해 예제 진행. 생성 → 테스트모드에서 시작 (외부에서 DB에 접근)

장점은 내용을 직접 확인할 수 있고 API를 활용해 요청을 전송하면 firebase에서 db 연산으로 자동으로 변환해준다. API 요청을 하면 자동으로 데이터의 입력과 삭제 등 원하는 대로 요청을 처리해 준다.

useEffect는 모든 컴포넌트의 최초 평가와 렌더링을 마친 뒤 실행되도록 설계되어 있다. 첫 렌더링 사이클에서는 sales가 정의되어 있지 않다.

페이지 소스에서 보면 빈 ul만 볼 수 있다. 페이지는 여전히 Nextjs에서 pre-rendering되었기 때문이다. 이 페이지에서 사용된 데이터는 사전에 준비된 데이터가 아니다. Nextjs에서 페이지를 pre-rendering할 때 useEffect를 거치지 않는다. Nextjs는 useEffect와 상관없이 컴포넌트에서 최초로 반환하는 결과로 pre-rendering을 진행하고 그런 이유로 아무런 데이터가 없다. (sales는 최초에 undefined)

pre-rendering이 이루어지지만 데이터가 없고 데이터를 클라이언트 사이드에서 fetching하고 있다.

<br>

### useSWR (stale-while-revalidate)

[https://swr.vercel.app/ko](https://swr.vercel.app/ko)

```tsx
useSWR(<request-url>, (url) => fetch(url).then(res => res.json()))
```

이전에 작성한 코드의 장점은 전체 컴포넌트 상태를 완전히 제어할 수 있으며 데이터 fetching 방식을 통제한다. 이런 패턴은 일반적이다. 자체 사용자 정의 훅을 생성하여 거기에 아웃소싱하거나 서드 파티 훅을 사용할 수 있다.

```bash
npm install swr
# or
yarn add swr
```

useSWR

Nextjs에서 개발한 hook. HTTP 요청을 보낼 때 fetch API를 사용한다. 캐싱, 자동 유효성 재검사, 에러 시 요청 재시도 등 여러 기능이 내장되어 있다. 컴포넌트에서 직접 사용해야 한다.

하나 이상의 인수로서 보낼 요청의 식별자가 필요한데 일반적으로 url. 식별자라고 부르는 이유는 같은 url에 여러 요청을 한번에 묶어 보내기 때문이다. 특정 기간 동안 한번의 요청으로 전송한다. 두번째 인수로 fetcher() 함수를 넣어도 된다. 요청이 어떤 방식으로 전송될지 정하는 함수이다.

컴포넌트가 로딩되면 url로 요청이 전송. 훅으로 반환된 데이터로 작업을 할 수 있다.

여기서 firebase를 통해 오는 데이터를 변환해야하는데, 변환 방법에는 두 가지가 있다.

자체 fetcher 함수를 정의 또는 useEffect (단순히 데이터 변환에만) 사용

```tsx
const fetcher = (url: string) =>
  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      const transformedSales = []

      for (const key in data) {
        transformedSales.push({
          id: key,
          userName: data[key].userName,
          volume: data[key].volume,
        })
      }

      return transformedSales
    })

const LastSalesPage = () => {
	const { data, error } = useSWR(
    'https://nextjs-udemy-ed3f6-default-rtdb.firebaseio.com/sales.json',
    fetcher
  )

	...
}
```
