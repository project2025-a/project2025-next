# Spoteditor (스팟에디터)

## 🗺️ About Spoteditor

**계획된 일정, 완벽한 하루**  

낯선 곳을 여행할 때마다 맛집, 액티비티, 주변 명소를 찾느라 한참을 검색하곤 했어요.  
만약 이 도시를 잘 아는 친구가 **내 코스를 계획해준다면?**  

**Spoteditor**는 사용자가 지도를 검색하여 여러 장소를 선택하고, 이미지와 설명을 추가해 하나의 ‘로그’ 단위로 발행하는 SNS 기반 웹 어플리케이션입니다.

</br>

## 📌 Service Features

1. **로그 등록**: 카카오 맵을 통해 장소를 선택하고, 이미지와 설명을 추가하여 나만의 로그를 작성할 수 있습니다.
2. **장소 검색 및 조회**: 검색어 입력 또는 셀렉트 박스를 활용하여 원하는 장소를 손쉽게 찾을 수 있습니다.
3. **커뮤니티 기능**: 북마크 및 팔로우 기능을 통해 관심 있는 유저, 장소, 로그를 마이페이지에서 간편하게 관리할 수 있습니다.
4. **반응형 디자인**: 데스크탑과 모바일에서 최적화된 UI/UX를 제공합니다.

## 🛠️ Tech Stack

<table>
  <tr>
    <td><strong>Frontend</strong></td>
    <td>
      <img src="https://img.shields.io/badge/Next.js-000000?logo=next.js&logoColor=white" />
      <img src="https://img.shields.io/badge/Tailwind_CSS-06B6D4?logo=tailwindcss&logoColor=white" />
      <img src="https://img.shields.io/badge/Shadcn_UI-%23EDEDED?logo=storybook&logoColor=black" />
    </td>
  </tr>
  <tr>
    <td><strong>State / Form</strong></td>
    <td>
      <img src="https://img.shields.io/badge/Zustand-000000?logo=zotero&logoColor=white" />
      <img src="https://img.shields.io/badge/TanStack_Query-FF4154?logo=react-query&logoColor=white" />
      <img src="https://img.shields.io/badge/React_Hook_Form-EC5990?logo=reacthookform&logoColor=white" />
      <img src="https://img.shields.io/badge/Zod-3E52B5?logo=graphql&logoColor=white" />
    </td>
  </tr>
  <tr>
    <td><strong>Backend 연동</strong></td>
    <td>
      <img src="https://img.shields.io/badge/Supabase-3ECF8E?logo=supabase&logoColor=white" />
      <img src="https://img.shields.io/badge/Prisma-2D3748?logo=prisma&logoColor=white" />
    </td>
  </tr>
  <tr>
    <td><strong>Mock / 테스트</strong></td>
    <td>
      <img src="https://img.shields.io/badge/MSW-FF6A00?logo=msw&logoColor=white" />
    </td>
  </tr>
</table>



</br>

## 📂 Folder Structure

```
📦src
 ┣ 📂app                     # Next.js 15 App Router 구조
 ┃ ┣ 📂(root)               # 홈, 로그인, 프로필 등 메인 페이지
 ┃ ┣ 📂(write)              # 로그 등록 및 수정 페이지
 ┃ ┣ 📂(no-header-footer)   # 약관, 공지 등 header/footer 없는 페이지
 ┃ ┣ 📂actions              # 서버 액션 (Server Actions)
 ┃ ┣ 📂api                  # API 라우트 핸들러 (Route Handlers)
 ┃ ┣ 📂assets               # 폰트, 이미지 등 정적 리소스
 ┃ ┗ 📜layout.tsx          # 앱 전체 레이아웃

┣ 📂components              # UI 공통 컴포넌트
 ┃ ┣ 📂common              # 버튼, 카드, 헤더, 모달 등
 ┃ ┣ 📂features            # 페이지 단위 컴포넌트 모음
 ┃ ┗ 📂ui                  # Shadcn 기반 UI 컴포넌트 래퍼

┣ 📂constants               # 상수 데이터 (도시 목록, 태그 등)
┣ 📂hooks                   # React 커스텀 훅
 ┃ ┣ 📂mutations
 ┃ ┣ 📂queries
 ┃ ┗ 📜...

┣ 📂lib                     # Supabase 클라이언트, 유틸, Zod 스키마 등
┣ 📂providers               # React Provider 설정 (QueryClient 등)
┣ 📂stores                  # Zustand 기반 글로벌 상태 관리
┣ 📂styles                  # 글로벌 스타일 (Tailwind 포함)
┣ 📂types                   # 타입 정의 (API, 스키마 등)
┣ 📂utils                   # 유틸 함수 모음
┗ 📜middleware.ts          # 미들웨어 설정

```

