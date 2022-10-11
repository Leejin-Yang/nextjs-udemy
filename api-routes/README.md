# API Routes

우리가 구축하는 웹사이트는 방문자의 요청이 있을 때 HTML 페이지만을 제공하지 않는다. 그 외에도 필요한게 있다(피드백을 보내거나, 뉴스레터 구독을 신청하는 기능 등). 여기서는 출력 결과가 아니라 백엔드에서 어떤 일이 일어나는지를 이해해야 한다. DB에 저장. 이때 전송되는 요청은 HTML등을 불러오는게 아니라 입력한 데이터를 DB에 전송하는 것이다. 그럴 때 API가 필요하다.

API 라우트란 특수한 형태의 URL으로 Nextjs 앱에 추가하여 데이터를 수집하고 사용하고 DB에 저장한 뒤 원하는 형태의 데이터를 돌려보내는 역할을 한다. 도메인 뒤에 붙는 url이나 경로를 통해 여러가지 HTTP 요청을 받을 수 있는 역할을 한다. Nextjs 앱 내에서 API 엔드포인트를 정의하게 해준다.

<br>

## API Route 작성하기

Nextjs에 API 엔드포인트를 추가하기 위해서 pages 폴더 아래 `api`라는 이름의 하위 폴더를 생성해야 한다.

api 폴더 내부의 파일은 React 컴포넌트를 내보내지 않는다. 대신 함수를 하나 생성한다. Nextjs는 이 함수를 실행해서 `/api/파일이름` 으로 들어오는 요청을 처리할 것이다. 이 함수 내에서는 GET 요청만을 처리할 수 없으며 HTML 코드를 반환하지 않아도 되고 대신 설정한 서버 측 코드를 실행할 수 있다는 점이다. 서버 측 코드! 즉 여기서 추가된 코드는 클라이언트 측에는 도달하지 않는다.

```jsx
function handler(req: NextApiRequest, res: NextApiResponse<Data>) {}

export default handler
```

- res

응답을 돌려보내기 위해 status 메소드를 사용해 상태 코드를 설정한다. 그 후 받은 요청에 포함된 JSON 데이터를 반환한다. json 메소드를 사용하면 js 코드를 객체로 취급해 자동으로 JSON 형식으로 변환해준다.

```jsx
function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  res.status(200).json({ name: 'John Doe' })
}

export default handler
```

이것이 API의 표준 방식이다. API에서는 JSON 형식으로 데이터를 주고 받는다.

