# Next Authentication

## 인증은 어떤 원리로 동작하는가?

클라이언트가 브라우저를 통해 해당 페이지를 방문하고 서버는 해당 페이지를 제공한다. 여기에서 서버는 회원가입을 한 사용자를 저장하는 DB에 연결된다.

로그인을 한다면 요청을 보낼 때 사용자의 데이터를 함께 보낸다. 그리고 서버에서 해당 입력값의 유효성 검사를 한다. DB에 접근해 해당 사용자 계정이 확인해 볼 수 있다. 그리고 입력된 비밀번호가 DB에서 찾은 비밀번호와 일치하면 인증이 완료되었다는 응답을 돌려보낸다. 아니면 인증 요청이 거부된다. 여기서 yes or no 응답으로는 부족하다. 인증된 척하며 요청을 보낼 수 있으니 그냥 믿을 수 없다. 그래서 인증에는 권한을 위한 크리덴셜 교환이 수반된다. 이를 위한 주요 메커니즘이 두가지 있다. **서버사이드 세션과 인증 토큰.**

이 메커니즘은 위조 불가능한 권한 문제를 해결하기 위한 일반적인 접근 방식이다.

### 서버사이드 세션

서버에 고유 식별자를 저장하는 방식으로 작동. 고유한 세션 id를 생성하고 서버에 저장. 크리덴셜을 전송하는 클라이언트에 동일한 식별자를 보내는 것. 그러면 클라이언트는 해당 식별자를 저장하고 그리고 요청을 보낼 때 저장된 식별자를 첨부해주면 된다. 서버는 요청이 들어오면 식별자를 추출해 검사한다. 누가 훔쳐가면 어떡하냐? 연결을 암호화하는데 SSL을 사용하니까 전송 중에 도난 당할 수 없다.

클라이언트 사이드에선 대체로 쿠키에 식별자를 저장. 사이트 간 스크립팅 공격을 방지하기 위해 js를 통해서는 쿠키에 접근할 수 없도록 구성할 수 있다. 그러면 서버에서만 읽을 수 있다. js로 접근이 가능하다해도 어쨌든 공격은 막아야 한다.

### 인증 토큰

여기선 서버가 어떤 식별자도 저장하지 않는다. 대신 서버는 임의의 문자열이라 할 수 있는 토큰을 생성하고 서명한다. 다양한 데이터 조각을 가져와 서명하고 이 토큰을 클라이언트로 전송한다. 클라이언트는 해당 토큰을 저장하고 나가는 요청에 다시 첨부해 서버에 접근을 허가해도 된다고 알린다. 서버는 토큰을 DB에 저장하지 않더라도 해당 토큰에 어떻게 서명했는지 기억하고 있다. 그래서 자신이 만든건지 아닌지 확인할 수 있다.

SPA에서 세션보다는 토큰을 주로 이용한다. 페이지는 직접 제공되고 반드시 서버에 도달하지 않아도 로직으로 채워진다. 프론트엔드 js를 통해 동적으로 로드 및 생성된다. 방문하는 모든 페이지마다 요청을 보내는 것이 아니다. 그러므로 서버가 인증 여부를 직접 확인할 수 없는 상태에서 페이지가 로드된다. 또한 SPA에서 사용되는 백엔드 API는 일반적으로 stateless다. 연결된 개별 클라이언트를 따로 신경 쓰지 않는다. API 자체는 연결된 클라이언트에 대한 어떠한 추가 정보도 저장하지 않는다.

분리된 프론트엔드 백엔드 조합. 서버는 인증된 클라이언트의 정보를 저장하지 않는다. 대신 클라이언트가 본인이 인증되었음을 증명할 독립적 권한을 얻어야 한다. 그래서 토큰(JSON Web Token)을 사용한다.

### JWT

세 개의 주요 블록으로 구성된다.

