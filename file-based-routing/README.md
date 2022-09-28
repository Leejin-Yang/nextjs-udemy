# 파일 기반 라우팅

기존 React에는 라우터가 없다. (react-router 사용)

라우터는 url을 확인해 url이 변경될 때 브라우저가 요청을 서버로 보내는 대신에 React를 통해 페이지 상에 다른 콘텐츠를 렌더링. 다른 컴포넌트를 보여주는 것. 일반적으로 React를 통해 구축되는 SPA 상에 있는 것이기 때문에.

React를 사용하면 라우팅은 코드에 설정된다. 라우팅 코드 작성과 페이지로서 작동하는 컴포넌트를 저장하는데 이 컴포넌트가 라우트 설정을 모방한다고 볼 수 있다.

Nextjs에서는 코드 내 라우트 정의를 사용할 필요가 없다. 파일과 폴더에 페이지와 라우트를 정의하게 된다. 페이지가 지원하는 라우트와 path를 정의하는 pages(폴더명 변경 불가) 폴더에 구조화.

### Fullstack

React 프로젝트에 백엔드 코드를 추가하는 작업 수월하게 할 수 있다. 파일 시스템으로 작동 하거나 DB로 전달 되는 독립적인 백엔드 코드도 포함하는 React 프로젝트. Nextjs를 사용해 Nodejs 로 쉽게 백엔드 API를 추가할 수 있다. 독립적인 REST API 프로젝트를 구축할 필요 없이 하나의 프로젝트로 작업하면서 클라이언트와 백엔드 코드 융합이 가능하다.

## 프로젝트 생성 & 분석

[https://nextjs.org/docs/getting-started](https://nextjs.org/docs/getting-started)

```bash
npx create-next-app@latest
# or
yarn create next-app

# 타입스크립트 설정
npx create-next-app@latest --typescript
# or
yarn create next-app --typescript
```

### 폴더 분석

- pages: 파일 기반 라우팅을 설정. 애플리케이션을 구성하는 다양한 페이지들을 정의
- styles
- public: 페이지가 사용할 수도 있는 공공 리소스인 이미지 파일등이 있다. React와 다르게 index.html이 없는데, Nextjs는 내장된 사전 렌더링이 포함되어 있기 때문이다. 요청이 서버로 도달할 때에 SPA의 단일 페이지가 동적으로 사전 렌더링 되어 콘텐츠를 포함한 초기 페이지를 반환하는 것(정확히는 Nextjs로 페이지가 언제 사전 렌더링 될지 결정할 수 있게 된다. 후에 자세히 설명)

### script

```bash
# 개발 서버 실행
npm run dev
# or
yarn dev
# React에서 start

# 빌드, 프로덕션 용으로 구축
npm run build
# or
yarn build

# 최적화된 서버를 시작
npm run start
# or
yarn start
```

## 페이지 & 파일 기반 라우팅

React에서의 코드 기반 (react-router-dom) → 파일 기반

### 파일 기반 라우팅

React에서는 라우터 코드가 있고, 여기에 라우트에 관련된 다양한 컴포넌트를 react-router-dom으로부터 추가한다.

Nextjs에서는 라우트와 페이지 구조를 정의하는데에 코드를 작성하지 않는다. React 컴포넌트 파일을 생성. pages 폴더를 사용하는데 Nextjs가 라우트 구조를 도출하는데 있어 이 폴더를 자동으로 확인한다.

어떻게 동작하는지?

Nextjs는 pages 폴더를 확인하고 라우트 몇 개를 추론

파일 이름을 경로로 취한다. (index.js는 예외. index.js는 현재 속한 폴더를 위한 라우트 경로로 가정하게 될 특별한 이름)

대괄호가 들어간 파일 이름(ex) [id].js): 동적 경로를 추가하는데 사용.

```bash
/page
	index.js # main page (domain.com/)
	about.js # about page (domain.com/about)
	/products # 파일 이름이나 폴더 이름으로 페이지 경로
		index.js # products page (domain.com/products)
		[id].js # 동적 경로 제품 상세 정보와 같이 같은 페이지에서 보여줄 때
		# (domain.com/products/1)
```

파일 안에 일단 React 컴포넌트를 추가하면 된다! 라우팅 시스템을 통해 index.js 파일에 요청이 들어오면 Nextjs가 그 컴포넌트를 렌더링

```jsx
const Home = () => {
  return (
    <div>
      <h1>The Home Page</h1>
    </div>
  )
}

export default Home
```

페이지에 할당할 하위 폴더를 만들거나 페이지 이름의 파일을 만들거나 선택하면 된다. 하위 폴더로 페이지를 만들 경우 여러 세그먼트로 구성된 중첩 경로를 설정할 수 있다.

```bash
/page
	index.js
	/portfolio
		index.js
		list.js # 중첩 경로 (domain.com/portfolio/list)
```

하나의 컴포넌트에서 id나 slug에 따라 데이터를 로드할 때 동적 라우팅 컴포넌트. 대괄호 안에 식별자를 정해 파일명 설정(ex [id].js). 꼭 대괄호를 붙여야 한다. 어느 값이 들어와도 해당 컴포넌트로 이동한다. 그러나 id의 값이 인식되면, 동일한 이름을 가진 파일이 있는지 확인한다(id로 list가 온 경우 list.js를 보여준다.). 동적 라우팅 페이지 파일보다 이미 정의된 정적 라우팅 페이지 파일을 우선시하기 때문이다.

그렇다면 사용자가 url에 입력한 값에 접근하려면 어떻게 해야할까? `useRouter`