[https://academind.com/tutorials/connect-to-database](https://academind.com/tutorials/connect-to-database)

<br>

## form 양식을 제출해보자!

프론트엔드 앱에서 DB로 전달해서는 안된다. 컴포넌트에 DB로 전달하는 js 코드를 추가한다면 DB 크리덴셜을 노출하면 보안면에서 매우 취약하다. 그래서 버튼 클릭 시 API Route에 요청을 전송하게 한다. API Route에서 DB로 연결하면 된다.

input을 useRef로 연결해 value를 가져온다.

```tsx
import { FormEventHandler, useRef } from 'react'

const Home = () => {
  const emailInputRef = useRef<HTMLInputElement>(null)
  const feedbackInputRef = useRef<HTMLTextAreaElement>(null)

  const onFormSubmit: FormEventHandler = (e) => {
    e.preventDefault()

    const enteredEmail = emailInputRef.current?.value
    const enteredFeedback = feedbackInputRef.current?.value
  }

  return (
    <div>
      <h1>The Home Page</h1>
      <form onSubmit={onFormSubmit}>
        <div>
          <label htmlFor='email'>Your Email Address</label>
          <input type='email' id='email' ref={emailInputRef} />
        </div>
        <div>
          <label htmlFor='feedback'>Your Feedback</label>
          <textarea id='feedback' rows={5} ref={feedbackInputRef} />
        </div>
        <button type='submit'>Send Feedback</button>
      </form>
    </div>
  )
}

export default Home
```

feedback.ts에서 이메일 주소와 피드백 데이터가 있는 요청을 수신해서 DB나 파일에 저장해본다. 여기서 중요한 점은 handler 함수에서 어떤 종류의 요청으로 이 API Route를 실행하는지 확인하는 것이다.

```tsx
const onFormSubmit: FormEventHandler = (e) => {
  e.preventDefault()

  const enteredEmail = emailInputRef.current?.value
  const enteredFeedback = feedbackInputRef.current?.value

  fetch()
}
```

onFormSubmit에서 POST 요청을 보내보자. handler 함수에서 함수를 실행하는 요청의 종류를 지정해준다.

- req

req 객체에서 보면 method 프로퍼티가 있다. 이를 통해 요청의 종류를 알 수 있다. 그리고 유입된 요청으로부터 데이터를 추출하기 위해 body 프로퍼티. body 프로퍼티는 요청으로부터 이미 파싱이 완료된 본문이다.

```tsx
function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  if (req.method === 'POST') {
    const email = req.body.email
    const feedback = req.body.feedback

    const newFeedback = {
      id: new Date().toISOString(),
      email,
      feedback,
    }
  }
  res.status(200).json({ message: 'This works!' })
}

export default handler
```

우선 파일을 읽은 후 해당 파일에 있는 데이터를 fetching하고 업데이트된 데이터로 오버라이드 한다.

```tsx
function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  if (req.method === 'POST') {
    const email = req.body.email
    const feedback = req.body.feedback

    const newFeedback = {
      id: new Date().toISOString(),
      email,
      feedback,
    }

    // 그리고 이 객체를 DB나 파일에 저장한다.
    // 여기서는 파일에 저장해본다.
    const filePath = path.join(process.cwd(), 'data', 'feedback.json')
    const fileData = fs.readFileSync(filePath, { encoding: 'utf-8' }) // json 데이터
    const data = JSON.parse(fileData)
    data.push(newFeedback)
    fs.writeFileSync(filePath, JSON.stringify(data))
  }
  res.status(200).json({ message: 'This works!' })
}

export default handler
```

그리고 마지막 응답 코드를 작성한다.

```tsx
res.status(201).json({ message: 'Success!', feedback: newFeedback })
```

<br>

### 요청을 보내보자!

[https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch)

```tsx
fetch('/api/feedback', {
  method: 'POST',
  body: JSON.stringify(reqBody),
  headers: {
    'Content-Type': 'application/json',
  },
})
```

- url: /로 시작하는 것만으로 자동으로 도메인 주소 뒤에 붙어 절대 경로로 작용한다.
- method: POST를 다루고 있으므로 POST
- 요청에 첨부할 데이터는 body 프로퍼티에 담는다. 담을 때 JSON.stringify 해서 json으로 보낸다.
- header에 추가적으로 정보를 담아 보낸다.
  - json 데이터를 전송한다는 것을 알려주기 위해 ‘Content-Type’: ‘application/json’

위에 생성한 객체를 통해 전송하는 요청에 메타데이터를 추가한다. json 데이터를 전달한다는 점을 백엔드의 API Route에 알린다.

<br>

### 데이터를 가져와보자!

GET 요청을 통해 모든 데이터를 가져온다. feedback.ts 파일에 해당 코드를 추가한다.

```tsx
else {
  const filePath = getFilePath() // 앞서 작성한 파일 경로 가져오는 함수
  const data = getFileData(filePath) // 앞서 작성한 파일 가져오는 함수
  res.status(200).json({ message: 'Success!', feedback: data })
}
```

button 클릭으로 요청을 보내본다.

```tsx
const [feedbackList, setFeedbackList] = useState<FeedbackData[]>([])

const onLoadFeedbackClick = () => {
  fetch('/api/feedback')
    .then((res) => res.json())
    .then((data) => {
      setFeedbackList(data.feedback)
    })
}
```