- Issuer Data: 토큰이 생성될 때 서버에 의해 토큰에 자동으로 추가되는 데이터.
- Custom Data: 사용자 정보와 같은
- Secret Signing Key: 비밀키를 서버에 설정한다. 클라이언트는 절대 그 키를 볼 수 없다. 해당 키가 있어야만 서버가 인정하는 유효 토큰을 생성할 수 있다.

이 모든 데이터를 포함하는 임의의 문자열을 만들고 해당 키로 서명해서 토큰을 생성한다.

서명은 암호화를 뜻하는게 아니다. JWT는 암호화되지 않는다. 열어서 내부의 데이터를 읽을 수 있다. 키는 주어진 서버가 그 토큰을 생성했다는 사실만 증명한다. 물론 키는 토큰에 포함되지 않는다.

토큰은 클라이언트 사이드 브라우저에 저장되어 서버의 보호된 리소스에 대한 요청에 첨부된다. 두 개의 보호된 API 라우트. 만약 비밀번호를 변경한다하면 요청에는 예전 비밀번호와 새 비밀번호 뿐만 아니라 해당 토큰도 포함되어야 한다. 그리고 그 토큰은 서버에서 이런 유효성 검사를 받는다. ‘나만 알고 있는 서명 키가 있는데 이걸로 이 토큰 만들 수 있나요?’

<br>

## NextAuth