</br>

## 🚀 Getting Started


### 1. 프로젝트 클론
git clone https://github.com/project2025-a/project2025-next.git

### 2. 의존성 설치
npm install

### 3. 환경 변수 설정 (.env 파일 생성 후 아래 값 입력)
#### Supabase 설정
NEXT_PUBLIC_SUPABASE_URL=Supabase 프로젝트 URL  
NEXT_PUBLIC_SUPABASE_ANON_KEY=Supabase 공개 키

#### Prisma 설정 (Supabase DB 접속용)
DATABASE_URL=Prisma가 사용할 Supabase DB 연결 URL  
DIRECT_URL=Prisma Studio나 마이그레이션용 직접 접속 URL  

#### 로컬 개발용 사이트 주소
NEXT_PUBLIC_SITE_URL_LOCAL=로컬 개발 중 사용할 사이트 주소 (예: http://localhost:3000)

### 4. 로컬 서버 실행
yarn start

## Intro

<img width="878" alt="Image" src="https://github.com/user-attachments/assets/c7688aec-5b5a-4f0e-8203-361336b50787" />
<img width="878" alt="Image" src="https://github.com/user-attachments/assets/33161091-11e9-4270-ae75-1b7f21b57f64" />
<img width="878" alt="Image" src="https://github.com/user-attachments/assets/eb6d59bd-fb87-4cae-88de-14c7316977a3" />
<img width="878" alt="Image" src="https://github.com/user-attachments/assets/f7107d7c-f4e4-4b3a-8008-8bcc7d521348" />
<img width="878" alt="Image" src="https://github.com/user-attachments/assets/a563518a-6d82-4867-a8fb-ca8b254380dd" />
<img width="878" alt="Image" src="https://github.com/user-attachments/assets/bf1dbe7e-5510-4006-9b96-7e757b64df7a" />

## 🖥️ Demo

| Service          | Desktop | Mobile |
|-----------------|---------|--------|
| **로그 조회**  | ![Image](https://github.com/user-attachments/assets/49a60ab8-4763-4d80-aac0-6d9b94813dff) | ![Image](https://github.com/user-attachments/assets/193705da-7199-4b77-b4ad-ee70ec85b776) |
| **검색**        | ![Image](https://github.com/user-attachments/assets/b146f609-2de1-4c65-b8ca-053dff6cb23b) | ![Image](https://github.com/user-attachments/assets/2a673aa5-7d06-4461-8469-a767068ff63c) |
| **상세 페이지** | ![Image](https://github.com/user-attachments/assets/c631f3fa-2a1b-48c9-bf29-be1dd3900101) | ![Image](https://github.com/user-attachments/assets/5acccca9-7c00-4352-aedf-ed5b0fc487e8) |
| **로그 등록**  | ![Image](https://github.com/user-attachments/assets/ce700e70-ea4b-44ae-ad0f-acfd20c05874) | ![Image](https://github.com/user-attachments/assets/45e34b7f-4ecf-47ce-a63d-d16f8d128fcc) |
| **로그 수정**  | ![Desktop](https://github.com/user-attachments/assets/6c86cfea-c45d-42b2-9a6a-81737f262e8a) | ⏳ |
| **마이페이지** | ![Image](https://github.com/user-attachments/assets/d7e8b0c1-dc5d-423d-af15-131b754b6912) | ![Image](https://github.com/user-attachments/assets/c1266e57-fdc1-4463-9d02-2c58404148fc) |
| **유저 수정** | ![Image](https://github.com/user-attachments/assets/32183a84-c4f6-4ef7-8464-53d9c8525a9e) | ![Image](https://github.com/user-attachments/assets/823b019f-37c5-4b64-9280-e30bbc128472) |