```tsx
import type { NextPage } from 'next'
import { useRouter } from 'next/router'

const PortfolioProject: NextPage = () => {
  const router = useRouter()

  console.log(router.pathname)
  console.log(router.query)

  return (
    <div>
      <h1>The Portfolio Project Page</h1>
    </div>
  )
}

export default PortfolioProject
```

```bash
# domain.com/portfolio/something

# router.pathname
/portfolio/[id]

# router.query
{ id: something }
```

- router.pathname: 페이지 출력을 위한 컴포넌트 파일 경로. Nextjs가 해당 컴포넌트에 접근하는 경로.
- router.query: url에 부호화된 구체적인 데이터에 접근할 수 있다. 즉 동적 경로 세그먼트에 대한 구체적인 값에 접근할 수 있다. 대괄호 안에 정해준 식별자를 키로 가지고 url에 입력한 something이 객체의 값이 된다.

동적 라우트를 이용할 때 알아야 할 두 가지의 흥미로운 변형식 또는 확장식이 있다.

- 중첩된 동적 경로

```bash
/pages
	/clients
	index.js
	/[id] # 동적 세그먼트 폴더
		index.js # 선택한 클라이언트의 프로젝트 목록이 있는 페이지
		[clientProjectId].js # 선택한 클라이언트의 선택한 프로젝트 페이지
```

```bash
# [clientProjectId].js

router.query
{ id: 'max', clientProjectId: 'project1' }
```

동적인 [id] 폴더에 있으므로 id 값에 접근한 후 동적 파일인 [clientProjectId]에 있는 clientProjectId 값에도 접근한다.

- Catch-All 라우트

어떤 경로이며 얼마나 많은 세그먼트를 갖는지에 상관없이 동일한 컴포넌트를 보여준다. 세그먼트의 개수도 동적으로 작동한다.

```bash
/pages
	/blog
	[...slug].js
```

```bash
# [...slug].js

# domain.com/blog/2020/12
router.query
{ slug: ['2020', '12'] } # 이전과 다르게 문자열이 아니라 배열로 온다.
```

### Link

링크를 통해 페이지 이동하거나 특정 행동을 취했을 때 이동하도록

a 태그를 사용했을 때 단점이 있다. 새 페이지를 불러오기 위해 새 HTTP 요청을 보냈을 때 발생한다. React 앱을 실행할 때 갖는 앱 상태가 바뀌는 상황. 전역 상태도 새 요청으로 새 HTML 페이지를 받음으로써 변경될 수 있다. Nextjs가 아니어도 React 앱을 만드는 방식으로는 적합하지 않다.

`next/link`의 `Link`를 사용한다.

```tsx
import type { NextPage } from 'next'
import Link from 'next/link'

const Home: NextPage = () => {
  return (
    <div>
      <h1>The Home Page</h1>
      <ul>
        <li>
          <Link href='/portfolio'>
            <a>Portfolio</a>
          </Link>
        </li>
      </ul>
    </div>
  )
}

export default Home
```

백엔드로 HTTP 요청을 보낼 필요 없고 앱 상태가 바뀌지 않는다. (최적화 기능도 있는데, 예를 들면 링크에 마우스를 갖다 대자마자 이동하려는 페이지로 자동으로 데이터를 미리 fetching하는 방법이 있다…)

동적 라우트로 navigating

```tsx
<Link href='/clients/leejin'><a>Leejin<a></Link>
// router.query로 leejin을 가져온다.
```

Link의 href 프로퍼티에 문자열 대신 전달할 대안 값이 있다. 객체로 작성할 수 있다. 문자열이나 객체 표현을 선택해서 사용하면 된다.

```tsx
<Link href={{
	pathname: '/clients/[id]', // Nextjs에서 파일 경로
	query: { id: 'leejin' }, // 전달할 값
}}><a>Leejin<a></Link>
// router.query로 leejin을 가져온다.
```

명령형으로 페이지 이동하는 버튼. 특정 행동을 취했을 때나 제출한 폼을 파싱할 때 페이지 이동을 위해 사용한다. `router.push` or `router.replace`

replace는 현재 페이지를 코드의 페이지로 대체할 때 사용. 페이지 이동 후 뒤로가기 불가능.

```tsx
import type { NextPage } from 'next'
import { useRouter } from 'next/router'

const ClientProjects: NextPage = () => {
  const router = useRouter()
  const { id } = router.query

  const onProjectClick = () => {
    // load data...
    router.push(`/clients/${id}/projectA`)
    // or
    // router.replace(`/clients/${id}/projectA`)
  }

  return (
    <div>
      <h1>The Client Projects Page</h1>
      <button type='button' onClick={onProjectClick}>
        Load Project A
      </button>
    </div>
  )
}

export default ClientProjects
```

### Custom 404

pages 폴더에 404.js(이름 fix)

### 파일 기반 라우팅 vs 코드 기반 라우팅

| 파일 기반 (Nextjs)                                                               | 코드 기반 (React + react-router) |
| -------------------------------------------------------------------------------- | -------------------------------- |
| 추가 작성해야 할 상용구 코드가 없다                                              | 상용구 코드 (Switch, Route …)    |
| 어떤 라우트를 지원하는지 확인하는 코드가 있으니 파일 시스템을 살펴볼 필요가 없다 |
| 컴포넌트 생성에 직관적                                                           | 코드로 한번에 볼 수 있어 직관적  |
| 파일과 폴더 구조만 있으면 된다                                                   | 파일과 폴더 설정이 중요하지 않다 |