[https://next-auth.js.org/](https://next-auth.js.org/)

서버와 클라이언트에서 모두 사용 가능. 하지만 사용자 생성 관리는 해주지 않는다. 많은 DB를 지원하지만 대체로 다른 인증 메서드를 위한 것이다. 자체 사용자 계정을 사용할 경우에는 자체적인 회원가입 API 라우트와 사용자 인증 논리를 가져와야 한다.

사용자 계정에 대한 인증 체계를 구축하고자 할 때 먼저 사용자를 추가하는 논리를 구성해야 한다. 그래야만 nextauth에서 그 사용자에 대해 인증을 진행하고 사용자에게서 토큰을 가져오기 때문이다.

### 사용자 추가

비밀번호를 DB에 저장할 때 그대로 저장하면 안된다. 보안성을 높이기 위해서는 해독할 수 없도록 암호화한 다음에 저장해야 한다. `bcryptjs`

```tsx
import { hash } from 'bcryptjs'

export async function hashPassword(password: string) {
  const hashedPassword = await hash(password, 12)
  return hashedPassword
}
```

같은 이메일은 가입할 수 없게 해야한다. db에서 유저를 찾아 유효성 검사를 한다.

### 인증 설정

인증을 통해 사용자를 로그인하고 로그인 권한을 얻으며 다시 말해 로그인된 사용자의 토큰을 얻고 사용자 로그인을 확인할 수 있다. 뷰를 바꾸고 특정 라우트를 비활성화하는 클라이언트 사이드 / 추가될 여러 API 라우트의 서버 사이트 양쪽에 로그인했는지 확인한다. 여기서 nextauth가 필요하다.

nextauth를 통해 사용자를 인증하고 사용자가 권한을 가지는지 여부를 확인할 수 있다. 해당 토큰의 생성 및 저장을 관리함으로써 그렇게 할 수 있다. 로그인 api를 생성해보자

catch-all route가 필요하다. nextauth 패키지가 내부에서 여러 라우트를 활용하기 때문에. 예를 들어 사용자 로그인 및 사용자 로그아웃. 이 라우트를 향한 요청을 nextauth가 모두 자동으로 처리하도록 한다. 추가로 자체 라우트를 정의할 수 도 있다. nextauth의 내장된 경로를 오버라이드 하지 않는 한

[https://next-auth.js.org/getting-started/rest-api](https://next-auth.js.org/getting-started/rest-api)

```tsx
import NextAuth from 'next-auth/next'

export default NextAuth()
```

실행시키면 새로운 함수를 반환한다(handler). NextAuth를 호출할 때 구성 객체를 전달할 수 있다. 그 객체를 통해 동작을 구성할 수 있다.

[https://next-auth.js.org/configuration/options](https://next-auth.js.org/configuration/options)

[https://next-auth.js.org/getting-started/upgrade-v4](https://next-auth.js.org/getting-started/upgrade-v4) 버전업

[https://next-auth.js.org/configuration/providers/credentials](https://next-auth.js.org/configuration/providers/credentials)

providers: CredentialsProvider

- credentials: 대신 로그인 양식을 만들어준다.
- authorize(credentials): 들어오는 로그인 요청을 Nextjs가 수신할 때 Nextjs가 대신 호출해준다. 객체를 반환하면 jwt로 부호화된다. jwt가 생성되었는지 확인하려면
- 고유의 인증 논리

session: jwt가 생성되었는지 확인하려면. 인증된 사용자에 대한 세션을 관리하는 방법을 구성할 수 있다. db를 지정하지 않으면 자동으로 jwt 프로퍼티가 true 값을 가진다. 다른 프로바이더를 사용한다면 db를 추가하고 세션을 사용할 수 있다.

### 클라이언트 사이드 로그인

[https://next-auth.js.org/getting-started/client#signin](https://next-auth.js.org/getting-started/client#signin)

![login-result-console](https://user-images.githubusercontent.com/78616893/195826329-5bcfd3fb-3383-432a-bd80-8758837ecd69.png)

결과를 가지고 상태를 저장해 해당 상태에 맞는 페이지를 보여줄 수 있다. 하지만 새로고침하면 상태는 초기화. 메모리 공간 외에 영궉으로 토큰을 저장할 곳을 확보하고, 그 토큰을 통해 요청을 전송하여 api를 보호할 수 있도록 해야한다.

로그인하면 Nextjs에서 생성하고 관리하는 쿠키들이 나열된다.

- next-auth.session-token(jwt)
- next-auth.callback-url
- next-auth.csrf-token

로그인에 성공했을 때 Nextjs에서 자동으로 생성하는 토큰으로 이 토큰의 값을 기반으로 작업을 수행할 수 있다.

[https://next-auth.js.org/getting-started/client#usesession](https://next-auth.js.org/getting-started/client#usesession)

```tsx
import { useSession } from 'next-auth/react'

const { data: session, status } = useSession()
```

세션 활성 상태를 나타내는 세션 객체와 사용자가 현재 페이지에 대한 로그인 상태를 확인하는 요소

[https://next-auth.js.org/getting-started/client#signout](https://next-auth.js.org/getting-started/client#signout)

로그아웃 함수

### 인증 상태에 따라 라우트 보호

useSession과 getSession. getSession은 새 요청을 보내서 최근 세션 데이터를 가져온다.

공식 문서를 보니 여러가지 방법이 있었다.

[https://next-auth.js.org/getting-started/client#require-session](https://next-auth.js.org/getting-started/client#require-session)

useSession에서 session 필요 여부와 인증되지 않았을 때 콜백을 줄 수 있다.

클라이언트 사이드 코드만으로 페이지 리다이렉트 제어가 어렵다. 인증 여부를 알아내기 위해 클라이언트사이드 js 코드를 사용하는데 이 과정을 거치는 시간 동안 기다리는 수 밖에 없다. 서버 사이드 코드를 사용해서 요청을 보낸 사용자의 인증 여부를 확인해 다른 페이지 콘텐츠를 반환하고 리디렉션할 수 있다. getServerSideProps

useSession을 통해 세션을 가져오고 있고 어떤 페이지는 getServerSideProp으로 서버에서 세션을 가져오고 있다. 중복 요청이 발생한다. `SessionProvider` 버전이 오르면서 필수 사용으로 바뀌었다.

[https://next-auth.js.org/getting-started/upgrade-v4#sessionprovider](https://next-auth.js.org/getting-started/upgrade-v4#sessionprovider)

[https://next-auth.js.org/getting-started/client#sessionprovider](https://next-auth.js.org/getting-started/client#sessionprovider)

서버 측과 클라이언트 측 렌더링을 모두 지원하는 페이지에서 세션을 두 번 확인하는 것을 피할 수 있다.
